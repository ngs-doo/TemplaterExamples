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

public class WordChartExample {

	static class Info {
		public String tag;
		public Map<String, Object>[] pie;
		public Map<String, Object>[] lines;

		public Info(String tag, Map<String, Object>[] pie, Map<String, Object>[] lines) {
			this.tag = tag;
			this.pie = pie;
			this.lines = lines;
		}
	}

	@SuppressWarnings("unchecked")
	public static void main(final String[] args) throws Exception {
		InputStream templateStream = WordChartExample.class.getResourceAsStream("/Charts.docx");
		File tmp = File.createTempFile("chart", ".docx");

		Map<String, Object>[] pie1 = new HashMap[] {
			new HashMap<String, Object>() {{ put("name", "Top"); put("value", 11.2); }},
			new HashMap<String, Object>() {{ put("name", "Middle"); put("value", 1.2); }},
			new HashMap<String, Object>() {{ put("name", "Low"); put("value", 22); }}
		};
		Map<String, Object>[] pie2 = new HashMap[]{
				new HashMap<String, Object>() {{ put("name", "Top"); put("value", 44.2); }},
				new HashMap<String, Object>() {{ put("name", "Low"); put("value", 12); }}
		};
		Map<String, Object>[] lines1 = new HashMap[]{
				new HashMap<String, Object>() {{ put("category", "good"); put("ser1", 22); put("ser2", 55); put("ser3", 120); }},
				new HashMap<String, Object>() {{ put("category", "bad"); put("ser1", 12); put("ser2", 155); put("ser3", 20); }},
				new HashMap<String, Object>() {{ put("category", "great"); put("ser1", 2.5); put("ser2", 4.55); put("ser3", 2); }},
				new HashMap<String, Object>() {{ put("category", "awful"); put("ser1", 44.5); put("ser2", 55.3); put("ser3", 1.20); }}
		};
		Map<String, Object>[] lines2 = new HashMap[]{
				new HashMap<String, Object>() {{ put("category", "nice"); put("ser1", 122); put("ser2", 5); put("ser3", 20); }},
				new HashMap<String, Object>() {{ put("category", "cute"); put("ser1", 212); put("ser2", 15); put("ser3", 2); }}
		};

		FileOutputStream fos = new FileOutputStream(tmp);
		ITemplateDocument tpl = Configuration.factory().open(templateStream, "docx", fos);
		tpl.process(new Info[] {
				new Info("first page", pie1, lines1),
				new Info("second page", pie2, lines2)
		});
		tpl.flush();
		fos.close();
		java.awt.Desktop.getDesktop().open(tmp);
	}
}
