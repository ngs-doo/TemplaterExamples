package hr.ngs.templater.example;

import hr.ngs.templater.Configuration;
import hr.ngs.templater.IDocumentFactoryBuilder;
import hr.ngs.templater.ITemplateDocument;
import org.w3c.dom.Document;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.*;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.*;

public class WordLinksExample {

	private static class StringToUrl implements IDocumentFactoryBuilder.IFormatter {
		@Override
		public Object format(Object value, String metadata) {
			if ("url".equals(metadata)) {
				try {
					return new URL("http://" + value);
				} catch (MalformedURLException ignore) {
				}
			}
			return value;
		}
	}

	private static class ToHyperlink implements IDocumentFactoryBuilder.IFormatter {
		DocumentBuilderFactory dbFactory;
		DocumentBuilder dBuilder;

		ToHyperlink() throws ParserConfigurationException {
			dbFactory = DocumentBuilderFactory.newInstance();
			dBuilder = dbFactory.newDocumentBuilder();
		}
		@Override
		public Object format(Object value, String metadata) {
			if ("hyperlink".equals(metadata) && value instanceof Map) {
				Map map = (Map)value;
				String text = map.get("text").toString();
				String url = map.get("url").toString();
				String xml = "<w:p>\n" +
						" <w:fldSimple w:instr=\" HYPERLINK " + url + " \">\n" +
						"  <w:r>\n" +
						"   <w:rPr><w:rStyle w:val=\"Hyperlink\"/></w:rPr>\n" +
						"   <w:t>" + text + "</w:t>\n" +
						"  </w:r>\n" +
						" </w:fldSimple>\n" +
						"</w:p>";
				try {
					Document doc = dBuilder.parse(new InputSource(new StringReader(xml)));
					return doc.getDocumentElement();
				} catch (SAXException e) {
					return value;
				} catch (IOException e) {
					return value;
				}
			}
			return value;
		}
	}

	public static void main(final String[] args) throws Exception {
		InputStream templateStream = WordLinksExample.class.getResourceAsStream("/Links.docx");
		File tmp = File.createTempFile("link", ".docx");

		List<Map<String, Object>> favorites = new ArrayList<Map<String, Object>>();
		favorites.add(create("Egyptian pyramids", "2630 BC", "BBC", "http://www.bbc.co.uk/history/ancient/egyptians/", "Pyramids", "pyramids@egypt.com", "Pyramids"));
		favorites.add(create("The Viking at Stamford Bridge", "1066-11-25", "Badass of the week", "http://www.badassoftheweek.com/stamfordbridge.html", "Badass", "vikings@league.com", "Viking"));
		favorites.add(create("World war I", "1914-6-28", "Wikipedia", "http://en.wikipedia.org/wiki/World_War_I", "Historians", "history@world.com", "WWI"));

		Map<String, Object> others = new HashMap<String, Object>();
		others.put("urlType", new URL("http://templater.info"));
		others.put("urlString", "templater.info");
		HashMap<String, String> hyperlink = new HashMap<String, String>();
		hyperlink.put("text", "text for link");
		hyperlink.put("url", "http://templater.info/demo");
		others.put("hyperlink", hyperlink);

		FileOutputStream fos = new FileOutputStream(tmp);
		ITemplateDocument tpl = Configuration.builder().include(new StringToUrl()).include(new ToHyperlink()).build().open(templateStream, "docx", fos);
		tpl.process(favorites);
		tpl.process(others);
		tpl.flush();
		fos.close();
		java.awt.Desktop.getDesktop().open(tmp);
	}

	private static Map<String, Object> create(String event, String date, String link, Object address, String name, String email, String subject) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("event", event);
		map.put("date", date);
		map.put("link_name", link);
		map.put("link_url", address);
		map.put("email_name", name);
		map.put("email_address", email);
		map.put("email_subject", subject);
		return map;
	}
}
