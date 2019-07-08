package hr.ngs.templater;

import java.io.*;
import java.net.InetSocketAddress;
import java.net.URL;
import java.net.URLClassLoader;
import java.net.URLDecoder;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.text.ParseException;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.logging.SimpleFormatter;
import java.util.logging.StreamHandler;
import java.util.zip.CRC32;

import com.dslplatform.json.*;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

public class TemplaterServer implements AutoCloseable {
    private static final Charset UTF8 = Charset.forName("UTF-8");

    private static final String DRIVE_PATH = "resources";
    private static final String MIME_PLAINTEXT = "text/plain;charset=UTF-8";
    private static final String MIME_HTML = "text/html;charset=UTF-8";
    private static final String MIME_PDF = "application/pdf";

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
        if (files != null) {
            Arrays.sort(files);
            templateFiles = Arrays.asList(files);
        } else templateFiles = Collections.emptyList();
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


    private final int timeoutLimit;
    private final String tmpFolder;
    private final IDocumentFactory documentFactory;
    private final String libreoffice;
    private final Logger logger = Logger.getLogger(TemplaterServer.class.getName());
    private final HttpServer server;

    public TemplaterServer(int port, int timeoutLimit, String tmpFolder, ClassLoader loader, String libreoffice, Level logLevel) throws IOException {
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
        logger.setLevel(logLevel);
        logger.addHandler(new StreamHandler(System.out, new SimpleFormatter()));
        this.server = HttpServer.create(new InetSocketAddress(port), 0);
        server.createContext("/", new IndexHandler());
        server.createContext("/content", new IndexHandler());
        server.createContext("/process", new ProcessHandler());
        server.createContext("/document", new DocumentHandler());
        server.createContext("/pdf", new PdfHandler());
        for (Map.Entry<String, byte[]> kv : driveMap.entrySet()) {
            server.createContext(kv.getKey(), new FileHandler());
        }
        server.setExecutor(null);
        server.start();
    }

    @Override
    public void close() {
        server.stop(0);
    }

