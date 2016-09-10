using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using NGS.Templater;

namespace ExternalLinks
{
	public class Program
	{
		public static void Main(string[] args)
		{
			var favorites = new List<Dictionary<string, object>>();
			favorites.Add(new Dictionary<string, object> { 
				{"event","Egyptian pyramids"},
				{"date", "2630 BC" },
				{"link_name", "BBC" },
				{"link_url", new Uri("http://www.bbc.co.uk/history/ancient/egyptians/") },
				{"email_name", "Pyramids" },
				{"email_address", "pyramids@egypt.com" },
				{"email_subject", "Pyramids" },
			});
			favorites.Add(new Dictionary<string, object> { 
				{"event","The Viking at Stamford Bridge"},
				{"date", new DateTime(1066,11,25) },
				{"link_name", "Badass of the week" },
				{"link_url", "http://www.badassoftheweek.com/stamfordbridge.html" },
				{"email_name", "Badass" },
				{"email_address", "vikings@league.com" },
				{"email_subject", "Viking" },
			});
			favorites.Add(new Dictionary<string, object> { 
				{"event","World war I"},
				{"date", new DateTime(1914,6,28) },
				{"link_name", "Wikipedia" },
				{"link_url", "http://en.wikipedia.org/wiki/World_War_I" },
				{"email_name", "Historians" },
				{"email_address", "history@world.com" },
				{"email_subject", "WWI" },
			});
			File.Copy("Links.docx", "ExternalLinks.docx", true);
			using (var doc = Configuration.Factory.Open("ExternalLinks.docx"))
				doc.Process(favorites);
			Process.Start("ExternalLinks.docx");
		}
	}
}
