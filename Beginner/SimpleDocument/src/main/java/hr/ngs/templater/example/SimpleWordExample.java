package hr.ngs.templater.example;

import hr.ngs.templater.Configuration;
import hr.ngs.templater.ITemplateDocument;

import java.io.*;
import java.util.*;

public class SimpleWordExample {

	static class MyClass {
		public String Tag = "an example";
	}

	public static void main(final String[] args) throws Exception {
		InputStream templateStream = SimpleWordExample.class.getResourceAsStream("/MyDocument.docx");
		File tmp = File.createTempFile("simple-word", ".docx");

		MyClass data = new MyClass();

		FileOutputStream fos = new FileOutputStream(tmp);
		ITemplateDocument tpl = Configuration.factory().open(templateStream, "docx", fos);
		tpl.process(data);
		tpl.flush();
		fos.close();
		java.awt.Desktop.getDesktop().open(tmp);
	}

}