    private static void cacheAllFiles(String prefix, File file, Map<String, byte[]> cache) throws IOException {
        File[] files = file.listFiles();
        if (files == null) return;
        for (File f : files) {
            if (f.isDirectory()) {
                cacheAllFiles(prefix, f, cache);
            } else {
                String name = f.getAbsolutePath().substring(prefix.length()).replace('\\', '/');
                byte[] bytes = Files.readAllBytes(f.toPath());
                cache.put(name, bytes);
                cache.put(name.toLowerCase(), bytes);
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
                .replace("${defaultJson}", json != null ? new String(json, UTF8).replace("&", "&amp;") : "")
                .replace("${downloadUrl}", current.isEmpty() ? "#" : "templates/" + current)
                .replace("${defaultFilename}", current.isEmpty() ? "" : current);
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

    private static byte[] readBytes(HttpExchange httpExchange) throws ParseException, IOException {
        String cl = httpExchange.getRequestHeaders().getFirst("content-length");
        if (cl == null || cl.length() == 0) {
            throw new ParseException("Content-Length is missing", 0);
        }
        int len = Integer.parseInt(cl);
        if (len > 33554432) {
            throw new ParseException("Content-Length too large", 0);
        }
        return readStream(httpExchange.getRequestBody(), len);
    }

    private int counter = 1;

    private synchronized byte[] convertToPdf(final byte[] templateBytes, final String ext) throws IOException, InterruptedException {
        final File tmpFile = tmpFolder.length() == 0
            ? File.createTempFile("templaterDocument", "." + ext)
            : new File(tmpFolder, "templaterDocument" + (counter++) + "." + ext);
        final String outputFileName = tmpFile.getPath().substring(0, tmpFile.getPath().length() - ext.length()) + "pdf";

        try {
            long start = new Date().getTime();
            final OutputStream os = new FileOutputStream(tmpFile);
            os.write(templateBytes);
            os.close();

            ProcessBuilder builder = new ProcessBuilder(libreoffice, "--norestore", "--nofirststartwizard", "--nologo", "--headless", "--convert-to", "pdf", tmpFile.getPath());
            builder.directory(tmpFile.getParentFile());
            Process process = builder.start();
            if (process.waitFor(timeoutLimit, TimeUnit.SECONDS)) {
                File result = new File(outputFileName);
                try {
                    if (result.exists()) {
                        byte[] output = Files.readAllBytes(result.toPath());
                        if (logger.isLoggable(Level.FINE)) {
                            logger.log(Level.FINE, String.format("PDF conversion finished in %d ms. input size = %d, output size = %d", new Date().getTime() - start, templateBytes.length, output.length));
                        }
                        return output;
                    }
                } finally {
                    result.delete();
                }
            }
        } finally {
            tmpFile.delete();
        }
        return null;
    }

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

    private static String getExtension(final String template) throws ParseException {
        int lastIndexOfDot = template.lastIndexOf('.');
        if (lastIndexOfDot < 0) throw new ParseException("File must have an extension to indicate its type.", -1);
        return template.substring(lastIndexOfDot + 1).toLowerCase();
    }


    private void sendResponse(HttpExchange http, int code, String contentType, String response) throws IOException {
        sendResponse(http, code, contentType, response.getBytes(UTF8), 0);
    }

    private void sendResponse(HttpExchange http, int code, String contentType, byte[] bytes, long start) throws IOException {
        if (code == 200 && start != 0) {
            http.getResponseHeaders().add("X-Duration", Long.toString(start - new Date().getTime()));
        }
        http.getResponseHeaders().add("Content-Type", contentType);
        http.sendResponseHeaders(code, bytes.length);
        http.getResponseBody().write(bytes);
        http.getResponseBody().close();
        if (logger.isLoggable(Level.FINEST)) {
            logger.log(Level.FINEST, String.format("sent response: %d", code));
        }
    }

   private Map<String, String> splitQuery(String query) throws UnsupportedEncodingException {
       Map<String, String> query_pairs = new LinkedHashMap<>();
       if (query == null) return query_pairs;
       String[] pairs = query.split("&");
       for (String pair : pairs) {
           int idx = pair.indexOf("=");
           query_pairs.put(URLDecoder.decode(pair.substring(0, idx), "UTF-8").toLowerCase(), URLDecoder.decode(pair.substring(idx + 1), "UTF-8"));
       }
       if (logger.isLoggable(Level.FINE)) {
           logger.log(Level.FINE, query_pairs.toString());
       }
       return query_pairs;
   }

   class IndexHandler implements HttpHandler {
       @Override
       public void handle(HttpExchange httpExchange) throws IOException {
           if (logger.isLoggable(Level.FINE)) {
               logger.log(Level.FINE, String.format("index: %s", httpExchange.getRequestURI()));
           }
           Map<String, String> params = splitQuery(httpExchange.getRequestURI().getQuery());
           String template = params.get("template");
           boolean isRoot = "/".equals(httpExchange.getRequestURI().getPath());
           if (template == null || !templateFiles.contains(template)) {
               byte[] bytes = isRoot ? indexDefault : index;
               sendResponse(httpExchange, 200, MIME_HTML, bytes, 0);
           } else {
               String indexContent = createIndex(template);
               String html = isRoot ? defaultHtml.replace("${content}", indexContent) : indexContent;
               sendResponse(httpExchange, 200, MIME_HTML, html);
           }
       }
   }

   class ProcessHandler implements HttpHandler {
       @Override
       public void handle(HttpExchange httpExchange) throws IOException {
           long start = new Date().getTime();
           if (logger.isLoggable(Level.FINE)) {
               logger.log(Level.FINE, String.format("process: %s", httpExchange.getRequestURI()));
           }
           Map<String, String> params = splitQuery(httpExchange.getRequestURI().getQuery());
           try {
               byte[] jsonBytes = null;
               String cl = httpExchange.getRequestHeaders().getFirst("content-length");
               if (cl != null && cl.length() != 0 && !"0".equals(cl)) {
                   byte[] bytes = readBytes(httpExchange);
                   String contentType = httpExchange.getRequestHeaders().getFirst("content-type");
                   if ("application/x-www-form-urlencoded".equalsIgnoreCase(contentType)) {
                       String[] parts = new String(bytes, UTF8).split("&");
                       for (String s : parts) {
                           String[] lr = s.split("=");
                           if (lr.length != 2) {
                               sendResponse(httpExchange, 400, MIME_PLAINTEXT, "Invalid form data.");
                           }
                           params.put(lr[0], URLDecoder.decode(lr[1], "UTF-8"));
                       }
                   } else if (contentType != null && contentType.toLowerCase().startsWith("application/json")) {
                       jsonBytes = bytes;
                   } else {
                       sendResponse(httpExchange, 415, MIME_PLAINTEXT, "Use application/x-www-form-urlencoded or application/json.");
                   }
               }
               String templateName = params.get("template");
               if (templateName == null || templateName.length() == 0 || templateName.indexOf('.') == -1) {
                   sendResponse(httpExchange, 400, MIME_PLAINTEXT, "Missing or bad template name.");
                   return;
               }
               String exampleName = "/templates/" + templateName.toLowerCase();
               if (!driveMap.containsKey(exampleName)) {
                   sendResponse(httpExchange, 400, MIME_PLAINTEXT, "Template not found.");
                   return;
               }
               String ext = getExtension(templateName);
               String accept = httpExchange.getRequestHeaders().getFirst("accept");
               boolean toPdf = accept != null && accept.contains(MIME_PDF)
                       || "true".equals(params.get("toPdf")) || "true".equals(params.get("topdf"));
               String name = templateName.substring(0, templateName.length() - ext.length() - 1);

               byte[] templaterBytes = driveMap.get(exampleName);
               if (jsonBytes == null) {
                   String json = params.containsKey("json") ? params.get("json") : params.get("postData");
                   jsonBytes = json != null ? json.getBytes(UTF8) : null;
               }
               byte[] templaterResultBytes = processTemplate(templaterBytes, parseJson(jsonBytes), ext);
               byte[] resultBytes;
               try {
                   resultBytes = toPdf ? convertToPdf(templaterResultBytes, ext) : templaterResultBytes;
               } catch (Exception e) {
                   sendResponse(httpExchange, 500, MIME_PLAINTEXT, "Unable to convert document to PDF");
                   return;
               }
               if (resultBytes == null) {
                   sendResponse(httpExchange, 500, MIME_PLAINTEXT, "Failed creating report");
                   return;
               }
               httpExchange.getResponseHeaders().add("Accept-Ranges", "bytes");
               httpExchange.getResponseHeaders().add("Content-Disposition", "attachment;filename=" + name + "." + (toPdf ? "pdf" : ext));
               sendResponse(httpExchange, 200, getMimeType(toPdf ? "pdf" : ext), resultBytes, start);
           } catch (final ParseException e) {
               if (logger.isLoggable(Level.FINE)) {
                   logger.log(Level.FINE, e.toString());
               }
               sendResponse(httpExchange, 400, MIME_PLAINTEXT, e.getMessage());
           } catch (final Exception e) {
               if (logger.isLoggable(Level.WARNING)) {
                   logger.log(Level.WARNING, e.toString());
               }
               sendResponse(httpExchange, 500, MIME_PLAINTEXT, "Unknown error");
           }
       }
   }

   class FileHandler implements HttpHandler {
       @Override
       public void handle(HttpExchange httpExchange) throws IOException {
           if (logger.isLoggable(Level.FINE)) {
               logger.log(Level.FINE, String.format("file: %s", httpExchange.getRequestURI()));
           }
           String resourcePath = httpExchange.getRequestURI().getPath();
           byte[] bytes = driveMap.get(resourcePath);
           final String mime = getMimeType(resourcePath);
           sendResponse(httpExchange, 200, mime, bytes, 0);
       }
   }

    class DocumentHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange httpExchange) throws IOException {
            long start = new Date().getTime();
            try {
                Map<String, String> params = splitQuery(httpExchange.getRequestURI().getQuery());
                String templateName = params.get("template");
                if (templateName == null || templateName.length() == 0 || templateName.indexOf('.') == -1) {
                    sendResponse(httpExchange, 400, MIME_PLAINTEXT, "Missing or bad template name.");
                    return;
                }
                if ("POST".equalsIgnoreCase(httpExchange.getRequestMethod())) {
                    byte[] bytes = readBytes(httpExchange);
                    TemplateInfo info = new TemplateInfo(templateName, bytes);
                    processTemplate(bytes, new HashMap<String, Object>(), info.extension);
                    synchronized (this) {
                        HashMap<String, TemplateInfo> copy = new HashMap<>(templatesMap);
                        copy.put(templateName, info);
                        templatesMap = copy;
                    }
                    httpExchange.getResponseHeaders().add("ETag", info.etag);
                    sendResponse(httpExchange, 200, MIME_PLAINTEXT, "Uploaded");
                    if (logger.isLoggable(Level.INFO)) {
                        logger.log(Level.INFO, String.format("new document uploaded: %s, size = %d", templateName, bytes.length));
                    }
                    return;
                }
                TemplateInfo info = templatesMap.get(templateName);
                if (info == null) {
                    sendResponse(httpExchange, 400, MIME_PLAINTEXT, "Template not found.");
                } else if ("PUT".equalsIgnoreCase(httpExchange.getRequestMethod())) {
                    String accept = httpExchange.getRequestHeaders().getFirst("accept");
                    boolean toPdf = accept != null && accept.contains(MIME_PDF)
                            || "true".equals(params.get("toPdf")) || "true".equals(params.get("topdf"));
                    byte[] json = readBytes(httpExchange);
                    byte[] templaterResultBytes = processTemplate(info.content, parseJson(json), info.extension);
                    byte[] resultBytes = toPdf ? convertToPdf(templaterResultBytes, info.extension) : templaterResultBytes;
                    if (resultBytes == null) {
                        sendResponse(httpExchange, 500, MIME_PLAINTEXT, "Failed creating report.");
                        return;
                    }
                    httpExchange.getResponseHeaders().add("Accept-Ranges", "bytes");
                    httpExchange.getResponseHeaders().add("Content-Disposition", "attachment;filename=" + info.name + "." + (toPdf ? "pdf" : info.extension));
                    sendResponse(httpExchange, 200, getMimeType(toPdf ? "pdf" : info.extension), resultBytes, start);
                    if (logger.isLoggable(Level.INFO)) {
                        logger.log(Level.INFO, String.format("document processed: %s, size = %d", templateName, resultBytes.length));
                    }
                } else if ("GET".equalsIgnoreCase(httpExchange.getRequestMethod())) {
                    String etag = httpExchange.getRequestHeaders().getFirst("if-none-match");
                    if (info.etag.equals(etag)) {
                        if (logger.isLoggable(Level.FINE)) {
                            logger.log(Level.FINE, String.format("same document: %s, size = %d", templateName, info.content.length));
                        }
                        sendResponse(httpExchange, 304, MIME_PLAINTEXT, new byte[0], 0);
                        return;
                    }
                    httpExchange.getResponseHeaders().add("ETag", info.etag);
                    httpExchange.getResponseHeaders().add("Accept-Ranges", "bytes");
                    httpExchange.getResponseHeaders().add("Content-Disposition", "attachment;filename=" + info.name + "." + info.extension);
                    sendResponse(httpExchange, 200, getMimeType(info.extension), info.content, 0);
                    if (logger.isLoggable(Level.FINE)) {
                        logger.log(Level.FINE, String.format("document: %s, size = %d", templateName, info.content.length));
                    }
                } else if ("DELETE".equalsIgnoreCase(httpExchange.getRequestMethod())) {
                    synchronized (this) {
                        HashMap<String, TemplateInfo> copy = new HashMap<>(templatesMap);
                        copy.remove(templateName);
                        templatesMap = copy;
                    }
                    sendResponse(httpExchange, 200, MIME_PLAINTEXT, "Removed");
                    if (logger.isLoggable(Level.INFO)) {
                        logger.log(Level.INFO, String.format("document removed: %s", templateName));
                    }
                } else {
                    sendResponse(httpExchange, 404, MIME_PLAINTEXT, "Unknown method");
                }
            } catch (final ParseException e) {
                if (logger.isLoggable(Level.FINE)) {
                    logger.log(Level.FINE, e.toString());
                }
                sendResponse(httpExchange, 400, MIME_PLAINTEXT, e.getMessage());
            } catch (Exception e) {
                if (logger.isLoggable(Level.WARNING)) {
                    logger.log(Level.WARNING, e.toString());
                }
                sendResponse(httpExchange, 500, MIME_PLAINTEXT, "Unknown error");
            }
        }
    }

   class PdfHandler implements HttpHandler {
       @Override
       public void handle(HttpExchange httpExchange) throws IOException {
           if (logger.isLoggable(Level.FINE)) {
               logger.log(Level.FINE, String.format("pdf: %s", httpExchange.getRequestURI()));
           }
           try {
               Map<String, String> params = splitQuery(httpExchange.getRequestURI().getQuery());
               String file = params.get("file");
               if (file == null || file.length() == 0 || file.indexOf('.') == -1) {
                   sendResponse(httpExchange, 400, MIME_PLAINTEXT, "Missing or bad file name.");
                   return;
               }
               String extension = getExtension(file);
               String name = file.substring(0, file.length() - extension.length() - 1);
               byte[] input = readBytes(httpExchange);
               byte[] output = convertToPdf(input, extension);
               if (output == null) {
                   sendResponse(httpExchange, 500, MIME_PLAINTEXT, "Failed creating PDF");
                   return;
               }
               httpExchange.getResponseHeaders().add("Content-type", MIME_PDF);
               httpExchange.getResponseHeaders().add("Accept-Ranges", "bytes");
               httpExchange.getResponseHeaders().add("Content-Disposition", "attachment;filename=" + name + ".pdf");
               httpExchange.sendResponseHeaders(200, output.length);
               httpExchange.getResponseBody().write(output);
               httpExchange.getResponseBody().close();
               if (logger.isLoggable(Level.INFO)) {
                   logger.log(Level.INFO, String.format("pdf: %s, size = %d", file, output.length));
               }
           } catch (Exception e) {
               if (logger.isLoggable(Level.WARNING)) {
                   logger.log(Level.WARNING, e.toString());
               }
               sendResponse(httpExchange, 500, MIME_PLAINTEXT, "Unable to convert document to PDF");
           }
       }
   }

   private static String getMimeType(String resourcePath) {
       if (resourcePath.endsWith("html")) return MIME_HTML;
       if (resourcePath.endsWith("js")) return "text/javascript";
       if (resourcePath.endsWith("css")) return "text/css";
       if (resourcePath.endsWith("xlsx"))
           return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
       if (resourcePath.endsWith("docx"))
           return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
       if (resourcePath.endsWith("pdf")) return MIME_PDF;
       return MIME_PLAINTEXT;
   }

    public static void main(final String[] args) {
        try {
            int port = 7777;
            int timeoutLimit = 30;
            String tmpFolder = "";
            String pluginFolder = ".";
            String libreoffice = "libreoffice";
            Level logLevel = Level.OFF;
            if (args.length == 0) {
                System.out.println("Example arguments:");
                System.out.println("    -port=8080");
                System.out.println("    -timeout=10");
                System.out.println("    -tmp=/mnt/ramdisk");
                System.out.println("    -log=INFO");
                System.out.println("    -plugins=/templater/jars");
                System.out.println("    -libreoffice=/user/home/office/libreoffice");
            }
            for (String a : args) {
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
                } else if (a.startsWith("-log=")) {
                    logLevel = Level.parse(a.substring("-log=".length()));
                }
            }
            File loc = new File(pluginFolder);
            File[] jars = loc.listFiles(file -> file.getPath().toLowerCase().endsWith(".jar"));
            List<URL> urls = new ArrayList<>(jars != null ? jars.length : 0);
            if (jars != null) {
                for (final File j : jars) {
                    urls.add(j.toURI().toURL());
                }
            }
            URLClassLoader ucl = new URLClassLoader(urls.toArray(new URL[0]));
            TemplaterServer server = new TemplaterServer(port, timeoutLimit, tmpFolder, ucl, libreoffice, logLevel);
            System.out.println("Server started on port " + port + ", press Enter to stop ...");
            try {
                System.in.read();
            } catch (final Exception e) {
                e.printStackTrace();
            }
            server.close();
            ucl.close();
        } catch (final Exception e) {
            e.printStackTrace();
        }
    }
}