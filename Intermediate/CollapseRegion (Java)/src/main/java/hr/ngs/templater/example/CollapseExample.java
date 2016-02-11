package hr.ngs.templater.example;

import hr.ngs.templater.*;

import java.awt.*;
import java.io.*;

public class CollapseExample {
	public static void main(final String[] args) throws Exception {
		File tmp1 = File.createTempFile("collapse", ".docx");
		File tmp2 = File.createTempFile("collapse", ".docx");
		Application application1 =
				new Application()
						.setPaybackYears(20)
						.setUcCheck(true)
						.setApplicant(new Applicant("first applicant").setFrom("Google", 2012, 11));
		Application application2 =
				new Application()
						.setPaybackYears(15)
						.setUcCheck(false)
						.setUcCheckResponse("Not good enough")
						.setApplicant(new Applicant("second applicant").setFrom("Apple", 2015, 12))
						.setCoApplicant(new Applicant("second co-applicant").setFromUntil("IBM", 2014, 11, 2015, 12));
		processAppliction(tmp1, application1);
		processAppliction(tmp2, application2);
		Desktop.getDesktop().open(tmp1);
		Desktop.getDesktop().open(tmp2);
	}

	private static void processAppliction(File tmp, Application application) throws IOException {
		InputStream templateStream = CollapseExample.class.getResourceAsStream("/Collapse.docx");
		FileOutputStream fos = new FileOutputStream(tmp);
		ITemplateDocument tpl = Configuration.factory().open(templateStream, "docx", fos);
		tpl.process(application);
		tpl.flush();
		fos.close();
	}
}
