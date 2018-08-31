package hr.ngs.templater;

import java.io.*;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.text.ParseException;
import java.util.*;
import java.util.concurrent.TimeUnit;

import com.dslplatform.json.*;
import fi.iki.elonen.NanoHTTPD;

public class TemplaterServer extends NanoHTTPD {
    private static final int PORT = 7777;
    private static final Charset UTF8 = Charset.forName("UTF-8");

    private static final String DRIVE_PATH = "resources";
    private static final String MIME_PLAINTEXT = "text/plain;charset=UTF-8";
    private static final String MIME_HTML = "text/html;charset=UTF-8";

    private static final byte[] index;
    private static final byte[] indexDefault;
    private static final List<String> templateFiles;
    private static final String templateHtml;
    private static final String defaultHtml;

    private static final Map<String, byte[]> driveMap = new HashMap<>();
    private static final DslJson<Object> dslJson = new DslJson<>();

    static {
        File path = new File(DRIVE_PATH);
        if (!path.exists()) {
            path = new File(new File("Advanced", "TemplaterServer"), DRIVE_PATH);
        }
        String[] files = new File(path, "templates").list();
        Arrays.sort(files);
        templateFiles = Arrays.asList(files);
        InputStream stream = TemplaterServer.class.getResourceAsStream("/index.html");
        try {
            cacheAllFiles(path.getAbsolutePath(), path, driveMap);

            templateHtml = new String(readStream(stream), UTF8);
            String indexContent = createIndex(templateFiles.size() > 0 ? templateFiles.get(0) : "");
            index = indexContent.getBytes(UTF8);

            defaultHtml = new String(readStream(TemplaterServer.class.getResourceAsStream("/default.html")), UTF8);
            indexDefault = defaultHtml.replace("${content}", indexContent).getBytes(UTF8);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    static void cacheAllFiles(String prefix, File file, Map<String, byte[]> cache) throws IOException {
        File[] files = file.listFiles();
        if (files == null) return;
        for (File f : files) {
            if (f.isDirectory()) {
                cacheAllFiles(prefix, f, cache);
            } else {
                String name = f.getAbsolutePath().substring(prefix.length()).toLowerCase().replace('\\', '/');
                driveMap.put(name, Files.readAllBytes(f.toPath()));
            }
        }
    }

    private static String createIndex(String current) {
        StringBuilder response = new StringBuilder();

        String listItemHtml = "<li><p>" +
                "<button style=\"display:none;\" class=\"template btn btn-primary feat-btn feat-btn-lg{{isActive}}\" data-template=\"{{template}}\">" +
                "<i class=\"fa fa-file-text\" ></i> {{template}}" +
                "</button>" +
                "<noscript>" +
                "<a href=\"?template={{template}}\"><button class=\"btn btn-primary feat-btn feat-btn-lg{{isActive}}\">" +
                "<i class=\"fa fa-file-text\" ></i> {{template}} </button></a>" +
                "</noscript>" +
                "</p></li>";

        for (int i = 0; i < templateFiles.size(); i++) {
            String file = templateFiles.get(i);
            String active = file.equalsIgnoreCase(current) || current.isEmpty() && i == 0 ? " active" : "";
            response.append(listItemHtml.replace("{{template}}", file).replace("{{isActive}}", active));
        }

        String defaultTemplate = current.isEmpty() ? "" : "Create " + current.substring(current.lastIndexOf('.') + 1) + " document with " + current;
        byte[] json = current.isEmpty() ? null : driveMap.get("/examples/" + current.toLowerCase() + ".json");
        return templateHtml
                .replace("${templates}", response.toString())
                .replace("${defaultTemplate}", defaultTemplate)
                .replace("${defaultJson}", json != null ? new String(json, UTF8) : "")
                .replace("${downloadUrl}", current.isEmpty() ? "#" : "templates/" + current)
                .replace("${defaultFilename}", current.isEmpty() ? "" : current);
    }

    public TemplaterServer() {
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
        return "/".equals(uri) || "/content".equals(uri) ? buildIndexResponse(session)
                : uri.startsWith("/process") ? processTemplaterResponse(session)
                : driveMap.containsKey(uri.toLowerCase()) ? createResponse(uri, driveMap.get(uri.toLowerCase()))
                : newFixedLengthResponse(Response.Status.NOT_FOUND, MIME_PLAINTEXT, "URL not found!");
    }

    private static Response buildIndexResponse(IHTTPSession session) {
        String template = session.getParms().get("template");
        boolean isRoot = "/".equals(session.getUri());
        if (template == null || !templateFiles.contains(template)) {
            byte[] bytes = isRoot ? indexDefault : index;
            ByteArrayInputStream is = new ByteArrayInputStream(bytes);
            return newFixedLengthResponse(Response.Status.OK, MIME_HTML, is, bytes.length);
        }
        String indexContent = createIndex(template);
        String html = isRoot ? defaultHtml.replace("${content}", indexContent) : indexContent;
        return newFixedLengthResponse(Response.Status.OK, MIME_HTML, html);
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
        } catch (final IOException | ResponseException e) {
            return newFixedLengthResponse(Response.Status.BAD_REQUEST, MIME_PLAINTEXT, e.getMessage());
        }
        try {
            String templateName = params.get("template");

            if (templateName == null || templateName.length() == 0 || templateName.indexOf('.') == -1) {
                return newFixedLengthResponse(Response.Status.BAD_REQUEST, MIME_PLAINTEXT, "Missing or bad template name.");
            }
            String exampleName = "/templates/" + templateName.toLowerCase();
            if (!driveMap.containsKey(exampleName)) {
                return newFixedLengthResponse(Response.Status.BAD_REQUEST, MIME_PLAINTEXT, "Template not found.");
            }
            String ext = getExtension(templateName);
            boolean toPdf = "true".equals(params.get("toPdf")) && "docx".equals(ext);
            String name = templateName.substring(0, templateName.length() - ext.length() - 1);

            byte[] templaterBytes = driveMap.get(exampleName);
            String json = params.containsKey("json") ? params.get("json") : params.get("postData");
            byte[] templaterResultBytes = processTemplate(templaterBytes, parseJson(json), ext);
            byte[] resultBytes;
            try {
                resultBytes = toPdf ? convertToPdf(templaterResultBytes, ext) : templaterResultBytes;
            } catch (Exception e) {
                return newFixedLengthResponse(Response.Status.INTERNAL_ERROR, MIME_PLAINTEXT, "Unable to convert document to PDF");
            }
            if (resultBytes == null) {
                return newFixedLengthResponse(Response.Status.INTERNAL_ERROR, MIME_PLAINTEXT, "Failed creating report");
            }
            Response response = createResponse(toPdf ? "pdf" : ext, resultBytes);
            response.addHeader("Accept-Ranges", "bytes");
            response.addHeader("Content-Disposition", "attachment;filename=" + name + "." + (toPdf ? "pdf" : ext));
            return response;
        } catch (final ParseException e) {
            return newFixedLengthResponse(Response.Status.BAD_REQUEST, MIME_PLAINTEXT, e.getMessage());
        } catch (final Exception e) {
            return newFixedLengthResponse(Response.Status.INTERNAL_ERROR, MIME_PLAINTEXT, "Unknown error");
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
                    if (result.exists()) return Files.readAllBytes(result.toPath());
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
    private static byte[] processTemplate(final byte[] templateBytes, final Object data, final String ext) {
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
        else if (resourcePath.endsWith("xlsx")) mime = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        else if (resourcePath.endsWith("docx")) mime = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        else if (resourcePath.endsWith("pdf")) mime = "application/pdf";
        else mime = MIME_PLAINTEXT;
        return newFixedLengthResponse(Response.Status.OK, mime, new ByteArrayInputStream(content), content.length);
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
