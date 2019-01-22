using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.IO;
using System.Linq;
using NGS.Templater;

namespace WordDataTable
{
	public class Program
	{
		static object Top10Rows(object argument, string metadata)
		{
			//if we find exact metadata and type invoke the plugin
			if (metadata == "top10" && argument is DataTable)
			{
				var dt = argument as DataTable;
				var newDt = dt.Clone();
				var max = Math.Min(10, dt.Rows.Count);
				for (int i = 0; i < max; i++)
					newDt.ImportRow(dt.Rows[i]);
				return newDt;
			}
			return argument;
		}

		static bool Limit10Table(string prefix, ITemplater templater, DataTable table)
		{
			if (table.Rows.Count > 10)
			{
				//simplified way to match columns against tags
				var tags = table.Columns.Cast<DataColumn>().Select(it => prefix + it.ColumnName).ToList();
				//if any of the found tags matches limit10 condition
				if (tags.Any(t => templater.GetMetadata(t, true).Contains("limit10")))
				{
					templater.Resize(tags, 10);
					for (int i = 0; i < 10; i++)
					{
						DataRow r = table.Rows[i];
						foreach (DataColumn c in table.Columns)
							templater.Replace(prefix + c.ColumnName, r[c]);
					}
					return true;
				}
			}
			return false;
		}

		static bool CollapseNonEmpty(object value, string metadata, string property, ITemplater templater)
		{
			if (metadata == "collapseNonEmpty" || metadata == "collapseEmpty")
			{
				var dt = value as DataTable;
				if (dt == null) return false;
				var isEmpty = dt.Rows.Count == 0;
				//loop until all tags with the same name are processed
				do
				{
					var md = templater.GetMetadata(property, false);
					var collapseOnEmpty = md.Contains("collapseEmpty");
					var collapseNonEmpty = md.Contains("collapseNonEmpty");
					if (isEmpty)
					{
						if (collapseOnEmpty)
							templater.Resize(property, 0);
						else
							templater.Replace(property, "");
					}
					else
					{
						if (collapseNonEmpty)
							templater.Resize(property, 0);
						else
							templater.Replace(property, "");
					}
				} while (templater.Tags.Contains(property));
				return true;
			}
			return false;
		}

		public static void Main(string[] args)
		{
			File.Copy("template/Tables.docx", "WordTables.docx", true);
			var dt = new DataTable();
			dt.Columns.Add("Col1");
			dt.Columns.Add("Col2");
			dt.Columns.Add("Col3");
			for (int i = 0; i < 100; i++)
				dt.Rows.Add("a" + i, "b" + i, "c" + i);
			var dt4 = new DataTable();
			dt4.Columns.Add("Name");
			dt4.Columns.Add("Description");
			//for (int i = 0; i < 10; i++)
			//dt4.Rows.Add("Name" + i, "Description" + i);
			var factory =
				Configuration.Builder
				.Include(Top10Rows)
				.Include<DataTable>(Limit10Table)
				.Include(CollapseNonEmpty)
				.Build();
			var dynamicResize1 = new object[7, 3]{
				{"a", "b", "c"},
				{"a", null, "c"},
				{"a", "b", null},
				{null, "b", "c"},
				{"a", null, null},
				{null, null, null},
				{"a", "b", "c"},
			};
			var dynamicResize2 = new object[7, 3]{
				{"a", "b", "c"},
				{null, null, "c"},
				{null, null, null},
				{null, "b", "c"},
				{"a", null, null},
				{null, "b", null},
				{"a", "b", null},
			};
			var map = new Dictionary<string, object>[] {
				new Dictionary<string, object>{{"1", "a"}, {"2","b"},{"3","c"}},
				new Dictionary<string, object>{{"1", "a"}, {"2",null},{"3","c"}},
				new Dictionary<string, object>{{"1", "a"}, {"2","b"},{"3",null}},
				new Dictionary<string, object>{{"1", null}, {"2","b"},{"3","c"}},
				new Dictionary<string, object>{{"1", "a"}, {"2",null},{"3",null}},
				new Dictionary<string, object>{{"1", null}, {"2",null},{"3",null}},
				new Dictionary<string, object>{{"1", "a"}, {"2","b"},{"3","c"}},
			};
			var combined = new Combined
			{
				Beers = new[] 
				{ 
					new Beer { Name = "Heineken", Description = "Green and cold", Columns = new [,] { {"Light", "International"} }},
					new Beer { Name = "Leila", Description = "Blueish", Columns = new [,] { {"Blue", "Domestic"} }}
				},
				Headers = new[,] { { "Bottle", "Where" } }
			};
			var fixedItems = new Fixed[] {
				new Fixed{ Name = "A", Quantity = 1, Price = 42 },
				new Fixed{ Name = "B", Quantity = 2, Price = 23 },
				new Fixed{ Name = "C", Quantity = 3, Price = 505 },
				new Fixed{ Name = "D", Quantity = 4, Price = 99 },
				new Fixed{ Name = "E", Quantity = 5, Price = 199 },
				new Fixed{ Name = "F", Quantity = 6, Price = 0 },
				new Fixed{ Name = "G", Quantity = 7, Price = 7 }
			};
			using (var doc = factory.Open("WordTables.docx"))
			{
				doc.Process(
					new
					{
						Table1 = dt,
						Table2 = dt,
						DynamicResize = dynamicResize1,
						DynamicResizeAndMerge = dynamicResize2,
						Nulls = map,
						Table4 = dt4,
						Combined = combined,
						Fixed = fixedItems
					});
			}
			Process.Start("WordTables.docx");
		}

		class Combined
		{
			public Beer[] Beers;
			public string[,] Headers;
		}
		class Beer
		{
			public string Name;
			public string Description;
			public string[,] Columns;
		}
		class Fixed
		{
			public string Name;
			public int Quantity;
			public decimal Price;
		}
	}
}
