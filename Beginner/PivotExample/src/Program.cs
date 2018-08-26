using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using NGS.Templater;

namespace PivotExample
{
	public class Program
	{
		public static void Main(string[] args)
		{
			File.Copy("template/Pivot.xlsx", "Pivot.xlsx", true);

			var data = new List<Dictionary<string, object>>();
			data.Add(CreateItem("Tokyo", "Japan", 35.83, 1479));
			data.Add(CreateItem("New York", "USA", 19.18, 1406));
			data.Add(CreateItem("Los Angeles", "USA", 218.85, 792));
			data.Add(CreateItem("Chicago", "USA", 425.6, 574));
			data.Add(CreateItem("London", "England", 217.63, 565));
			data.Add(CreateItem("Paris", "France", 338.48, 564));
			data.Add(CreateItem("Osaka/Kobe", "Japan", 116.28, 417));
			data.Add(CreateItem("Mexico City", "Mexico", 19.18, 390));
			data.Add(CreateItem("Philadelphia", "USA", 198.45, 388));
			data.Add(CreateItem("Sao Paulo", "Brasil", 426.32, 388));
			data.Add(CreateItem("Washington DC", "USA", 139.71, 375));
			data.Add(CreateItem("Boston", "USA", 187.19, 363));
			data.Add(CreateItem("Buenos Aires", "Argentina", 332.08, 362));
			data.Add(CreateItem("Dallas/Fort Worth", "USA", 315.03, 338));
			data.Add(CreateItem("Moscow", "Russia", 174.41, 321));
			data.Add(CreateItem("Hong Kong", "China", 469.35, 320));
			data.Add(CreateItem("Atlanta", "USA", 212.76, 304));
			data.Add(CreateItem("San Francisco/Oakland", "USA", 175.93, 301));
			data.Add(CreateItem("Houston", "USA", 190.85, 297));
			data.Add(CreateItem("Miami", "USA", 238.63, 292));
			data.Add(CreateItem("Seoul", "South Korea", 287.34, 291));
			data.Add(CreateItem("Toronto", "USA", 472.39, 253));
			data.Add(CreateItem("Detroit", "USA", 413.65, 253));
			data.Add(CreateItem("Seattle", "USA", 426.77, 235));
			data.Add(CreateItem("Shanghai", "China", 15.24, 233));
			data.Add(CreateItem("Madrid", "Spain", 234.98, 230));
			data.Add(CreateItem("Singapore", "Malaysia", 179.89, 215));
			data.Add(CreateItem("Sydney", "Australia", 132.41, 213));
			data.Add(CreateItem("Mumbai (Bombay)", "India", 19.35, 209));
			data.Add(CreateItem("Rio de Janeiro", "Brasil", 328.13, 201));

			using (var doc = Configuration.Factory.Open("Pivot.xlsx"))
				doc.Process(data);
			Process.Start("Pivot.xlsx");
		}

		private static Dictionary<string, object> CreateItem(string town, string country, double population, int gdp)
		{
			var result = new Dictionary<string, object>();
			result["town"] = town;
			result["country"] = country;
			result["population"] = population;
			result["gdp"] = gdp;
			return result;
		}
	}
}
