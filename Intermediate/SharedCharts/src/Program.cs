using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using NGS.Templater;

namespace SharedCharts
{
	public class Program
	{
		public struct LanguageUsage
		{
			public string language;
			public decimal web;
			public decimal desktop;
			public decimal mobile;
			public LanguageUsage(string language, decimal web, decimal desktop, decimal mobile)
			{
				this.language = language;
				this.web = web;
				this.desktop = desktop;
				this.mobile = mobile;
			}
			public decimal total { get { return web + desktop + mobile; } }
		}

		public class TableData
		{
			public readonly string A;
			public readonly string B;
			public readonly string C;
			public TableData(int i)
			{
				this.A = "A - " + i;
				this.B = "B - " + i;
				this.C = "C - " + i;
			}
		}

		public static void Main(string[] args)
		{
			File.Copy("template/charts.pptx", "charts.pptx", true);
			var usage = new List<LanguageUsage>();
			usage.Add(new LanguageUsage("C#", 81.3m, 92.22m, 52.62m));
			usage.Add(new LanguageUsage("Java", 87.43m, 69.44m, 89.91m));
			usage.Add(new LanguageUsage("C++", 15.6m, 32.6m, 27.04m));
			usage.Add(new LanguageUsage("Python", 40.22m, 33.36m, 20.41m));
			usage.Add(new LanguageUsage("Javascript", 92.54m, 42.67m, 38.78m));
			var tableData = new List<TableData>();
			for (int i = 1; i <= 15; i++)
				tableData.Add(new TableData(i));
			var factory = Configuration.Builder.NavigateSeparator(':', null).Include(SplitRows).Build();
			using (var doc = factory.Open("charts.pptx"))
			{
				doc.Process(new
				{
					title = "Languages",
					subtitle = "Usage analysis",
					data = usage,
					dr = new
					{
						kind = new[] { new[] { "Web", "Desktop", "Mobile" } }, //2 dimensional array to trigger DR
						data = usage.Select(it => new object[] { it.language, it.web, it.desktop, it.mobile }).ToArray()
					},
					table = tableData
				});
			}
			Process.Start(new ProcessStartInfo("charts.pptx") { UseShellExecute = true });
		}

		static object SplitRows(object parent, object value, string member, string metadata)
		{
			var list = value as List<TableData>;
			//check if plugin is applicable
			if (list == null || !metadata.StartsWith("split(")) return value;
			var limit = int.Parse(metadata.Substring(6, metadata.Length - 7));
			var result = new List<object>();
			var size = list.Count / limit;
			for (int i = 0; i <= size; i++)
				result.Add(new { index = i, value = list.GetRange(i * limit, Math.Min(limit, list.Count - i * limit)) });
			return result;
		}
	}
}
