package hr.ngs.templater.example;

import hr.ngs.templater.Configuration;
import hr.ngs.templater.ITemplateDocument;

import java.awt.*;
import java.io.*;
import java.util.HashMap;
import java.util.Map;

public class DynamicResize {
	public static void main(final String[] args) throws Exception {
		InputStream templateStream = DynamicResize.class.getResourceAsStream("/GroceryList.docx");
		File tmp = File.createTempFile("grocery", ".docx");

		String[][] myArr = {
				{"Apples", "Milk", "Bread"},
				{"Golden apple", "Dukat", "Black bread"},
				{"Granny smith", "Omega 3", "Alpine"},
				{"Red GMO", "Cow", "French bread"}
		};

		String[][] nulls = {
				{"Day", "Breakfast", "Lunch", "Dinner"},
				{"Monday", "Cornflakes", "Cevapi with onions", null},
				{"Tuesday", "Serial", "Meatballs", "Apple"},
				{"Wednesday", "Cokolino", null, "Bananas"},
				{"Thursday", "Salad", null, "Fruit"},
				{"Friday", "Nutella", "Chocolate", null},
				{"Saturday", "Lasagnas", null, null},
				{"Sunday", "Cookies", "Cake", "Cake"},
		};

		FileOutputStream fos = new FileOutputStream(tmp);
		ITemplateDocument tpl = Configuration.factory().open(templateStream, "docx", fos);
		tpl.templater().replace("myArr", myArr);
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("nulls", nulls);
		tpl.process(map);
		tpl.flush();
		fos.close();
		Desktop.getDesktop().open(tmp);
	}
}
