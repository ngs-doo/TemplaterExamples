using System;
using System.Collections;
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Web.Script.Services;
using System.Web.Services;
using FoodOrder.Model;
using NGS.Templater;

namespace FoodOrder.Web
{
	[ScriptService]
	[ToolboxItem(false)]
	[WebService(Namespace = "http://templater.info/")]
	[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
	public class MainService : WebService
	{
		private static WeeklyMenu[] WeeklyMenus;
		private static IDocumentFactory DocumentFactory = Configuration.Configure("unknown customer", "trial license");

		public MainService()
		{
			if (WeeklyMenus == null)
				InitializeApp();
		}

		private static void InitializeApp()
		{
			var menus = LoadDataAndRandomize("Menus", 15);
			var len = Enum.GetValues(typeof(ChoiceEnum)).Length;
			WeeklyMenus = new WeeklyMenu[len];
			for (int i = 0; i < len; i++)
			{
				var wm = WeeklyMenus[i] = new WeeklyMenu();
				wm.MenuMark = (ChoiceEnum)i;
				wm.MondayMenu = menus[5 * i];
				wm.TuesdayMenu = menus[5 * i + 1];
				wm.WednesdayMenu = menus[5 * i + 2];
				wm.ThursdayMenu = menus[5 * i + 3];
				wm.FridayMenu = menus[5 * i + 4];
			}
			if (!Directory.Exists(GetPath("Documents")))
				Directory.CreateDirectory(GetPath("Documents"));
			try
			{
				Directory.EnumerateFiles(GetPath("Documents")).ToList().ForEach(it => File.Delete(it));
			}
			catch { }
		}

		private static string GetPath(string name)
		{
			return Path.Combine(AppDomain.CurrentDomain.BaseDirectory, name);
		}

		[WebMethod]
		public string[] GetEmployees()
		{
			return LoadDataAndRandomize("Employees", 5);
		}

		[WebMethod]
		public WeeklyMenu[] GetMenus()
		{
			return WeeklyMenus;
		}

		private static string[] LoadDataAndRandomize(string file, int count)
		{
			var data = File.ReadLines(GetPath("App_Data\\" + file + ".txt"));
			var rnd = new Random();
			return data.OrderBy(_ => rnd.Next(0, 100)).Take(count).ToArray();
		}

		private static IEnumerable CalculateExcelSummaries(EmployeeMenu[] choices)
		{
			return
				(from ChoiceEnum option in Enum.GetValues(typeof(ChoiceEnum))
				 select new
				 {
					 SummaryMark = option,
					 MondaySummary = choices.Where(it => it.MondayChoice == option).Count(),
					 TuesdaySummary = choices.Where(it => it.TuesdayChoice == option).Count(),
					 WednesdaySummary = choices.Where(it => it.WednesdayChoice == option).Count(),
					 ThursdaySummary = choices.Where(it => it.ThursdayChoice == option).Count(),
					 FridaySummary = choices.Where(it => it.FridayChoice == option).Count()
				 }).ToList();
		}

		private static IEnumerable CalculateWordSummaries(EmployeeMenu[] choices)
		{
			var fromDay = GetFirstDayOfNextWeek(DateTime.Today);
			return
				(from cnt in Enumerable.Range(0, 5)
				 let day = fromDay.AddDays(cnt)
				 select new
				 {
					 Day = day.DayOfWeek,
					 Menu =
						from menu in WeeklyMenus
						select new
						{
							Name = menu.GetType().GetProperty(day.DayOfWeek + "Menu").GetValue(menu, null),
							TotalOrders =
								choices.Where(it => it.GetType().GetProperty(day.DayOfWeek + "Choice")
														.GetValue(it, null).Equals(menu.MenuMark))
								.Count()
						}
				 }).ToList();
		}

		[WebMethod]
		public string CreateExcelReport(string customer, EmployeeMenu[] choices)
		{
			Action<ITemplateDocument> processDocument =
				document =>
				{
					document.Process(WeeklyMenus);
					document.Process(choices);
					document.Process(CalculateExcelSummaries(choices));
				};
			return CreateReport(processDocument, customer, choices, ".xlsx");
		}

		[WebMethod]
		public string CreateWordReport(string customer, EmployeeMenu[] choices)
		{
			Action<ITemplateDocument> processDocument =
				document =>
				{
					document.Process(
						choices
						.Select(it => new
						{
							Employee = it.Employee,
							Choices = new[] { it.MondayChoice, it.TuesdayChoice, it.ThursdayChoice, it.WednesdayChoice, it.FridayChoice }
						}));
					document.Process(CalculateWordSummaries(choices));
				};
			return CreateReport(processDocument, customer, choices, ".docx");
		}

		[WebMethod]
		public string CreateCSVReport(string customer, EmployeeMenu[] choices)
		{
			Action<ITemplateDocument> processDocument =
				document => document.Process(CalculateExcelSummaries(choices));
			return CreateReport(processDocument, customer, choices, ".csv");
		}

		private static string CreateReport(
			Action<ITemplateDocument> customProcessing,
			string customer,
			EmployeeMenu[] choices,
			string ext)
		{
			var newFile = GetPath("Documents\\Order-" + Path.GetRandomFileName() + ext);
			File.Copy(GetPath("App_Data\\Order" + ext), newFile, true);

			using (var document = DocumentFactory.Open(newFile))
			{
				customProcessing(document);
				// The order of processing tags does not need to match their position in the template
				var nextMonday = GetFirstDayOfNextWeek(DateTime.Today);
				document.Process(
					new
					{
						CustomerName = customer,
						SubmissionDate = DateTime.Today,
						FirstDate = nextMonday,
						LastDate = nextMonday.AddDays(4)
					});
			}
			return newFile.Substring(AppDomain.CurrentDomain.BaseDirectory.Length);
		}

		private static DateTime GetFirstDayOfNextWeek(DateTime day)
		{
			do
			{
				day = day.AddDays(1);
			} while (day.DayOfWeek != DayOfWeek.Monday);
			return day;
		}
	}
}
