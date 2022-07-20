package hr.ngs.templater.server;

import java.io.*;
import java.lang.reflect.Constructor;
import java.net.*;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.text.ParseException;
import java.util.*;
import java.util.concurrent.CancellationException;
import java.util.logging.*;
import java.util.zip.CRC32;

import com.dslplatform.json.*;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import hr.ngs.templater.*;
import hr.ngs.templater.Configuration;

public class TemplaterServer implements AutoCloseable {
    private static final Charset UTF8 = StandardCharsets.UTF_8;

    private static final String MIME_PLAINTEXT = "text/plain;charset=UTF-8";
    private static final String MIME_HTML = "text/html;charset=UTF-8";
    private static final String MIME_PDF = "application/pdf";

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
            crc32.update(content, 0, content.length);
            this.etag = String.format("\"%X\"", crc32.getValue());
        }
    }

    private final int timeoutLimit;
    private final DocumentFactory documentFactory;
    private final DocumentFactory debugFactory;
    private final DocumentFactory schemaFactory;
    private final Logger logger;
    private final HttpServer server;
    private final Map<String, PdfConverter> pdfConverters;

    private final byte[] index;
    private final byte[] indexDefault;
    private final List<String> templateFiles;
    private final String templateHtml;
    private final String defaultHtml;

    private final Map<String, byte[]> driveMap = new HashMap<>();
    private Map<String, TemplateInfo> templatesMap = new HashMap<>();

    private static class LoggingHandler extends StreamHandler {
        LoggingHandler(Level level) {
            super(System.out, new SimpleFormatter());
            setLevel(level);
        }

        @Override
        public synchronized void publish(LogRecord record) {
            super.publish(record);
            flush();
        }
    }

    public TemplaterServer(InetAddress address, int port, File path, int timeoutLimit, Logger logger, LinkedHashMap<String, PdfConverter> pdfConverters) throws IOException {
        this.timeoutLimit = timeoutLimit;
        this.logger = logger;
        this.pdfConverters = pdfConverters;

        String[] files = new File(path, "templates").list();
        if (files != null) {
            Arrays.sort(files);
            templateFiles = Arrays.asList(files);
            if (logger.isLoggable(Level.FINE)) {
                for (String tf : templateFiles) {
                    logger.log(Level.FINE, String.format("Template file found: %s", tf));
                }
            }
        } else {
            if (logger.isLoggable(Level.WARNING)) {
                logger.log(Level.WARNING, "No template files found");
            }
            templateFiles = Collections.emptyList();
        }
        InputStream stream = TemplaterServer.class.getResourceAsStream("/index.html");
        try {
            cacheAllFiles(path.getAbsolutePath(), path, driveMap, logger);

            templateHtml = new String(readStream(stream, -1), UTF8);
            String current = templateFiles.isEmpty() ? "" : templateFiles.get(0);
            String indexContent = createIndex(current, templateFiles, pdfConverters.keySet());
            index = indexContent.getBytes(UTF8);

            defaultHtml = new String(readStream(TemplaterServer.class.getResourceAsStream("/default.html"), -1), UTF8);
            indexDefault = defaultHtml.replace("${content}", indexContent).getBytes(UTF8);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        documentFactory = Configuration.builder().build();
        //schema embedding and debug log will only work with valid Reporting Team or Enterprise license
        debugFactory = Configuration.builder().configureEditor().debugLog(true).configure(false).build();
        schemaFactory = Configuration.builder().configureEditor().tagListing(true).configure(true).build();
        System.getProperties().remove("com.sun.net.httpserver.HttpServerProvider"); //disable custom http servers
        //TODO: disable custom HttpServerProvider
        this.server = HttpServer.create(new InetSocketAddress(address, port), 0);
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

    private static void cacheAllFiles(String prefix, File file, Map<String, byte[]> cache, Logger logger) throws IOException {
        File[] files = file.listFiles();
        if (files == null) return;
        for (File f : files) {
            if (f.isDirectory()) {
                cacheAllFiles(prefix, f, cache, logger);
            } else {
                String name = f.getAbsolutePath().substring(prefix.length()).replace('\\', '/');
                byte[] bytes = Files.readAllBytes(f.toPath());
                if (logger.isLoggable(Level.FINE)) {
                    logger.log(Level.FINE, String.format("Found static resource: %s. Size: %d", name, bytes.length));
                }
                cache.put(name, bytes);
                cache.put(name.toLowerCase(), bytes);
                if (!name.startsWith("/")) {
                    cache.put("/" + name, bytes);
                    cache.put("/" + name.toLowerCase(), bytes);
                }
            }
        }
    }

    private String createIndex(String current, List<String> templateFiles, Set<String> pdfs) {
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
        StringBuilder pdfConverters = new StringBuilder();
        for(String pdf : pdfs) {
            pdfConverters.append("\"").append(pdf).append("\",");
        }
        if (pdfConverters.length() > 0) {
            pdfConverters.setLength(pdfConverters.length() - 1);
        }
        return templateHtml
                .replace("${pdfConverters}", pdfConverters.toString())
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

    private byte[] convertToPdf(byte[] templateBytes, String ext, String use) throws InterruptedException {
        final byte[][] lambdaResult = {null};
        final long start = new Date().getTime();
        Thread pdfThread = new Thread(() -> {
            try {
                Collection<PdfConverter> canUseConverters = pdfConverters.containsKey(use)
                        ? Collections.singletonList(pdfConverters.get(use))
                        : pdfConverters.values();
                for (PdfConverter pdf : canUseConverters) {
                    try {
                        lambdaResult[0] = pdf.convert(templateBytes, ext);
                    } catch (Exception ex) {
                        if (logger.isLoggable(Level.WARNING)) {
                            logger.log(Level.WARNING, String.format("PDF handling error. Duration: %d ms. Error: %s", new Date().getTime() - start, ex.toString()));
                        }
                    }
                }
            } catch (Exception global) {
                if (logger.isLoggable(Level.WARNING)) {
                    logger.log(Level.WARNING, String.format("Global PDF handling error. Duration: %d ms", new Date().getTime() - start));
                }
            }
        });
        pdfThread.start();
        pdfThread.join(timeoutLimit * 1000L);
        byte[] result = lambdaResult[0];
        if (result == null) {
            if (logger.isLoggable(Level.WARNING)) {
                logger.log(Level.WARNING, String.format("PDF conversion failed. Duration: %d ms", new Date().getTime() - start));
            }
            return null;
        }
        if (logger.isLoggable(Level.FINE)) {
            logger.log(Level.FINE, String.format("PDF conversion finished in %d ms. input size = %d, output size = %d", new Date().getTime() - start, templateBytes.length, result.length));
        }
        return result;
    }

    private byte[] processTemplate(final byte[] templateBytes, final Object data, final String ext, boolean asSchema, Map<String, String> params) {
        long start = new Date().getTime();
        String status = "failure";
        try {
            boolean debugLog = "true".equalsIgnoreCase(params.get("debuglog"))
                    || "true".equalsIgnoreCase(params.get("debugLog"));
            final InputStream is = new ByteArrayInputStream(templateBytes);
            final ByteArrayOutputStream baos = new ByteArrayOutputStream();
            //we can process template regularly or just to embed schema inside
            DocumentFactory factory = asSchema ? schemaFactory : debugLog ? debugFactory : documentFactory;
            DocumentFactory.CancellationToken cancellationToken = new DocumentFactory.CancellationToken() {
                private final long runUntil = System.currentTimeMillis() + timeoutLimit * 1000L;

                @Override
                public boolean isCanceled() {
                    //if processing does not finish within specified timeout (default 30 seconds), cancel the run
                    //when operation is canceled CancellationException is thrown
                    return timeoutLimit > 0 && System.currentTimeMillis() > runUntil;
                }
            };
            try (TemplateDocument doc = factory.open(is, ext, baos, cancellationToken)) {
                doc.process(data);
            }
            status = "success";
            return baos.toByteArray();
        } catch (Throwable ex) {
            if (logger.isLoggable(Level.SEVERE)) {
                logger.log(Level.SEVERE, ex.getMessage());
            }
            throw ex;
        } finally {
            if (logger.isLoggable(Level.FINE)) {
                logger.log(Level.FINE, String.format("Templater processed (%s) in %d ms. Status = %s", ext, new Date().getTime() - start, status));
            }
        }
    }

    private Object parseJson(final byte[] postData) throws ParseException {
        if (postData == null) return null;
        long start = new Date().getTime();
        final JsonReader<Object> reader = dslJson.newReader(postData);
        try {
            reader.getNextToken();
            return ObjectConverter.deserializeObject(reader);
        } catch (IOException e) {
            throw new ParseException(e.getMessage(), reader.getCurrentIndex());
        } finally {
            if (logger.isLoggable(Level.FINE)) {
                logger.log(Level.FINE, String.format("JSON processed in %d ms. Input size: %d", new Date().getTime() - start, postData.length));
            }
        }
    }

    private static String getExtension(final String template) throws ParseException {
        int lastIndexOfDot = template.lastIndexOf('.');
        if (lastIndexOfDot < 0) throw new ParseException("File must have an extension to indicate its type.", -1);
        return template.substring(lastIndexOfDot + 1).toLowerCase();
    }

    private void sendResponse(HttpExchange http, int code, String contentType, String response, long start) throws IOException {
        sendResponse(http, code, contentType, response.getBytes(UTF8), start);
    }

    private void sendResponse(HttpExchange http, int code, String contentType, byte[] bytes, long start) throws IOException {
        long duration = new Date().getTime() - start;
        if (code == 200) {
            http.getResponseHeaders().add("X-Duration", Long.toString(duration));
        }
        http.getResponseHeaders().add("Content-Type", contentType);
        http.sendResponseHeaders(code, bytes.length);
        http.getResponseBody().write(bytes);
        http.getResponseBody().close();
        if (logger.isLoggable(Level.FINE)) {
            logger.log(Level.FINE, String.format("Response code: %d. Duration: %d ms. Request: %s", code, duration, http.getRequestURI()));
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
           long start = new Date().getTime();
           if (httpExchange.getRequestURI().getPath().indexOf('/', 2) > 0) {
               if (logger.isLoggable(Level.WARNING)) {
                   logger.log(Level.WARNING, String.format("bad url: %s", httpExchange.getRequestURI()));
               }
               sendResponse(httpExchange, 400, MIME_PLAINTEXT, "Invalid url", start);
               return;
           }
           if (logger.isLoggable(Level.FINE)) {
               logger.log(Level.FINE, String.format("index entry: %s", httpExchange.getRequestURI()));
           }
           Map<String, String> params = splitQuery(httpExchange.getRequestURI().getQuery());
           String template = params.get("template");
           boolean isRoot = "/".equals(httpExchange.getRequestURI().getPath());
           if (template == null || !templateFiles.contains(template)) {
               byte[] bytes = isRoot ? indexDefault : index;
               sendResponse(httpExchange, 200, MIME_HTML, bytes, start);
           } else {
               String indexContent = createIndex(template, templateFiles, pdfConverters.keySet());
               String html = isRoot ? defaultHtml.replace("${content}", indexContent) : indexContent;
               sendResponse(httpExchange, 200, MIME_HTML, html, start);
           }
           if (logger.isLoggable(Level.FINE)) {
               logger.log(Level.FINE, String.format("index exit: %s", httpExchange.getRequestURI()));
           }
       }
   }

   class ProcessHandler implements HttpHandler {
       @Override
       public void handle(HttpExchange httpExchange) throws IOException {
           long start = new Date().getTime();
           if (logger.isLoggable(Level.FINE)) {
               logger.log(Level.FINE, String.format("process entry: %s", httpExchange.getRequestURI()));
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
                           if (lr.length == 2) {
                               params.put(lr[0], URLDecoder.decode(lr[1], "UTF-8"));
                           }
                       }
                   } else if (contentType != null && contentType.toLowerCase().startsWith("application/json")) {
                       jsonBytes = bytes;
                   } else {
                       sendResponse(httpExchange, 415, MIME_PLAINTEXT, "Use application/x-www-form-urlencoded or application/json.", start);
                       return;
                   }
               }
               String templateName = params.get("template");
               if (templateName == null || templateName.length() == 0 || templateName.indexOf('.') == -1) {
                   sendResponse(httpExchange, 400, MIME_PLAINTEXT, "Missing or bad template name.", start);
                   return;
               }
               String exampleName = "/templates/" + templateName.toLowerCase();
               if (!driveMap.containsKey(exampleName)) {
                   sendResponse(httpExchange, 400, MIME_PLAINTEXT, "Template not found.", start);
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
               byte[] templaterResultBytes;
               try {
                   templaterResultBytes = processTemplate(templaterBytes, parseJson(jsonBytes), ext, false, params);
               } catch (CancellationException e) {
                   sendResponse(httpExchange, 429, MIME_PLAINTEXT, "Processing the request took too long. Processing canceled", start);
                   return;
               }
               byte[] resultBytes;
               try {
                   resultBytes = toPdf ? convertToPdf(templaterResultBytes, ext, params.get("pdf")) : templaterResultBytes;
               } catch (Exception e) {
                   sendResponse(httpExchange, 500, MIME_PLAINTEXT, "Unable to convert document to PDF", start);
                   return;
               }
               if (resultBytes == null) {
                   sendResponse(httpExchange, 500, MIME_PLAINTEXT, "Failed creating report", start);
                   return;
               }
               httpExchange.getResponseHeaders().add("Accept-Ranges", "bytes");
               httpExchange.getResponseHeaders().add("Content-Disposition", "attachment;filename=" + name + "." + (toPdf ? "pdf" : ext));
               sendResponse(httpExchange, 200, getMimeType(toPdf ? "pdf" : ext), resultBytes, start);
           } catch (final ParseException e) {
               if (logger.isLoggable(Level.FINE)) {
                   logger.log(Level.FINE, e.toString());
               }
               sendResponse(httpExchange, 400, MIME_PLAINTEXT, e.getMessage(), start);
           } catch (final Exception e) {
               if (logger.isLoggable(Level.WARNING)) {
                   logger.log(Level.WARNING, e.toString());
               }
               sendResponse(httpExchange, 500, MIME_PLAINTEXT, "Unknown error", start);
           } finally {
               if (logger.isLoggable(Level.FINE)) {
                   logger.log(Level.FINE, String.format("process exit: %s", httpExchange.getRequestURI()));
               }
           }
       }
   }

   class FileHandler implements HttpHandler {
       @Override
       public void handle(HttpExchange httpExchange) throws IOException {
           long start = new Date().getTime();
           URI requestUri = httpExchange.getRequestURI();
           if (logger.isLoggable(Level.FINE)) {
               logger.log(Level.FINE, String.format("file entry: %s", requestUri));
           }
           String resourcePath = requestUri.getPath();
           byte[] bytes = driveMap.get(resourcePath);
           final String mime = getMimeType(resourcePath);
           try {
               if (resourcePath.startsWith("/templates/") && requestUri.getQuery() != null && !requestUri.getQuery().contains("?")) {
                   Map<String, String> params = splitQuery(requestUri.getQuery());
                   boolean withSchema = "true".equalsIgnoreCase(params.get("withschema"))
                           || "true".equalsIgnoreCase(params.get("withSchema"));
                   if (withSchema) {
                       String templateName = resourcePath.substring("/templates/".length());
                       byte[] jsonBytes = driveMap.get("/examples/" + templateName + ".json");
                       if (jsonBytes == null) {
                           sendResponse(httpExchange, 400, MIME_PLAINTEXT, "Template not found.", start);
                           return;
                       }
                       String ext = getExtension(templateName);
                       byte[] template;
                       try {
                           template = processTemplate(bytes, parseJson(jsonBytes), ext, true, params);
                       } catch (CancellationException e) {
                           sendResponse(httpExchange, 429, MIME_PLAINTEXT, "Processing the request took too long. Processing canceled", start);
                           return;
                       } catch (Exception e) {
                           sendResponse(httpExchange, 500, MIME_PLAINTEXT, "Error processing the request", start);
                           return;
                       }
                       sendResponse(httpExchange, 200, mime, template, start);
                       return;
                   }
               }
               sendResponse(httpExchange, 200, mime, bytes, start);
           } catch (final ParseException e) {
               if (logger.isLoggable(Level.FINE)) {
                   logger.log(Level.FINE, e.toString());
               }
               sendResponse(httpExchange, 400, MIME_PLAINTEXT, e.getMessage(), start);
           } catch (final Exception e) {
               if (logger.isLoggable(Level.WARNING)) {
                   logger.log(Level.WARNING, e.toString());
               }
               sendResponse(httpExchange, 500, MIME_PLAINTEXT, "Unknown error", start);
           } finally {
               if (logger.isLoggable(Level.FINE)) {
                   logger.log(Level.FINE, String.format("file exit: %s", requestUri));
               }
           }
       }
   }

    class DocumentHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange httpExchange) throws IOException {
            long start = new Date().getTime();
            if (logger.isLoggable(Level.FINE)) {
                logger.log(Level.FINE, String.format("document entry: %s", httpExchange.getRequestURI()));
            }
            try {
                Map<String, String> params = splitQuery(httpExchange.getRequestURI().getQuery());
                String templateName = params.get("template");
                if (templateName == null || templateName.length() == 0 || templateName.indexOf('.') == -1) {
                    sendResponse(httpExchange, 400, MIME_PLAINTEXT, "Missing or bad template name.", start);
                    return;
                }
                if ("POST".equalsIgnoreCase(httpExchange.getRequestMethod())) {
                    byte[] bytes = readBytes(httpExchange);
                    TemplateInfo info = new TemplateInfo(templateName, bytes);
                    try {
                        processTemplate(bytes, new HashMap<String, Object>(), info.extension, false, params);
                    } catch (CancellationException e) {
                        sendResponse(httpExchange, 429, MIME_PLAINTEXT, "Processing the request took too long. Processing canceled", start);
                        return;
                    }
                    synchronized (this) {
                        HashMap<String, TemplateInfo> copy = new HashMap<>(templatesMap);
                        copy.put(templateName, info);
                        templatesMap = copy;
                    }
                    httpExchange.getResponseHeaders().add("ETag", info.etag);
                    sendResponse(httpExchange, 200, MIME_PLAINTEXT, "Uploaded", start);
                    if (logger.isLoggable(Level.INFO)) {
                        logger.log(Level.INFO, String.format("new document uploaded: %s, size = %d", templateName, bytes.length));
                    }
                    return;
                }
                TemplateInfo info = templatesMap.get(templateName);
                if (info == null) {
                    sendResponse(httpExchange, 400, MIME_PLAINTEXT, "Template not found.", start);
                } else if ("PUT".equalsIgnoreCase(httpExchange.getRequestMethod())) {
                    String accept = httpExchange.getRequestHeaders().getFirst("accept");
                    boolean toPdf = accept != null && accept.contains(MIME_PDF)
                            || "true".equals(params.get("toPdf")) || "true".equals(params.get("topdf"));
                    byte[] json = readBytes(httpExchange);
                    byte[] templaterResultBytes;
                    try {
                        templaterResultBytes = processTemplate(info.content, parseJson(json), info.extension, false, params);
                    } catch (CancellationException e) {
                        sendResponse(httpExchange, 429, MIME_PLAINTEXT, "Processing the request took too long. Processing canceled", start);
                        return;
                    }
                    byte[] resultBytes = toPdf ? convertToPdf(templaterResultBytes, info.extension, params.get("pdf")) : templaterResultBytes;
                    if (resultBytes == null) {
                        sendResponse(httpExchange, 500, MIME_PLAINTEXT, "Failed creating report.", start);
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
                        sendResponse(httpExchange, 304, MIME_PLAINTEXT, new byte[0], start);
                        return;
                    }
                    httpExchange.getResponseHeaders().add("ETag", info.etag);
                    httpExchange.getResponseHeaders().add("Accept-Ranges", "bytes");
                    httpExchange.getResponseHeaders().add("Content-Disposition", "attachment;filename=" + info.name + "." + info.extension);
                    sendResponse(httpExchange, 200, getMimeType(info.extension), info.content, start);
                    if (logger.isLoggable(Level.FINE)) {
                        logger.log(Level.FINE, String.format("document: %s, size = %d", templateName, info.content.length));
                    }
                } else if ("DELETE".equalsIgnoreCase(httpExchange.getRequestMethod())) {
                    synchronized (this) {
                        HashMap<String, TemplateInfo> copy = new HashMap<>(templatesMap);
                        copy.remove(templateName);
                        templatesMap = copy;
                    }
                    sendResponse(httpExchange, 200, MIME_PLAINTEXT, "Removed", start);
                    if (logger.isLoggable(Level.INFO)) {
                        logger.log(Level.INFO, String.format("document removed: %s", templateName));
                    }
                } else {
                    sendResponse(httpExchange, 404, MIME_PLAINTEXT, "Unknown method", start);
                }
            } catch (final ParseException e) {
                if (logger.isLoggable(Level.FINE)) {
                    logger.log(Level.FINE, e.toString());
                }
                sendResponse(httpExchange, 400, MIME_PLAINTEXT, e.getMessage(), start);
            } catch (Exception e) {
                if (logger.isLoggable(Level.WARNING)) {
                    logger.log(Level.WARNING, e.toString());
                }
                sendResponse(httpExchange, 500, MIME_PLAINTEXT, "Unknown error", start);
            } finally {
                if (logger.isLoggable(Level.FINE)) {
                    logger.log(Level.FINE, String.format("document exit: %s", httpExchange.getRequestURI()));
                }
            }
        }
    }

   class PdfHandler implements HttpHandler {
       @Override
       public void handle(HttpExchange httpExchange) throws IOException {
           long start = new Date().getTime();
           if (logger.isLoggable(Level.FINE)) {
               logger.log(Level.FINE, String.format("pdf entry: %s", httpExchange.getRequestURI()));
           }
           try {
               Map<String, String> params = splitQuery(httpExchange.getRequestURI().getQuery());
               String file = params.get("file");
               if (file == null || file.length() == 0 || file.indexOf('.') == -1) {
                   sendResponse(httpExchange, 400, MIME_PLAINTEXT, "Missing or bad file name.", start);
                   return;
               }
               String extension = getExtension(file);
               String name = file.substring(0, file.length() - extension.length() - 1);
               byte[] input = readBytes(httpExchange);
               byte[] output = convertToPdf(input, extension, params.get("pdf"));
               if (output == null) {
                   sendResponse(httpExchange, 500, MIME_PLAINTEXT, "Failed creating PDF", start);
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
               sendResponse(httpExchange, 500, MIME_PLAINTEXT, "Unable to convert document to PDF", start);
           } finally {
               if (logger.isLoggable(Level.FINE)) {
                   logger.log(Level.FINE, String.format("pdf exit: %s", httpExchange.getRequestURI()));
               }
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
       if (resourcePath.endsWith("pptx"))
           return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
       if (resourcePath.endsWith("pdf")) return MIME_PDF;
       return MIME_PLAINTEXT;
   }

    public static void main(final String[] args) {
        try {
            int port = 7777;
            int timeoutLimit = 30;
            InetAddress address = InetAddress.getLoopbackAddress();
            String pluginFolder = ".";
            Level logLevel = Level.OFF;
            String[] pdfs = {"LibreOffice", "Spire", "Aspose"};
            boolean disableExit = false;
            File path = new File("resources");

            if (args.length == 0) {
                System.out.println("Example arguments:");
                System.out.println("    -port=8080");
                System.out.println("    -address=0.0.0.0");
                System.out.println("    -timeout=10");
                System.out.println("    -tmp=/mnt/ramdisk");
                System.out.println("    -log=INFO");
                System.out.println("    -plugins=/templater/jars");
                System.out.println("    -files=/templater/files");
                System.out.println("    -disable-exit");
                System.out.println("    -pdf=LibreOffice,Spire,Aspose");
                System.out.println("    -libreoffice=/user/home/office/libreoffice");
            }
            for (String a : args) {
                if (a.startsWith("-port=")) {
                    port = Integer.parseInt(a.substring("-port=".length()));
                } else if (a.startsWith("-address=")) {
                    address = InetAddress.getByName(a.substring("-address=".length()));
                } else if (a.startsWith("-timeout=")) {
                    timeoutLimit = Integer.parseInt(a.substring("-timeout=".length()));
                } else if (a.startsWith("-plugins=")) {
                    pluginFolder = a.substring("-plugins=".length());
                    File f = new File(pluginFolder);
                    if (!f.exists()) {
                        throw new RuntimeException("Unable to find specified plugins folder: " + pluginFolder);
                    }
                } else if (a.startsWith("-files=")) {
                    path = new File(a.substring("-files=".length()));
                    if (!path.exists()) {
                        throw new RuntimeException("Unable to find specified file folder: " + path);
                    }
                } else if (a.startsWith("-log=")) {
                    logLevel = Level.parse(a.substring("-log=".length()));
                } else if (a.startsWith("-pdf=")) {
                    pdfs = a.substring("-pdf=".length()).split(",");
                } else if ("-disable-exit".equals(a)) {
                    disableExit = true;
                }
            }
            if (!path.exists()) {
                path = new File(new File("Advanced", "TemplaterServer"), "resources");
                if (!path.exists()) {
                    System.out.println("Running without examples since resource path is not found...");
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
            LinkedHashMap<String, PdfConverter> pdfConverters = new LinkedHashMap<>();
            Logger logger = Logger.getLogger(TemplaterServer.class.getName());
            logger.setLevel(logLevel);
            logger.addHandler(new LoggingHandler(logLevel));
            Object[] pdfCtorArgs = {logger, args};
            for (String name : pdfs) {
                final Class<?> manifest;
                try {
                    manifest = ucl.loadClass("hr.ngs.templater.server." + name);
                } catch (Exception ex) {
                    throw new RuntimeException("Unable to find " + name + " on class path. Class must be in hr.ngs.templater.server package");
                }
                Constructor<?>[] ctors = manifest.getConstructors();
                if (ctors.length > 0) {
                    try {
                        Constructor<?> ctor = ctors[0];
                        if (ctor.getParameterCount() == 0) {
                            PdfConverter converter = (PdfConverter) ctor.newInstance();
                            pdfConverters.put(name, converter);
                        } else if (ctors[0].getParameterCount() == 2) {
                            PdfConverter converter = (PdfConverter) ctor.newInstance(pdfCtorArgs);
                            pdfConverters.put(name, converter);
                        }
                    } catch (Exception ex) {
                        ex.printStackTrace();
                    }
                }
            }
            TemplaterServer server = new TemplaterServer(address, port, path, timeoutLimit, logger, pdfConverters);
            if (disableExit) {
                System.out.println("Server started on port " + port);
            } else {
                System.out.println("Server started on port " + port + ", press Enter to stop ...");
                try {
                    System.in.read();
                } catch (final Exception e) {
                    e.printStackTrace();
                }
                server.close();
                ucl.close();
            }
        } catch (final Exception e) {
            e.printStackTrace();
        }
    }
}