package hr.ngs.templater.example;

import hr.ngs.templater.Configuration;
import hr.ngs.templater.ITemplateDocument;

import java.awt.*;
import java.io.*;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

public class TableExample {
	public static void main(final String[] args) throws Exception {
		InputStream templateStream = TableExample.class.getResourceAsStream("/MyTable.xlsx");
		File tmp = File.createTempFile("table", ".xlsx");

		SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");

		List<SpecialMenu> specialMenu = new ArrayList<SpecialMenu>();
		specialMenu.add(new SpecialMenu("Jelacic steak", "80 EUR", dateFormat.parse("16/05/2012")));
		specialMenu.add(new SpecialMenu("Sea surprise", "120 EUR", dateFormat.parse("18/05/2012")));

		List<DailyMenu> dailyMenu = new ArrayList<DailyMenu>();
		dailyMenu.add(new DailyMenu("Chickago pizza", "Olives", "38 EUR"));
		dailyMenu.add(new DailyMenu("Cordon bleu", "French fries", "45 EUR"));
		dailyMenu.add(new DailyMenu("Beefsteak", "Salad, french fries", "65 EUR"));

		Menu menu = new Menu("Bon voyage", specialMenu, dailyMenu);

		FileOutputStream fos = new FileOutputStream(tmp);
		ITemplateDocument tpl = Configuration.factory().open(templateStream, "xlsx", fos);
		tpl.process(menu);
		tpl.flush();
		fos.close();
		Desktop.getDesktop().open(tmp);
	}
}
