using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using NGS.Templater;

namespace PresentationTables
{
	public class Program
	{
		public class TableRow
		{
			public string colA;
			public int colB;
			public decimal colC;
			public string colD;
		}
		public static void Main(string[] args)
		{
			File.Copy("template/tables.pptx", "tables.pptx", true);
			var table1 = new List<TableRow>();
			for (int i = 0; i < 6; i++)
				table1.Add(new TableRow { colA = "name " + i, colB = i * i * i + 505, colC = (1000 + i * i) / 100m, colD = "last column " + i });
			var table2 = new string[][] {
				new []{"Header 1", "Header2", "Header 3"},
				new []{"Row 1/1", "Row 1/2", "Row 1/3"},
				new []{"Second row 1", "Second row 2", "Second row 3"},
				new []{"Last row 1", "Last row 2", "Last row 3"},
			};
			using (var doc = Configuration.Factory.Open("tables.pptx"))
				doc.Process(new { title = "Tables", subtitle = "Working with", table1 = table1, table2 = table2 });
			Process.Start(new ProcessStartInfo("tables.pptx") { UseShellExecute = true });
		}
	}
}
