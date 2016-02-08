using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using NGS.Templater;

namespace SpreadsheetGrouping
{
	class Program
	{
		class Info
		{
			public string Name;
			public List<Item> Items;
			public int Total { get { return Items.Count; } }

			public class Item
			{
				public string Name;
				public int A;
				public int B;
				public int Total { get { return A + B; } }
			}
		}
		static void Main(string[] args)
		{
			var inputFile = "Grouping.xlsx";
			var outputFile = "Result.xlsx";

			var list = new List<Info>();
			for (int i = 1; i <= 5; i++)
			{
				var items = new List<Info.Item>();
				for (int j = 1; j <= i; j++)
					items.Add(new Info.Item { A = j * 2 + i * 3 + 2, B = j * 3 + i * 2 + 1, Name = "name " + i + " - " + j });
				list.Add(new Info { Items = items, Name = "Group " + i });
			}

			using (var input = new MemoryStream(File.ReadAllBytes(inputFile)))
			using (var output = new FileStream(outputFile, FileMode.Create))
			using (var document = Configuration.Factory.Open(input, output, "xlsx"))
			{
				document.Process(new { Simple = list, Range = list });
			}

			Process.Start(outputFile);
		}
	}
}



