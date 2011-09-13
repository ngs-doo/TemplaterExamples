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
	[WebService(Namespace = "http://templater.info/")]
	[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
	[ToolboxItem(false)]
	[ScriptService]
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

		private static IEnumerable CalculateSummaries(EmployeeMenu[] choices)
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

		[WebMethod]
		public string CreateReport(string customer, EmployeeMenu[] choices)
		{
			var newFile = GetPath("Documents\\Order-" + Path.GetRandomFileName() + ".xlsx");
			File.Copy(GetPath("App_Data\\Order.xlsx"), newFile, true);

			using (var document = DocumentFactory.Open(newFile))
			{
				document.Process(WeeklyMenus);
				document.Process(choices);
				document.Process(CalculateSummaries(choices));

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
