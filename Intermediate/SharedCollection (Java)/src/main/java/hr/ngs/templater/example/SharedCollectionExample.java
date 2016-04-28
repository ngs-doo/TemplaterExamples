package hr.ngs.templater.example;

import hr.ngs.templater.*;

import java.awt.*;
import java.io.*;
import java.util.*;
import java.util.List;

public class SharedCollectionExample {

	static class Patient {
		public final String name;
		public final List<History> history;
		public final List<Medicine> medicine;

		Patient(String name, List<History> history, List<Medicine> medicine) {
			this.name = name;
			this.history = history;
			this.medicine = medicine;
		}
	}

	static class History {
		public final String description;
		public final int hospitalization;

		History(String description, int hospitalization) {
			this.description = description;
			this.hospitalization = hospitalization;
		}
	}

	static class Medicine {
		public final String name;
		public final int cost;
		public final int interval;
		public final int duration;

		Medicine(String name, int cost, int interval, int duration) {
			this.name = name;
			this.cost = cost;
			this.interval = interval;
			this.duration = duration;
		}
	}

	public static void main(final String[] args) throws Exception {
		InputStream templateStream = SharedCollectionExample.class.getResourceAsStream("/TwoTables.docx");
		File tmp = File.createTempFile("collection", ".docx");
		FileOutputStream fos = new FileOutputStream(tmp);
		IDocumentFactory factory = Configuration.factory();
		ITemplateDocument tpl = factory.open(templateStream, "docx", fos);
		HashMap<String, Object> data = new HashMap<String, Object>();
		data.put("analysis", "Patient info");
		List<Patient> patients = new ArrayList<Patient>();
		data.put("patients", patients);
		patients.add(new Patient("Kill Bill",
				Arrays.asList(new History("Sword cut", 13), new History("Knife stab", 6)),
				Arrays.asList(new Medicine("Prozac", 100, 6, 365), new Medicine("Zoloft", 120, 12, 200))));
		patients.add(new Patient("Miracle man",
				Collections.singletonList(new History("Gunshot", 0)),
				new ArrayList<Medicine>()));
		patients.add(new Patient("Bruce Lee",
				Arrays.asList(new History("Claw cut", 1), new History("Bruising", 0)),
				Arrays.asList(new Medicine("Vitamins", 4, 8, 365), new Medicine("Fiber", 6, 8, 365))));

		tpl.process(data);
		tpl.flush();
		fos.close();
		Desktop.getDesktop().open(tmp);
	}
}
