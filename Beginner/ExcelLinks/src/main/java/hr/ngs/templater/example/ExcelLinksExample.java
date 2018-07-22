package hr.ngs.templater.example;

import hr.ngs.templater.Configuration;
import hr.ngs.templater.ITemplateDocument;

import java.io.*;
import java.util.*;

public class ExcelLinksExample {

	public static void main(final String[] args) throws Exception {
		InputStream templateStream = ExcelLinksExample.class.getResourceAsStream("/Links.xlsx");
		File tmp = File.createTempFile("link", ".xlsx");

		List<Map<String, String>> favorites = new ArrayList<Map<String, String>>();
		favorites.add(create("Egyptian pyramids", "2630 BC", "BBC", "http://www.bbc.co.uk/history/ancient/egyptians/"));
		favorites.add(create("The Viking at Stamford Bridge", "1066-11-25", "Badass of the week", "http://www.badassoftheweek.com/stamfordbridge.html"));
		favorites.add(create("World war I", "1914-6-28", "Wikipedia", "http://en.wikipedia.org/wiki/World_War_I"));

		FileOutputStream fos = new FileOutputStream(tmp);
		ITemplateDocument tpl = Configuration.factory().open(templateStream, "xlsx", fos);
		tpl.process(favorites);
		tpl.flush();
		fos.close();
		java.awt.Desktop.getDesktop().open(tmp);
	}

	private static Map<String, String> create(String event, String date, String link, String address) {
		Map<String, String> map = new HashMap<String, String>();
		map.put("event", event);
		map.put("date", date);
		map.put("link_name", link);
		map.put("link_url", address);
		return map;
	}
}
