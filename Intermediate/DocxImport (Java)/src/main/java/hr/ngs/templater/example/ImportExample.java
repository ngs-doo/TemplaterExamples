package hr.ngs.templater.example;

import hr.ngs.templater.*;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

public class ImportExample {

	public static void main(final String[] args) throws Exception {
		InputStream templateStream = ImportExample.class.getResourceAsStream("/Master.docx");
		File tmp = File.createTempFile("import", ".docx");
		FileOutputStream fos = new FileOutputStream(tmp);
		Element docx = extractDocumentBody();
		NodeList paragraphs = docx.getElementsByTagName("w:p");
		Element[] elements = new Element[paragraphs.getLength()];
		for (int i = 0; i < elements.length; i++) {
			elements[i] = (Element) paragraphs.item(i);
		}
		IDocumentFactory factory = Configuration.factory();
		ITemplateDocument tpl = factory.open(templateStream, "docx", fos);
		tpl.templater().replace("imported_document", elements);
		tpl.flush();
		fos.close();
		java.awt.Desktop.getDesktop().open(tmp);
	}

	private static Element extractDocumentBody() throws Exception {
		DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
		DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
		ZipInputStream zip = new ZipInputStream(ImportExample.class.getResourceAsStream("/ToImport.docx"));
		ZipEntry document;
		do {
			document = zip.getNextEntry();
		} while (!"word/document.xml".equals(document.getName()));
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		byte[] bytesIn = new byte[8192];
		int read = 0;
		while ((read = zip.read(bytesIn)) != -1) {
			bos.write(bytesIn, 0, read);
		}
		bos.close();
		Document docx = dBuilder.parse(new ByteArrayInputStream(bos.toByteArray()));
		zip.close();
		return (Element) docx.getDocumentElement().getFirstChild();
	}
}
