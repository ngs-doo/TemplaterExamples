using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using NGS.Templater;

namespace ChartExample
{
	class Program
	{
		static void Main(string[] args)
		{
			File.Copy("Charts.docx", "out.docx", true);
			var pie1 = new Dictionary<string, object>[3];
			pie1[0] = new Dictionary<string, object>() { { "name", "Top" }, { "value", 11.2m } };
			pie1[1] = new Dictionary<string, object>() { { "name", "Middle" }, { "value", 1.2m } };
			pie1[2] = new Dictionary<string, object>() { { "name", "Low" }, { "value", 22m } };
			var pie2 = new Dictionary<string, object>[2];
			pie2[0] = new Dictionary<string, object>() { { "name", "Top" }, { "value", 44.2m } };
			pie2[1] = new Dictionary<string, object>() { { "name", "Low" }, { "value", 12m } };
			var lines1 = new Dictionary<string, object>[4];
			lines1[0] = new Dictionary<string, object> { { "category", "good" }, { "ser1", 22 }, { "ser2", 55 }, { "ser3", 120 } };
			lines1[1] = new Dictionary<string, object> { { "category", "bad" }, { "ser1", 12 }, { "ser2", 155 }, { "ser3", 20 } };
			lines1[2] = new Dictionary<string, object> { { "category", "great" }, { "ser1", 2.5 }, { "ser2", 4.55 }, { "ser3", 2 } };
			lines1[3] = new Dictionary<string, object> { { "category", "awful" }, { "ser1", 44.5m }, { "ser2", 55.3m }, { "ser3", 1.20 } };
			var lines2 = new Dictionary<string, object>[2];
			lines2[0] = new Dictionary<string, object> { { "category", "nice" }, { "ser1", 122 }, { "ser2", 5 }, { "ser3", 20 } };
			lines2[1] = new Dictionary<string, object> { { "category", "cute" }, { "ser1", 212 }, { "ser2", 15 }, { "ser3", 2 } };

			using (var doc = Configuration.Factory.Open("out.docx"))
			{
				doc.Process(new[] {
					new{ tag = "first page", pie = pie1, lines = lines1 },
					new{ tag = "second page", pie = pie2, lines = lines2 }});
			}
			Process.Start("out.docx");
		}
	}
}
