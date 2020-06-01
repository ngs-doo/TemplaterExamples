using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using NGS.Templater;

namespace Formulas
{
	public class Program
	{
		class Total
		{
			public string name;
			public int person;
		}

		public static void Main(string[] args)
		{
			File.Copy("template/Formulas.xlsx", "Formulas.xlsx", true);

			var groups = new List<Group>();
			for (int i = 0; i < 5; i++)
				groups.Add(new Group(i + 1));
			var totals = new List<Total>();
			for (int i = 0; i < 3; i++)
			{
				Total t = new Total();
				t.name = "total " + i;
				t.person = 2000 + i * i;
				totals.Add(t);
			}
			var map = new Dictionary<string, object>();
			map["groups"] = groups;
			map["total"] = totals;
			map["num"] = new[] {
				new { a = 1},
				new { a = 2},
				new { a = 3}
			};
			map["hide_sheet"] = null;

			using (var doc = Configuration.Factory.Open("Formulas.xlsx"))
				doc.Process(map);
			Process.Start(new ProcessStartInfo("Formulas.xlsx") { UseShellExecute = true });
		}
	}
}
