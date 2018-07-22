using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using NGS.Templater;

namespace ExcelLinks
{
	public class Program
	{
		private static Dictionary<string, object> Create(string @event, string date, string link, string address)
		{
			return new Dictionary<string, object>
			{
				{"event", @event},
				{"date", date},
				{"link_name", link},
				{"link_url", address}
			};
		}

		public static void Main(string[] args)
		{
			File.Copy("template/Links.xlsx", "Links.xlsx", true);

			var favories = new List<Dictionary<string, object>>();
			favories.Add(Create("Egyptian pyramids", "2630 BC", "BBC", "http://www.bbc.co.uk/history/ancient/egyptians/"));
			favories.Add(Create("The Viking at Stamford Bridge", "1066-11-25", "Badass of the week", "http://www.badassoftheweek.com/stamfordbridge.html"));
			favories.Add(Create("World war I", "1914-6-28", "Wikipedia", "http://en.wikipedia.org/wiki/World_War_I"));

			using (var doc = Configuration.Factory.Open("Links.xlsx"))
				doc.Process(favories);
			Process.Start("Links.xlsx");
		}
	}
}
