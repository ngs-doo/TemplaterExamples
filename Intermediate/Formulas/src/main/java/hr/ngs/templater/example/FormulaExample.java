package hr.ngs.templater.example;

import hr.ngs.templater.Configuration;
import hr.ngs.templater.ITemplateDocument;

import java.io.*;
import java.util.*;

public class FormulaExample {
	static class Total {
		public String name;
		public int person;
	}

	public static void main(final String[] args) throws Exception {
		InputStream templateStream = FormulaExample.class.getResourceAsStream("/Formulas.xlsx");
		File tmp = File.createTempFile("formula", ".xlsx");

		List<Group> groups = new ArrayList<Group>();
		for (int i = 0; i < 5; i++) {
			groups.add(new Group(i + 1));
		}
		List<Total> totals = new ArrayList<Total>();
		for (int i = 0; i < 3; i++) {
			Total t = new Total();
			t.name = "total " + i;
			t.person = 2000 + i * i;
			totals.add(t);
		}
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("groups", groups);
		map.put("total", totals);

		FileOutputStream fos = new FileOutputStream(tmp);
		ITemplateDocument tpl = Configuration.factory().open(templateStream, "xlsx", fos);
		tpl.process(map);
		tpl.flush();
		fos.close();
		java.awt.Desktop.getDesktop().open(tmp);
	}
}
