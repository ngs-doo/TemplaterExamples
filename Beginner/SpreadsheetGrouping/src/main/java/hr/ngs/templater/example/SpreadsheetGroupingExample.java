package hr.ngs.templater.example;

import hr.ngs.templater.Configuration;
import hr.ngs.templater.ITemplateDocument;

import java.io.*;
import java.util.*;

public class SpreadsheetGroupingExample {

	static class Info {
		public String Name;
		public final List<Item> Items = new ArrayList<Item>();
		public int Total() { return Items.size(); }
	}

	static class Item {
		public final String Name;
		public final int A, B;
		public int Total() { return A + B; }
		public Item(String name, int a, int b) {
			this.Name = name;
			this.A = a;
			this.B = b;
		}
	}

	public static void main(final String[] args) throws Exception {
		InputStream templateStream = SpreadsheetGroupingExample.class.getResourceAsStream("/Grouping.xlsx");
		File tmp = File.createTempFile("grouping", ".xlsx");

		final List<Info> list = new ArrayList<Info>();
		for (int i = 1; i <= 5; i++) {
			List<Item> items = new ArrayList<Item>();
			for (int j = 1; j <= i; j++) {
				items.add(new Item("name " + i + " - " + j, j * 2 + i * 3 + 2, j * 3 + i * 2 + 1));
			}
			Info info = new Info();
			info.Name = "Group " + i;
			info.Items.addAll(items);
			list.add(info);
		}

		FileOutputStream fos = new FileOutputStream(tmp);
		ITemplateDocument tpl = Configuration.factory().open(templateStream, "xlsx", fos);
		tpl.process(new HashMap<String, List<Info>>() {{ put("Simple", list); put("Range", list); }});
		tpl.flush();
		fos.close();
		java.awt.Desktop.getDesktop().open(tmp);
	}
}
