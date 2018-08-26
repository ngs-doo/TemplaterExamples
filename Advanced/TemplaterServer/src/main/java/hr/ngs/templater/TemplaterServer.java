package hr.ngs.templater;

import java.io.*;
import java.nio.charset.Charset;
import java.text.ParseException;
import java.util.*;
import java.util.concurrent.TimeUnit;

import com.dslplatform.json.*;
import fi.iki.elonen.NanoHTTPD;

public class TemplaterServer extends NanoHTTPD {
	private static final int PORT = 7777;
	private static final Charset UTF8 = Charset.forName("UTF-8");

	private static final String PROCESS_PATH = "/process";

	private static final String TEMPLATES_FOLDER = "/templates/";
	private static final String DRIVE_PATH = "resources";

	private static final File rootPath;

	private static final byte[] index;
	private static final byte[] indexDefault;

	static {
		File path = new File(DRIVE_PATH);
		if (!path.exists()) {
			path = new File(new File("Advanced", "TemplaterServer"), DRIVE_PATH);
		}
		rootPath = path;
		String[] files = new File(rootPath, TEMPLATES_FOLDER).list();
		Arrays.sort(files);
		InputStream stream = TemplaterServer.class.getResourceAsStream("/index.html");
		String html;
		try {
			html = new String(readStream(stream), UTF8);
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
		StringBuilder response = new StringBuilder();

		String listItemHtml = "<li><p>" +
				"<button class=\"btn btn-primary feat-btn feat-btn-lg\" data-template=\"{{template}}\">" +
				"<i class=\"fa fa-file-text\" ></i> {{template}}" +
				"</button>" +
				"</p></li>";

		for (String file : files) {
			response.append(listItemHtml.replace("{{template}}", file));
		}

		String indexContent = html.replace("${templates}", response.toString());
		index = indexContent.getBytes(UTF8);

		try {
			String defaultHtml = new String(readStream(TemplaterServer.class.getResourceAsStream("/default.html")), UTF8);
			indexDefault = defaultHtml.replace("${content}", indexContent).getBytes(UTF8);
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

	private final Map<String, byte[]> driveMap = new HashMap<>();
	private static final DslJson<Object> dslJson = new DslJson<>();

	public TemplaterServer() throws IOException {
		super(PORT);
	}

	private static byte[] readStream(final InputStream is) throws IOException {
		try {
			ByteArrayOutputStream os = new ByteArrayOutputStream();
			final byte[] body = new byte[1024];
			int read;
			while ((read = is.read(body)) > 0) {
				os.write(body, 0, read);
			}
			return os.toByteArray();
		} finally {
			is.close();
		}
	}

	/**
	 * Define routes.
	 *
	 * @param session http request
	 * @return http response
	 */
	@Override
	public Response serve(IHTTPSession session) {
		String uri = session.getUri();
		return "/".equals(uri) || "/content".equals(uri) ? newChunkedResponse(Response.Status.OK, MIME_HTML, new ByteArrayInputStream("/".equals(uri) ? indexDefault : index))
				: uri.startsWith(PROCESS_PATH) ? processTemplaterResponse(session)
				: driveContains(uri) ? createResponse(uri, driveMap.get(uri))
				: newFixedLengthResponse(Response.Status.NOT_FOUND, MIME_PLAINTEXT, "URL not found!");
	}

	private boolean driveContains(String uri) {
		if (driveMap.containsKey(uri)) return true;

		File path = new File(rootPath, uri);
		if (!path.exists() || !path.getAbsolutePath().startsWith(rootPath.getAbsolutePath())) return false;

		try {
			InputStream is = new FileInputStream(path);
			String address = path.getAbsolutePath().substring(rootPath.getAbsolutePath().length()).replace(File.separator, "/");
			driveMap.put(address, readStream(is));
			return true;
		} catch (IOException e) {
			return false;
		}
	}

	/**
	 * Define response for template process request.
	 *
	 * @param session http request
	 * @return Binary response
	 */
	private Response processTemplaterResponse(final IHTTPSession session) {
		final Map<String, String> params = session.getParms();
		try {
			session.parseBody(params);
			String templateName = params.get("template");
			String templaterTemplatePath = TEMPLATES_FOLDER + templateName;

			if (templateName == null || templateName.length() == 0)
				return newFixedLengthResponse(Response.Status.BAD_REQUEST, MIME_PLAINTEXT, "Missing template name.");
			if (!driveContains(templaterTemplatePath))
				return newFixedLengthResponse(Response.Status.BAD_REQUEST, MIME_PLAINTEXT, "Template not found.");

			String ext = getExtension(templateName);
			boolean toPdf = "true".equals(params.get("toPdf")) && "docx".equals(ext);
			String name = templateName.substring(0, templateName.length() - ext.length() - 1);

			byte[] templaterBytes = driveMap.get(templaterTemplatePath);
			String json = params.containsKey("json") ? params.get("json") : params.get("postData");
			byte[] templaterResultBytes = processTemplate(templaterBytes, parseJson(json), ext);
			byte[] resultBytes = toPdf ? convertToPdf(templaterResultBytes, ext) : templaterResultBytes;
			if (resultBytes == null)
				return newFixedLengthResponse(Response.Status.INTERNAL_ERROR, MIME_PLAINTEXT, "Failed creating report");

			Response response = createResponse(toPdf ? "pdf" : ext, resultBytes);
			response.addHeader("Accept-Ranges", "bytes");
			response.addHeader("Content-Disposition", "attachment;filename=" + name + "." + (toPdf ? "pdf" : ext));
			return response;
		} catch (final ParseException e) {
			return newFixedLengthResponse(Response.Status.BAD_REQUEST, MIME_PLAINTEXT, e.getMessage());
		} catch (final IOException e) {
			e.printStackTrace();
			return newFixedLengthResponse(Response.Status.INTERNAL_ERROR, MIME_PLAINTEXT, e.getMessage());
		} catch (final ResponseException e) {
			e.printStackTrace();
			return newFixedLengthResponse(Response.Status.INTERNAL_ERROR, MIME_PLAINTEXT, e.getMessage());
		} catch (final InterruptedException e) {
			e.printStackTrace();
			return newFixedLengthResponse(Response.Status.INTERNAL_ERROR, MIME_PLAINTEXT, e.toString());
		}
	}

	/**
	 * Converts previously made document to pdf.
	 *
	 * @param templateBytes ooxml document
	 * @return  document as pdf
	 */
	private static synchronized byte[] convertToPdf(final byte[] templateBytes, final String ext) throws IOException, InterruptedException {
		final File tmpFile = File.createTempFile("templaterDocument", "." + ext);
		final String outputFileName = tmpFile.getPath().substring(0, tmpFile.getPath().length() - ext.length()) + "pdf";

		try {
			final OutputStream os = new FileOutputStream(tmpFile);
			os.write(templateBytes);
			os.close();

			ProcessBuilder builder = new ProcessBuilder("libreoffice", "--norestore", "--nofirststartwizard", "--nologo", "--headless", "--convert-to", "pdf", tmpFile.getPath());
			builder.directory(tmpFile.getParentFile());
			Process process = builder.start();
			if (process.waitFor(30, TimeUnit.SECONDS)) {
				File result = new File(outputFileName);
				try {
					if (result.exists()) return readStream(new FileInputStream(result));
				} finally {
					result.delete();
				}
			}
		} finally {
			tmpFile.delete();
		}
		return null;
	}

	/**
	 * Static Templater document factory, which reuses the default configuration.
	 */
	private static final IDocumentFactory documentFactory = Configuration.factory();

	/**
	 * Fills in a given templater template with a given JSON deserialized to {@code Map<String, Object>}
	 *
	 * @return byte[] containing result of templater processing.
	 */
	private static byte[] processTemplate(final byte[] templateBytes, final Object data, final String ext) throws IOException {
		final InputStream is = new ByteArrayInputStream(templateBytes);
		final ByteArrayOutputStream baos = new ByteArrayOutputStream();
		final ITemplateDocument doc = documentFactory.open(is, ext, baos);
		doc.process(data);
		doc.flush();
		return baos.toByteArray();
	}

	private static Object parseJson(final String postData) throws ParseException {
		if (postData == null) return null;
		final JsonReader<Object> reader = dslJson.newReader(postData.getBytes(UTF8));
		try {

			reader.getNextToken();
			return ObjectConverter.deserializeObject(reader);
		} catch (IOException e) {
			throw new ParseException(e.getMessage(), reader.getCurrentIndex());
		}
	}

	/**
	 * Parses out an extension of a template.
	 *
	 * @param template file name
	 * @return extension
	 */
	private static String getExtension(final String template) throws ParseException {
		int lastIndexOfDot = template.lastIndexOf('.');
		if (lastIndexOfDot < 0) throw new ParseException("File must have an extension to indicate its type.", -1);
		return template.substring(lastIndexOfDot + 1);
	}

	private static Response createResponse(String resourcePath, byte[] content) {
		final String mime;
		if (resourcePath.endsWith("html")) mime = MIME_HTML;
		else if (resourcePath.endsWith("js")) mime = "text/javascript";
		else if (resourcePath.endsWith("css")) mime = "text/css";
		else if (resourcePath.endsWith("xlsx"))
			mime = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
		else if (resourcePath.endsWith("docx"))
			mime = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
		else if (resourcePath.endsWith("pdf")) mime = "application/pdf";
		else mime = MIME_PLAINTEXT;
		return newChunkedResponse(Response.Status.OK, mime, new ByteArrayInputStream(content));
	}

	public static void main(final String[] args) {
		try {
			final NanoHTTPD serverInstance = new TemplaterServer();
			serverInstance.start();
			System.out.println("Server started on port " + PORT + ", press Enter to stop ...");
			try {
				System.in.read();
			} catch (final Exception e) {
				e.printStackTrace();
			}
			serverInstance.stop();
		} catch (final Exception e) {
			e.printStackTrace();
		}
	}
}
