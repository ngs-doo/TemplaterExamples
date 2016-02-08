using System;
using System.Data;
using System.Diagnostics;
using System.IO;
using System.Linq;
using NGS.Templater;

namespace WordDataTable
{
	class Program
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

		static void Main(string[] args)
		{
			File.Copy("Tables.docx", "out.docx", true);
			var dt = new DataTable();
			dt.Columns.Add("Col1");
			dt.Columns.Add("Col2");
			dt.Columns.Add("Col3");
			for (int i = 0; i < 100; i++)
				dt.Rows.Add("a" + i, "b" + i, "c" + i);
			var factory = Configuration.Builder.Include(Top10Rows).Include<DataTable>(Limit10Table).Build();
			using (var doc = factory.Open("out.docx"))
			{
				doc.Process(new { Table1 = dt, Table2 = dt });
			}
			Process.Start("out.docx");
		}
	}
}
