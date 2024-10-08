package hr.ngs.templater.example;

import hr.ngs.templater.*;
import org.w3c.dom.*;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

public class ImportExample {

    public static void main(final String[] args) throws Exception {
        DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
        InputStream templateStream = ImportExample.class.getResourceAsStream("/Master.docx");
        File tmp = File.createTempFile("import", ".docx");

        //method 1 = prepare OOXML for import directly
        Element docx = extractDocumentBody(dbFactory);
        NodeList paragraphs = docx.getElementsByTagName("w:p");
        ArrayList<Element> elements = new ArrayList<>(paragraphs.getLength());
        for (int i = 0; i < paragraphs.getLength(); i++) {
            Element par = (Element) paragraphs.item(i);
            if (!hasIdReference(par)) {
                elements.add(par);
            }
        }

        //method 2 = reference File type (somewhere on disk)
        Path embeddedDocx = Files.createTempFile("embed", ".docx");
        Files.copy(ImportExample.class.getResourceAsStream("/ToImport.docx"), embeddedDocx, StandardCopyOption.REPLACE_EXISTING);

        DocumentFactory factory = Configuration.factory();
        try (FileOutputStream fos = new FileOutputStream(tmp);
             TemplateDocument tpl = factory.open(templateStream, "docx", fos)) {
            tpl.templater().replace("imported_document1", elements.toArray(new Element[0]));//Templater will recognize XML and inject it directly into the document
            tpl.templater().replace("imported_document2", embeddedDocx.toFile());//Templater will recognize FileInfo type and add it as embedded document
        }

        //once imported, file can be deleted
        Files.delete(embeddedDocx);

        java.awt.Desktop.getDesktop().open(tmp);
    }

    private static boolean hasIdReference(Node node) {
        NamedNodeMap attributes = node.getAttributes();
        if (attributes != null) {
            for (int i = 0; i < attributes.getLength(); i++) {
                if ("r:id".equals(attributes.item(i).getNodeName())
                        || "r:embed".equals(attributes.item(i).getNodeName())
                        || "w:id".equals(attributes.item(i).getNodeName())) {
                    return true;
                }
            }
        }
        NodeList children = node.getChildNodes();
        if (children != null) {
            for (int i = 0; i < children.getLength(); i++) {
                if (hasIdReference(children.item(i))) {
                    return true;
                }
            }
        }
        return false;
    }

    private static Element extractDocumentBody(DocumentBuilderFactory dbFactory) throws Exception {
        DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
        ZipInputStream zip = new ZipInputStream(ImportExample.class.getResourceAsStream("/ToImport.docx"));
        ZipEntry document;
        do {
            document = zip.getNextEntry();
        } while (!"word/document.xml".equals(document.getName()));
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        byte[] bytesIn = new byte[8192];
        int read;
        while ((read = zip.read(bytesIn)) != -1) {
            bos.write(bytesIn, 0, read);
        }
        bos.close();
        Document docx = dBuilder.parse(new ByteArrayInputStream(bos.toByteArray()));
        zip.close();
        return (Element) docx.getDocumentElement().getFirstChild();
    }
}
