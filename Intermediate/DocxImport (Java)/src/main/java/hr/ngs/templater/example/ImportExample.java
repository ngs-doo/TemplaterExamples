package hr.ngs.templater.example;

import hr.ngs.templater.*;
import org.w3c.dom.*;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.*;
import java.util.ArrayList;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

public class ImportExample {

	public static void main(final String[] args) throws Exception {
		InputStream templateStream = ImportExample.class.getResourceAsStream("/Master.docx");
		File tmp = File.createTempFile("import", ".docx");
		FileOutputStream fos = new FileOutputStream(tmp);
		Element docx = extractDocumentBody();
		NodeList paragraphs = docx.getElementsByTagName("w:p");
		ArrayList<Element> elements = new ArrayList<Element>(paragraphs.getLength());
		for (int i = 0; i < paragraphs.getLength(); i++) {
			Element par = (Element) paragraphs.item(i);
			if (!hasIdReference(par)) {
				elements.add(par);
			}
		}
		IDocumentFactory factory = Configuration.factory();
		ITemplateDocument tpl = factory.open(templateStream, "docx", fos);
		tpl.templater().replace("imported_document", elements.toArray(new Element[0]));
		tpl.flush();
		fos.close();
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
