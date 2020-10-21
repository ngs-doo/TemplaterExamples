using System.Collections;
using System.Diagnostics;
using System.IO;
using System.Linq;
using NGS.Templater;

namespace DepartmentReport
{
	public class Program
	{
		class Company
		{
			public string name;
			public Department[] department;
			public IEnumerable summary
			{
				get
				{
					return
						from d in department
						from t in d.team
						from p in t.project
						from e in p.epic
						from i in e.task
						select new { department = d.name, team = t.name, project = p.name, epic = e.name, task = i.id, days = i.spent };
				}
			}
		}
		class Department
		{
			public string name;
			public string code;
			public string head;
			public Team[] team;
		}
		class Team
		{
			public string name;
			public string lead;
			public Project[] project;
		}
		class Project
		{
			public string name;
			public Epic[] epic;
		}
		class Epic
		{
			public string name;
			public Task[] task;
		}
		public class Task
		{
			public string id;
			public decimal estimated;
			public decimal spent;
			public Task(string id, decimal estimated, decimal spent)
			{
				this.id = id;
				this.estimated = estimated;
				this.spent = spent;
			}
		}

		public static void Main(string[] args)
		{
			using (var fis = File.OpenRead("template/departments.xlsx"))
			using (var fos = File.OpenWrite("departments.xlsx"))
			using (var doc = Configuration
				.Builder
				.NavigateSeparator(':')
				.Include(SortExpression)
				.Build()
				.Open(fis, fos, "xlsx"))
				doc.Process(GetCompany());

			Process.Start(new ProcessStartInfo("departments.xlsx") { UseShellExecute = true });
		}

		static object SortExpression(object parent, object value, string member, string metadata)
		{
			var col = value as ICollection;
			if (!metadata.StartsWith("sort(") || col == null || col.Count < 2) return value;
			var property = metadata.Substring(5, metadata.Length - 6);
			var f = col.OfType<object>().First().GetType().GetField(property);
			return col.OfType<object>().OrderBy(it => f.GetValue(it)).ToList();
		}

		private static Company GetCompany()
		{
			var company = new Company
			{
				name = "Sweat shop ltd.",
				department = new[] { 
					new Department { name = "Development", code = "DEV", head = "Michael", team = new []{
						new Team { lead = "John", name = "React", project = new []{
							new Project { name = "Soda shop", epic = new [] {
								new Epic { name = "Rewrite", task = new [] {
									new Task("BR-343", 2, 0.5m), new Task("BR-346", 7, 3.5m), new Task("BR-349", 12, 15), new Task("BR-423", 1, 0.5m),
									new Task("BR-443", 20, 35), new Task("BR-466", 70, 120), new Task("BR-481", 6, 0), new Task("BR-482", 10, 60),
								}},
								new Epic { name = "New product search", task = new [] {
									new Task("BR-245", 6, 6), new Task("BR-301", 10, 12), new Task("BR-302", 2, 1), new Task("BR-305", 5, 4)
								}},
							}}
						}},
						new Team { lead = "Mary", name = "Java", project = new []{
							new Project { name = "McShop", epic = new [] {
								new Epic { name = "Analysis", task = new [] {
									new Task("BR-543", 4, 4.5m), new Task("BR-546", 4, 4m), new Task("BR-549", 2, 2), new Task("BR-623", 1, 1),
									new Task("BR-644", 10, 8), new Task("BR-666", 20, 15), new Task("BR-681", 60, 80), new Task("BR-682", 100, 300),
								}},
								new Epic { name = "Reports", task = new [] {
									new Task("BR-745", 25, 30), new Task("BR-702", 100, 20), new Task("BR-705", 20, 10)
								}},
								new Epic { name = "Performance", task = new [] {
									new Task("BR-746", 200, 300), new Task("BR-762", 100, 20)
								}},
							}},
							new Project { name = "DoD", epic = new [] {
								new Epic { name = "GUI", task = new [] {
									new Task("DOD-003", 40, 4.5m), new Task("DOD-007", 50, 60)
								}},
								new Epic { name = "Encryption", task = new [] {
									new Task("DOD-022", 25, 30)
								}},
								new Epic { name = "Mining", task = new [] {
									new Task("DOD-033", 100, 110), new Task("DOD-034", 100, 80)
								}},
							}},
						}},
					}},
					new Department { name = "Sales", code = "SALE", head = "Eric", team = new []{
						new Team { lead = "Marc", name = "Philippines", project = new []{
							new Project { name = "New leads", epic = new [] {
								new Epic { name = "Initial contact", task = new [] {
									new Task("SL-231", 6, 4), new Task("SL-232", 3, 6), new Task("SL-233", 8, 10), 
									new Task("SL-234", 1, 1), new Task("SL-236", 2, 1.5m), new Task("SL-300", 4, 4)
								}},
								new Epic { name = "Demo", task = new [] {
									new Task("SL-126", 1, 1), new Task("SL-222", 2, 4)
								}},
							}}
						}},
						new Team { lead = "Naomi", name = "Government", project = new []{
							new Project { name = "Bitcoin", epic = new [] {
								new Epic { name = "Bitcoin", task = new [] {
									new Task("GV-003", 5, 10), new Task("GV-006", 10, 20), new Task("GV-010", 10, 50)
								}},
							}},
							new Project { name = "Etherum", epic = new [] {
								new Epic { name = "Etherum", task = new [] {
									new Task("GV-101", 20, 10)
								}},
							}},
						}},
					}},
					new Department { name = "Quality assurance", code = "QA", head = "Mickey", team = new []{
						new Team { lead = "Mickey", name = "QA", project = new []{
							new Project { name = "Releases", epic = new [] {
								new Epic { name = "v2.9.2", task = new [] {
									new Task("QA-113", 0.5m, 0.5m), new Task("QA-114", 1, 1.5m), new Task("QA-115", 0.5m, 1), 
									new Task("QA-116", 2, 1), new Task("QA-117", 2, 1.5m), new Task("QA-118", 2, 2),
									new Task("QA-119", 1, 3), new Task("QA-120", 3, 1), new Task("QA-121", 4, 2), 
									new Task("QA-122", 1, 1), new Task("QA-123", 2, 1.5m), new Task("QA-124", 5, 7)
								}},
								new Epic { name = "v2.9.3", task = new [] {
									new Task("QA-211", 10, 5), new Task("QA-222", 20, 50)
								}},
							}},
							new Project { name = "Hotfixes", epic = new [] {
								new Epic { name = "Bugs", task = new [] {
									new Task("QA-131", 2, 2), new Task("QA-132", 0.5m, 1), new Task("QA-133", 0.5m, 0.25m), 
									new Task("QA-134", 1, 1), new Task("QA-135", 2, 2), new Task("QA-136", 0.5m, 1), 
									new Task("QA-137", 1, 0.5m), new Task("QA-139", 3, 1), new Task("QA-140", 2, 3)
								}},
							}},
						}},
					}}
				}
			};
			return company;
		}
	}
}
