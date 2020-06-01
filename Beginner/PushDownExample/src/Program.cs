using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using NGS.Templater;

namespace PushDownExample
{
	public class Program
	{
		class DailyMenu
		{
			public string name;
			public string bonus;
			public string cost;
		}
		class SpecialMenu
		{
			public string name;
			public string cost;
			public DateTime date;
		}
		class Menu
		{
			public List<SpecialMenu> specialMenu;
			public List<DailyMenu> dailyMenu;
			public string name;
		}
		public static void Main(string[] args)
		{
			File.Copy("template/MyTable.xlsx", "MyTable.xlsx", true);

			var specialMenu = new List<SpecialMenu>();
			specialMenu.Add(new SpecialMenu { name = "Jelacic steak", cost = "80 EUR", date = DateTime.Parse("16/05/2012") });
			specialMenu.Add(new SpecialMenu { name = "Sea surprise", cost = "120 EUR", date = DateTime.Parse("18/05/2012") });

			var dailyMenu = new List<DailyMenu>();
			dailyMenu.Add(new DailyMenu { name = "Chickago pizza", bonus = "Olives", cost = "38 EUR" });
			dailyMenu.Add(new DailyMenu { name = "Cordon bleu", bonus = "French fries", cost = "45 EUR" });
			dailyMenu.Add(new DailyMenu { name = "Beefsteak", bonus = "Salad, french fries", cost = "65 EUR" });

			var menu = new Menu { name = "Bon voyage", specialMenu = specialMenu, dailyMenu = dailyMenu };

			using (var doc = Configuration.Factory.Open("MyTable.xlsx"))
				doc.Process(menu);
			Process.Start(new ProcessStartInfo("MyTable.xlsx") { UseShellExecute = true });
		}
	}
}
