package hr.ngs.templater.example;

import hr.ngs.templater.Configuration;
import hr.ngs.templater.ITemplateDocument;

import java.io.*;

public class SimpleExcelExample {

	static class MyClass {
		public String Name = "Marry";
		public Date BirthDay = new Date( 2005, 10, 10);
		public Date Today = new Date(new java.util.Date());
	}

	static class Date {
		public final int Year, Month, Day;
		public Date(java.util.Date date) {
			Year = date.getYear() + 1900;
			Month = date.getMonth() + 1;
			Day = date.getDay() + 1;
		}
		public Date(int year, int month, int day) {
			this.Year = year;
			this.Month = month;
			this.Day = day;
		}
	}

	public static void main(final String[] args) throws Exception {
		InputStream templateStream = SimpleExcelExample.class.getResourceAsStream("/MySpreadsheet.xlsx");
		File tmp = File.createTempFile("simple-excel", ".xlsx");

		MyClass data = new MyClass();

		FileOutputStream fos = new FileOutputStream(tmp);
		ITemplateDocument tpl = Configuration.factory().open(templateStream, "xlsx", fos);
		tpl.process(data);
		tpl.flush();
		fos.close();
		java.awt.Desktop.getDesktop().open(tmp);
	}

}
