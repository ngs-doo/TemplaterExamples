using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Xml.Linq;
using NGS.Templater;

namespace WordLinks
{
	public class Program
	{
		private static object StringToUrl(object value, string metadata)
		{
			if (metadata == "url") return new Uri("http://" + value);
			return value;
		}

		private static object ToHyperlink(object value, string metadata)
		{
			if (metadata == "hyperlink" && value is IDictionary<string, object>)
			{
				var dict = (IDictionary<string, object>)value;
				var text = dict["text"];
				var url = dict["url"];
				return XElement.Parse(@"
<w:p xmlns:w=""http://schemas.openxmlformats.org/wordprocessingml/2006/main"">
	<w:fldSimple w:instr="" HYPERLINK " + url + @" "">
		<w:r>
			<w:rPr><w:rStyle w:val=""Hyperlink""/></w:rPr>
			<w:t>" + text + @"</w:t>
		</w:r>
	</w:fldSimple>
</w:p>");
			}
			return value;
		}

		public static void Main(string[] args)
		{
			var favorites = new List<Dictionary<string, object>>();
			favorites.Add(Create("Egyptian pyramids", "2630 BC", "BBC", new Uri("http://www.bbc.co.uk/history/ancient/egyptians/"), "Pyramids", "pyramids@egypt.com", "Pyramids"));
			favorites.Add(Create("The Viking at Stamford Bridge", new DateTime(1066, 11, 25), "Badass of the week", "http://www.badassoftheweek.com/stamfordbridge.html", "Badass", "vikings@league.com", "Viking"));
			favorites.Add(Create("World war I", new DateTime(1914, 6, 28), "Wikipedia", new Uri("http://en.wikipedia.org/wiki/World_War_I"), "Historians", "history@world.com", "WW I"));
			favorites.Add(Create("World war II", new DateTime(1939, 9, 1), "Wikipedia", new Uri("https://en.wikipedia.org/wiki/World_War_II"), "Historians", "history@world.com", "WW II"));
			favorites.Add(Create("Printing press", "1440", "Britannica", "https://www.britannica.com/biography/Johannes-Gutenberg", "Biographies", "enquiries@britannica.co.uk", "Gutenberg"));
			favorites.Add(Create("The Industrial Revolution", "1780", "History", "https://www.history.com/topics/industrial-revolution/industrial-revolution", "Industrial Revolution", "revolution@history.com", "IR"));
			favorites.Add(Create("Apollo 11", new DateTime(1961, 5, 25), "NASA", "https://www.nasa.gov/mission_pages/apollo/missions/apollo11.html", "Contact NASA", "unknown@unknown.com", "Apollo 13"));
			favorites.Add(Create("ARPANET", "1969", "DARPA", new Uri("https://www.darpa.mil/about-us/timeline/arpanet"), "Media", "outreach@darpa.mil", "ARPANET"));

			File.Copy("template/Links.docx", "ExternalLinks.docx", true);
			using (var doc = Configuration.Builder.Include(StringToUrl).Include(ToHyperlink).Build().Open("ExternalLinks.docx"))
			{
				doc.Process(favorites);
				doc.Process(new
				{
					urlType = new Uri("https://templater.info"),
					urlString = "templater.info",
					hyperlink = new Dictionary<string, object> { { "text", "text for link" }, { "url", "https://templater.info/demo" } }
				});
			}
			Process.Start(new ProcessStartInfo("ExternalLinks.docx") { UseShellExecute = true });
		}

		private static Dictionary<string, object> Create(string @event, object date, string title, object url, string name, string email, string subject)
		{
			return new Dictionary<string, object> { 
				{"event", @event},
				{"date", date },
				{"link_name", title },
				{"link_url", url },
				{"email_name", name },
				{"email_address", email },
				{"email_subject", subject },
			};
		}
	}
}
