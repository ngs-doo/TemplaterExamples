using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using NGS.Templater;

namespace ListsAndTables
{
	public class Program
	{
		class Person
		{
			public string Name;
			public Job[] Jobs;
		}
		public class Job
		{
			public string CompanyName;
			public Project[] Projects;
			public string CompanyLogo;
			public Coworker[] Coworkers;
		}
		public class Project
		{
			public string Name;
			public Task[] Tasks;
		}
		public class Task
		{
			public string Description;
		}
		public class Coworker
		{
			public string Name;
			public string Title;
			public string Impression;
		}
		static object LoadImage(object argument, string metadata)
		{
			if (metadata == "load-image" && argument is string)
				return Image.FromFile(argument.ToString());
			return argument;
		}
		public static void Main(string[] args)
		{
			File.Copy("Nesting.docx", "listsAndTables.docx", true);
			var woz = new Person
			{
				Name = "Steve Wozniak",
				Jobs = new[] 
				{
					new Job 
					{ 
						CompanyName = "Apple",
						CompanyLogo = "apple.jpg",
						Projects = new []
						{
							new Project
							{
								Name = "Apple I",
								Tasks = new []
								{
									new Task{ Description = "Design the hardware"},
									new Task{ Description = "Design the software"},
									new Task{ Description = "Implement the software"}
								}
							},
							new Project
							{
								Name = "Apple II",
								Tasks = new []
								{
									new Task{ Description = "Design everything"},
									new Task{ Description = "Implement everything"}
								}
							}
						},
						Coworkers = new []
						{
							new Coworker { Name = "Steve Jobs", Title = "Employee #0", Impression = "he likes electronics\nand he also plays pranks" },
							new Coworker { Name = "Andy Hertzfeld", Title = "Mr.",	Impression = "Mr. nice guy" }
						}
					},
					new Job 
					{ 
						CompanyName = "Hewlett-Packard",
						CompanyLogo = "hp.png",
						Projects = new []
						{
							new Project
							{
								Name = "Mainframe development",
								Tasks = new []
								{
									new Task{ Description = "R&D"},
									new Task{ Description = "Bureaucracy"}
								}
							}
						},
						Coworkers = new []
						{
							new Coworker { Name = "Lots of people", Title = "Employees", Impression = "Finding their place in the world" }
						}
					}
				}
			};
			var kay = new Person
			{
				Name = "Alan Kay",
				Jobs = new[] 
				{
					new Job 
					{ 
						CompanyName = "Walt Disney Imagineering",
						CompanyLogo = "disney.jpg",
						Projects = new []
						{
							new Project
							{
								Name = "Disney Fellow",
								Tasks = new []
								{
									new Task{ Description = "Mentor"},
									new Task{ Description = "Teach"}
								}
							}
						},
						Coworkers = new []
						{
							new Coworker { Name = "Mickey mouse", Title = "Founder", Impression = "Will never enter public domain" }
						}
					},
					new Job 
					{ 
						CompanyName = "Xerox PARC",
						CompanyLogo = "parc.png",
						Projects = new []
						{
							new Project
							{
								Name = "Smalltalk",
								Tasks = new []
								{
									new Task{ Description = "R&D"},
									new Task{ Description = "Documentation"}
								}
							},
							new Project
							{
								Name = "Dynabook concept",
								Tasks = new []
								{
									new Task{ Description = "Research"},
									new Task{ Description = "Development"}
								}
							}
						},
						Coworkers = new []
						{
							new Coworker { Name = "Douglas Engelbart", Title = "Internet pioneer", Impression = "excellent interaction with computer" },
							new Coworker { Name = "Charles Thacker", Title = "Designer", Impression = "very good understanding of mouse" }
						}
					}
				}
			};
			var people = new List<Person>(new[] { woz, kay });
			var factory = Configuration.Builder.Include(LoadImage).Build();
			using (var doc = factory.Open("listsAndTables.docx"))
			{
				doc.Process(people);
			}
			Process.Start("listsAndTables.docx");
		}
	}
}
