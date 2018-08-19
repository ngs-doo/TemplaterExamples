package hr.ngs.templater.example;

import hr.ngs.templater.*;

import javax.imageio.ImageIO;
import java.io.*;
import java.util.*;

public class ListsTablesExample {

	static class Person {
		public String Name;
		public Job[] Jobs;
		public Person(String name, Job... jobs) {
			this.Name = name;
			this.Jobs = jobs;
		}
	}
	static class Job {
		public String CompanyName;
		public Project[] Projects;
		public String CompanyLogo;
		public Coworker[] Coworkers;
		public Job(String company, String logo, List<Coworker> coworkers, Project... projects) {
			this.CompanyName = company;
			this.CompanyLogo = logo;
			this.Projects = projects;
			this.Coworkers = coworkers.toArray(new Coworker[0]);
		}
	}
	static class Project {
		public String Name;
		public Task[] Tasks;
		public Project(String name, String... task) {
			this.Name = name;
			this.Tasks = new Task[task.length];
			for(int i = 0; i < task.length; i++) {
				Task t = new Task();
				t.Description = task[i];
				this.Tasks[i] = t;
			}
		}
	}
	static class Task {
		public String Description;
	}
	static class Coworker {
		public String Name;
		public String Title;
		public String Impression;
		public Coworker(String name, String title, String impression) {
			this.Name = name;
			this.Title = title;
			this.Impression = impression;
		}
	}

	static class LoadImage implements IDocumentFactoryBuilder.IFormatter {

		@Override
		public Object format(Object value, String metadata) {
			if (value instanceof String && metadata.equals("load-image")) {
				try {
					return ImageIO.read(ListsTablesExample.class.getResourceAsStream("/" + value));
				} catch (IOException e) {
					throw new RuntimeException(e);
				}
			}
			return value;
		}
	}

	public static void main(final String[] args) throws Exception {
		InputStream templateStream = ListsTablesExample.class.getResourceAsStream("/Nesting.docx");
		File tmp = File.createTempFile("nesting", ".docx");

		Person woz = new Person(
				"Steve Wozniak",
				new Job(
						"Apple",
						"apple.jpg",
						Arrays.asList(
								new Coworker("Steve Jobs", "Employee #0", "he likes electronics\nand he also plays pranks"),
								new Coworker("Andy Hertzfeld", "Mr.",	"Mr. nice guy")
						),
						new Project(
								"Apple I",
								"Design the hardware", "Design the software", "Implement the software"),
						new Project(
								"Apple II",
								"Design everything", "Implement everything")),
				new Job(
						"Hewlett-Packard",
						"hp.png",
						Collections.singletonList(
								new Coworker("Lots of people", "Employees", "Finding their place in the world")
						),
						new Project(
								"Mainframe development",
								"R&D", "Bureaucracy")
				));
		Person kay = new Person(
				"Alan Kay",
				new Job(
						"Walt Disney Imagineering",
						"disney.jpg",
						Collections.singletonList(
								new Coworker("Mickey mouse", "Founder", "Will never enter public domain")
						),
						new Project(
								"Disney Fellow",
								"Mentor", "Teach")),
				new Job(
						"Xerox PARC",
						"parc.png",
						Arrays.asList(
								new Coworker("Douglas Engelbart", "Internet pioneer", "excellent interaction with computer"),
								new Coworker("Charles Thacker", "Designer",	"very good understanding of mouse")
						),
						new Project(
								"Dynabook concept",
								"Research", "Development")
				));

		FileOutputStream fos = new FileOutputStream(tmp);
		IDocumentFactory factory = Configuration.builder().include(new LoadImage()).build();
		ITemplateDocument tpl = factory.open(templateStream, "docx", fos);
		tpl.process(Arrays.asList(woz, kay));
		tpl.flush();
		fos.close();
		java.awt.Desktop.getDesktop().open(tmp);
	}
}
