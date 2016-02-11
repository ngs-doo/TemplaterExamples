package hr.ngs.templater.example;

import hr.ngs.templater.Configuration;
import hr.ngs.templater.ITemplateDocument;

import java.awt.*;
import java.io.*;

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

		FileOutputStream fos = new FileOutputStream(tmp);
		ITemplateDocument tpl = Configuration.factory().open(templateStream, "docx", fos);
		tpl.templater().replace("myArr", myArr);
		tpl.flush();
		fos.close();
		Desktop.getDesktop().open(tmp);
	}
}
