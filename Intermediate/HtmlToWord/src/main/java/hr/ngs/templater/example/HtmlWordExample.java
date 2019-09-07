package hr.ngs.templater.example;

import hr.ngs.templater.Configuration;
import hr.ngs.templater.IDocumentFactoryBuilder;
import hr.ngs.templater.ITemplateDocument;
import org.docx4j.XmlUtils;
import org.docx4j.convert.in.xhtml.XHTMLImporterImpl;
import org.docx4j.openpackaging.exceptions.Docx4JException;
import org.docx4j.openpackaging.packages.WordprocessingMLPackage;
import org.w3c.dom.*;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.*;
import java.util.*;

public class HtmlWordExample {

    private static Element convert(String html, DocumentBuilder dBuilder) {
        try {
            WordprocessingMLPackage wordMLPackage = WordprocessingMLPackage.createPackage();
            XHTMLImporterImpl importer = new XHTMLImporterImpl(wordMLPackage);
            List<Object> ooxml = importer.convert(html, null);
            wordMLPackage.getMainDocumentPart().getContent().addAll(ooxml);
            String xml = XmlUtils.marshaltoString(wordMLPackage.getMainDocumentPart().getJaxbElement().getBody(), true, false);
            Document doc = dBuilder.parse(new InputSource(new StringReader(xml)));
            return doc.getDocumentElement();
        } catch (Docx4JException e) {
            throw new RuntimeException(e);
        } catch (SAXException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private static class SimpleHtmlConverter implements IDocumentFactoryBuilder.IFormatter {
        private final DocumentBuilder dBuilder;
        public SimpleHtmlConverter(DocumentBuilder dBuilder) {
            this.dBuilder = dBuilder;
        }

        @Override
        public Object format(Object value, String metadata) {
            if (metadata.equals("simple-html")) {
                return convert(value.toString(), dBuilder).getFirstChild();
            }
            return value;
        }
    }

    private static class ComplexHtmlConverter implements IDocumentFactoryBuilder.IFormatter {
        private final DocumentBuilder dBuilder;
        public ComplexHtmlConverter(DocumentBuilder dBuilder) {
            this.dBuilder = dBuilder;
        }
        @Override
        public Object format(Object value, String metadata) {
            if (metadata.equals("complex-html")) {
                NodeList bodyNodes = convert(value.toString(), dBuilder).getChildNodes();
                List<Element> elements = new ArrayList<Element>(bodyNodes.getLength());
                for (int i = 0; i < bodyNodes.getLength(); i++) {
                    elements.add((Element) bodyNodes.item(i));
                }
                return elements.toArray(new Element[0]);
            }
            return value;
        }
    }

    public static void main(final String[] args) throws Exception {
        DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
        DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();

        InputStream templateStream = HtmlWordExample.class.getResourceAsStream("/template.docx");
        File tmp = File.createTempFile("html", ".docx");

        FileOutputStream fos = new FileOutputStream(tmp);
        ITemplateDocument tpl =
                Configuration.builder()
                        .include(new SimpleHtmlConverter(dBuilder))
                        .include(new ComplexHtmlConverter(dBuilder))
                        .build().open(templateStream, "docx", fos);
        tpl.process(new HashMap<String, Object>() {{
            put("Html1", "<html>\n" +
                    "<head>title</head>\n" +
                    "<body>\n" +
                    "some <strong>text</strong> in <span style=\"color:red\">red!</span>\n" +
                    "</body>\n" +
                    "</html>");
            put("Html2", "<html>\n" +
                    "<head>title</head>\n" +
                    "<body>\n" +
                    "<ul>\n" +
                    "        <li>Number 1</li>\n" +
                    "        <li>Number 2</li>\n" +
                    "</ul>\n" +
                    "</body>\n" +
                    "</html>");
        }});
        tpl.flush();
        fos.close();
        java.awt.Desktop.getDesktop().open(tmp);
    }
}
