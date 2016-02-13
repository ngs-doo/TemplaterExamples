package hr.ngs.templater.example;

import hr.ngs.templater.*;

import java.awt.*;
import java.io.*;
import java.util.Arrays;

public class CollapseExample {
	public static void main(final String[] args) throws Exception {
		File tmp = File.createTempFile("collapse", ".docx");
		Application application1 =
				new Application()
						.setPaybackYears(20)
						.setUcCheck(true).setUcCheckResponse("")
						.setApplicant(new Applicant("first applicant").setFrom("Google", 2012, 11));
		Application application2 =
				new Application()
						.setPaybackYears(15)
						.setUcCheck(false)
						.setUcCheckResponse("Not good enough")
						.setApplicant(new Applicant("second applicant").setFrom("Apple", 2015, 12))
						.setCoApplicant(new Applicant("second co-applicant").setFromUntil("IBM", 2014, 11, 2015, 12));
		InputStream templateStream = CollapseExample.class.getResourceAsStream("/Collapse.docx");
		FileOutputStream fos = new FileOutputStream(tmp);
		ITemplateDocument tpl = Configuration.factory().open(templateStream, "docx", fos);
		tpl.process(Arrays.asList(application1, application2));
		tpl.flush();
		fos.close();
		Desktop.getDesktop().open(tmp);
	}
}
