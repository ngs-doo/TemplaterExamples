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
			File.Copy("template/Links.docx", "ExternalLinks.docx", true);
			using (var doc = Configuration.Builder.Include(StringToUrl).Include(ToHyperlink).Build().Open("ExternalLinks.docx"))
			{
				doc.Process(favorites);
				doc.Process(new
				{
					urlType = new Uri("http://templater.info"),
					urlString = "templater.info",
					hyperlink = new Dictionary<string, object> { { "text", "text for link" }, { "url", "http://templater.info/demo" } }
				});
			}
			Process.Start("ExternalLinks.docx");
		}
	}
}
