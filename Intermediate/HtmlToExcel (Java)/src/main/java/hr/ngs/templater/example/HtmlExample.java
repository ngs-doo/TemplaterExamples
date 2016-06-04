package hr.ngs.templater.example;

import hr.ngs.templater.Configuration;
import hr.ngs.templater.IDocumentFactoryBuilder;
import hr.ngs.templater.ITemplateDocument;
import org.docx4j.XmlUtils;
import org.docx4j.convert.in.xhtml.XHTMLImporterImpl;
import org.docx4j.openpackaging.packages.WordprocessingMLPackage;
import org.w3c.dom.*;
import org.xml.sax.InputSource;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.*;
import java.util.*;

public class HtmlExample {

	static class Number {
		public final int number;

		public Number(int number) {
			this.number = number;
		}
	}

	private static class HtmlToOoxml implements IDocumentFactoryBuilder.IFormatter {
		DocumentBuilderFactory dbFactory;
		DocumentBuilder dBuilder;

		HtmlToOoxml() throws ParserConfigurationException {
			dbFactory = DocumentBuilderFactory.newInstance();
			dBuilder = dbFactory.newDocumentBuilder();
		}

		private static void stripWordTags(Node node, Document doc) {
			if (node.getNodeName().startsWith("w:")) {
				doc.renameNode(node, null, node.getNodeName().substring(2));
			}
			NamedNodeMap attributes = node.getAttributes();
			if (attributes != null) {
				for (int i = 0; i < attributes.getLength(); i++) {
					Node att = attributes.item(i);
					if (att.getNodeName().startsWith("w:")) {
						doc.renameNode(att, null, att.getNodeName().substring(2));
					}
				}
			}
			NodeList children = node.getChildNodes();
			if (children != null) {
				for (int i = 0; i < children.getLength(); i++) {
					Node item = children.item(i);
					stripWordTags(item, doc);
					if ("color".equals(item.getNodeName())) {
						//set correct Excel color attribute
						Element el = (Element)item;
						String val = el.getAttribute("val");
						el.removeAttribute("val");
						el.setAttribute("rgb", val);
					}
				}
			}
		}

		@Override
		public Object format(Object value, String metadata) {
			if ("convert-html".equals(metadata)) {
				try {
					WordprocessingMLPackage wordMLPackage = WordprocessingMLPackage.createPackage();
					XHTMLImporterImpl importer = new XHTMLImporterImpl(wordMLPackage);
					List<Object> ooxml = importer.convert(value.toString(), null);
					wordMLPackage.getMainDocumentPart().getContent().addAll(ooxml);
					String xml = XmlUtils.marshaltoString(wordMLPackage.getMainDocumentPart().getJaxbElement().getBody(), true, false);
					Document doc = dBuilder.parse(new InputSource(new StringReader(xml)));
					stripWordTags(doc.getDocumentElement(), doc);
					NodeList bodyNodes = doc.getDocumentElement().getChildNodes();
					List<Element> runs = new ArrayList<Element>(bodyNodes.getLength());
					for (int i = 0; i < bodyNodes.getLength(); i++) {
						Node par = bodyNodes.item(i);
						if ("p".equals(par.getNodeName())) {
							for (int j = 0; j < par.getChildNodes().getLength(); j++) {
								Node r = par.getChildNodes().item(j);
								if ("r".equals(r.getNodeName())) {
									runs.add((Element) r);
								}
							}
						}
					}
					return runs.toArray(new Element[0]);
				} catch (Exception ignore) {
					System.out.println(ignore);
				}
			}
			return value;
		}
	}

	public static void main(final String[] args) throws Exception {
		InputStream templateStream = HtmlExample.class.getResourceAsStream("/Document.xlsx");
		File tmp = File.createTempFile("document", ".xlsx");

		Map<String, Object> map = new HashMap<String, Object>();
		map.put("html", "<p>My simple <b>bold</b> text in <span style=\"color:red\">red!</span></p>");
		map.put("numbers", Arrays.asList(new Number(100), new Number(-100), new Number(10)));

		FileOutputStream fos = new FileOutputStream(tmp);
		ITemplateDocument tpl = Configuration.builder().include(new HtmlToOoxml()).build().open(templateStream, "xlsx", fos);
		tpl.process(map);
		tpl.flush();
		fos.close();
		java.awt.Desktop.getDesktop().open(tmp);
	}
}
