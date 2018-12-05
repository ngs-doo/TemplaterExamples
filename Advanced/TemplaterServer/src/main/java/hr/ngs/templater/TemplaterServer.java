package hr.ngs.templater;

import java.io.*;
import java.net.URL;
import java.net.URLClassLoader;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.text.ParseException;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.zip.CRC32;

import com.dslplatform.json.*;
import fi.iki.elonen.NanoHTTPD;

public class TemplaterServer extends NanoHTTPD {
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
    private static Map<String, TemplateInfo> templatesMap = new HashMap<>();
    private static final DslJson<Object> dslJson = new DslJson<>();

    static class TemplateInfo {
        final String name;
        final String extension;
        final byte[] content;
        final String etag;

        TemplateInfo(String file, byte[] content) throws ParseException {
            this.extension = getExtension(file);
            this.name = file.substring(0, file.length() - extension.length() - 1);
            this.content = content;
            CRC32 crc32 = new CRC32();
            crc32.update(content);
            this.etag = String.format("\"%X\"", crc32.getValue());
        }
    }

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

            templateHtml = new String(readStream(stream, -1), UTF8);
            String indexContent = createIndex(templateFiles.size() > 0 ? templateFiles.get(0) : "");
            index = indexContent.getBytes(UTF8);

            defaultHtml = new String(readStream(TemplaterServer.class.getResourceAsStream("/default.html"), -1), UTF8);
            indexDefault = defaultHtml.replace("${content}", indexContent).getBytes(UTF8);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private static void cacheAllFiles(String prefix, File file, Map<String, byte[]> cache) throws IOException {
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

    private final int timeoutLimit;
    private final String tmpFolder;
    private final IDocumentFactory documentFactory;
    private final String libreoffice;

    public TemplaterServer(int port, int timeoutLimit, String tmpFolder, ClassLoader loader, String libreoffice) {
        super(port);
        this.timeoutLimit = timeoutLimit;
        this.tmpFolder = tmpFolder;
        IDocumentFactoryBuilder builder = Configuration.builder();
        for (IDocumentFactoryBuilder.IFormatter f : ServiceLoader.load(IDocumentFactoryBuilder.IFormatter.class, loader)) {
            builder.include(f);
        }
        for (IDocumentFactoryBuilder.IHandler h : ServiceLoader.load(IDocumentFactoryBuilder.IHandler.class, loader)) {
            builder.include(h);
        }
        for (IDocumentFactoryBuilder.ILowLevelReplacer llr : ServiceLoader.load(IDocumentFactoryBuilder.ILowLevelReplacer.class, loader)) {
            builder.include(llr);
        }
        documentFactory = builder.build();
        this.libreoffice = libreoffice;
    }

    private static byte[] readStream(final InputStream is, int pos) throws IOException {
        boolean closeAtEnd = pos == -1;
        try {
            ByteArrayOutputStream os = new ByteArrayOutputStream();
            final byte[] body = new byte[1024];
            int read;
            while (pos != 0 && (read = is.read(body)) > 0) {
                os.write(body, 0, read);
                if (pos > 0) {
                    pos -= read;
                }
            }
            return os.toByteArray();
        } finally {
            if (closeAtEnd) {
                is.close();
            }
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
                : uri.startsWith("/document") ? handleDocument(session)
                : uri.startsWith("/pdf") && session.getMethod() == Method.PUT ? toPdf(session)
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
            String accept = session.getHeaders().get("accept");
            boolean toPdf = accept != null && accept.contains("application/pdf") || "true".equals(params.get("toPdf"));
            String name = templateName.substring(0, templateName.length() - ext.length() - 1);

            byte[] templaterBytes = driveMap.get(exampleName);
            String json = params.containsKey("json") ? params.get("json") : params.get("postData");
            byte[] jsonBytes = json != null ? json.getBytes(StandardCharsets.UTF_8) : null;
            byte[] templaterResultBytes = processTemplate(templaterBytes, parseJson(jsonBytes), ext);
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

    private static byte[] readBytes(IHTTPSession session) throws ParseException, IOException {
        String cl = session.getHeaders().get("content-length");
        if (cl == null || cl.length() == 0) {
            throw new ParseException("Content-Length is missing", 0);
        }
        int len = Integer.parseInt(cl);
        if (len > 33554432) {
            throw new ParseException("Content-Length too large", 0);
        }
        return readStream(session.getInputStream(), len);
    }

    private Response handleDocument(final IHTTPSession session) {
        try {
            final Map<String, String> params = session.getParms();
            String templateName = params.get("template");
            if (templateName == null || templateName.length() == 0 || templateName.indexOf('.') == -1) {
                return newFixedLengthResponse(Response.Status.BAD_REQUEST, MIME_PLAINTEXT, "Missing or bad template name.");
            }
            if (session.getMethod() == Method.POST) {
                byte[] bytes = readBytes(session);
                TemplateInfo info = new TemplateInfo(templateName, bytes);
                processTemplate(bytes, new HashMap<String, Object>(), info.extension);
                synchronized (this) {
                    HashMap<String, TemplateInfo> copy = new HashMap<>(templatesMap);
                    copy.put(templateName, info);
                    templatesMap = copy;
                }
                Response response = newFixedLengthResponse(Response.Status.OK, MIME_PLAINTEXT, "Uploaded");
                response.addHeader("ETag", info.etag);
                return response;
            }
            TemplateInfo info = templatesMap.get(templateName);
            if (info == null) {
                return newFixedLengthResponse(Response.Status.BAD_REQUEST, MIME_PLAINTEXT, "Template not found.");
            }
            if (session.getMethod() == Method.PUT) {
                String accept = session.getHeaders().get("accept");
                boolean toPdf = accept != null && accept.contains("application/pdf") || "true".equals(params.get("toPdf"));
                byte[] json = readBytes(session);
                byte[] templaterResultBytes = processTemplate(info.content, parseJson(json), info.extension);
                byte[] resultBytes;
                try {
                    resultBytes = toPdf ? convertToPdf(templaterResultBytes, info.extension) : templaterResultBytes;
                } catch (Exception e) {
                    return newFixedLengthResponse(Response.Status.INTERNAL_ERROR, MIME_PLAINTEXT, "Unable to convert document to PDF");
                }
                if (resultBytes == null) {
                    return newFixedLengthResponse(Response.Status.INTERNAL_ERROR, MIME_PLAINTEXT, "Failed creating report");
                }
                Response response = createResponse(toPdf ? "pdf" : info.extension, resultBytes);
                response.addHeader("Accept-Ranges", "bytes");
                response.addHeader("Content-Disposition", "attachment;filename=" + info.name + "." + (toPdf ? "pdf" : info.extension));
                return response;
            } else if (session.getMethod() == Method.GET) {
                String etag = session.getHeaders().get("if-none-match");
                if (info.etag.equals(etag)) {
                    return newFixedLengthResponse(Response.Status.NOT_MODIFIED, MIME_PLAINTEXT, null);
                }
                Response response = createResponse(info.extension, info.content);
                response.addHeader("Accept-Ranges", "bytes");
                response.addHeader("ETag", info.etag);
                response.addHeader("Content-Disposition", "attachment;filename=" + info.name + "." + info.extension);
                return response;
            } else {
                return newFixedLengthResponse(Response.Status.NOT_FOUND, MIME_PLAINTEXT, "Unknown method");
            }
        } catch (final ParseException e) {
            return newFixedLengthResponse(Response.Status.BAD_REQUEST, MIME_PLAINTEXT, e.getMessage());
        } catch (Exception e) {
            return newFixedLengthResponse(Response.Status.INTERNAL_ERROR, MIME_PLAINTEXT, "Unknown error");
        }
    }

    private Response toPdf(final IHTTPSession session) {
        try {
            String file = session.getParms().get("file");
            if (file == null || file.length() == 0 || file.indexOf('.') == -1) {
                return newFixedLengthResponse(Response.Status.BAD_REQUEST, MIME_PLAINTEXT, "Missing or bad file name.");
            }
            String extension = getExtension(file);
            String name = file.substring(0, file.length() - extension.length() - 1);
            byte[] input = readBytes(session);
            byte[] output = convertToPdf(input, extension);
            if (output == null) {
                return newFixedLengthResponse(Response.Status.INTERNAL_ERROR, MIME_PLAINTEXT, "Failed creating PDF");
            }
            Response response = createResponse("pdf", output);
            response.addHeader("Accept-Ranges", "bytes");
            response.addHeader("Content-Disposition", "attachment;filename=" + name + ".pdf");
            return response;
        } catch (Exception e) {
            return newFixedLengthResponse(Response.Status.INTERNAL_ERROR, MIME_PLAINTEXT, "Unable to convert document to PDF");
        }
    }

    private int counter;

    private synchronized byte[] convertToPdf(final byte[] templateBytes, final String ext) throws IOException, InterruptedException {
        final File tmpFile = tmpFolder.length() == 0
            ? File.createTempFile("templaterDocument", "." + ext)
            : new File(tmpFolder, "templaterDocument" + (++counter) + "." + ext);
        final String outputFileName = tmpFile.getPath().substring(0, tmpFile.getPath().length() - ext.length()) + "pdf";

        try {
            final OutputStream os = new FileOutputStream(tmpFile);
            os.write(templateBytes);
            os.close();

            ProcessBuilder builder = new ProcessBuilder(libreoffice, "--norestore", "--nofirststartwizard", "--nologo", "--headless", "--convert-to", "pdf", tmpFile.getPath());
            builder.directory(tmpFile.getParentFile());
            Process process = builder.start();
            if (process.waitFor(timeoutLimit, TimeUnit.SECONDS)) {
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
     * Fills in a given templater template with a given JSON deserialized to {@code Map<String, Object>}
     *
     * @return byte[] containing result of templater processing.
     */
    private byte[] processTemplate(final byte[] templateBytes, final Object data, final String ext) {
        final InputStream is = new ByteArrayInputStream(templateBytes);
        final ByteArrayOutputStream baos = new ByteArrayOutputStream();
        final ITemplateDocument doc = documentFactory.open(is, ext, baos);
        doc.process(data);
        doc.flush();
        return baos.toByteArray();
    }

    private static Object parseJson(final byte[] postData) throws ParseException {
        if (postData == null) return null;
        final JsonReader<Object> reader = dslJson.newReader(postData);
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
        return template.substring(lastIndexOfDot + 1).toLowerCase();
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
            int port = 7777;
            int timeoutLimit = 30;
            String tmpFolder = "";
            String pluginFolder = ".";
            String libreoffice = "libreoffice";
            if (args.length == 0) {
                System.out.println("Example arguments:");
                System.out.println("    -port=8080");
                System.out.println("    -timeout=10");
                System.out.println("    -tmp=/mnt/ramdisk");
                System.out.println("    -plugins=/templater/jars");
                System.out.println("    -libreoffice=/user/home/office/libreoffice");
            }
            for(String a : args) {
                if (a.startsWith("-port=")) {
                    port = Integer.parseInt(a.substring("-port=".length()));
                } else if (a.startsWith("-timeout=")) {
                    timeoutLimit = Integer.parseInt(a.substring("-timeout=".length()));
                } else if (a.startsWith("-tmp=")) {
                    tmpFolder = a.substring("-tmp=".length());
                    File f = new File(tmpFolder);
                    if (!f.exists()) {
                        throw new RuntimeException("Unable to find specified temporary folder: " + tmpFolder);
                    }
                } else if (a.startsWith("-plugins=")) {
                    pluginFolder = a.substring("-plugins=".length());
                    File f = new File(pluginFolder);
                    if (!f.exists()) {
                        throw new RuntimeException("Unable to find specified plugins folder: " + pluginFolder);
                    }
                } else if (a.startsWith("-libreoffice=")) {
                    libreoffice = a.substring("-libreoffice=".length());
                    File f = new File(libreoffice);
                    if (!f.exists()) {
                        throw new RuntimeException("Unable to find specified libreoffice path: " + libreoffice);
                    }
                }
            }
            File loc = new File(pluginFolder);
            File[] jars = loc.listFiles(new FileFilter() {
                public boolean accept(File file) {
                    return file.getPath().toLowerCase().endsWith(".jar");
                }
            });
            List<URL> urls = new ArrayList<URL>(jars != null ? jars.length : 0);
            if (jars != null) {
                for (final File j : jars) {
                    urls.add(j.toURI().toURL());
                }
            }
            URLClassLoader ucl = new URLClassLoader(urls.toArray(new URL[0]));
            NanoHTTPD serverInstance = new TemplaterServer(port, timeoutLimit, tmpFolder, ucl, libreoffice);
            serverInstance.start();
            System.out.println("Server started on port " + port + ", press Enter to stop ...");
            try {
                System.in.read();
            } catch (final Exception e) {
                e.printStackTrace();
            }
            serverInstance.stop();
            ucl.close();
        } catch (final Exception e) {
            e.printStackTrace();
        }
    }
}
