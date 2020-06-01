using System;
using System.Data;
using System.Diagnostics;
using System.IO;
using NGS.Templater;

namespace CsvExample
{
	public class Program
	{
		static object Quoter(object value, string metadata)
		{
			if (metadata == "quote" && value != DBNull.Value)
			{
				var str = value as string;
				var ind = str.IndexOf(';');
				if (ind != -1) return "\"" + str + "\"";
			}
			return value;
		}

		public static void Main(string[] args)
		{
			File.Copy("template/export.csv", "export.csv", true);
			var table = new DataTable();
			table.Columns.Add("ID", typeof(int));
			table.Columns.Add("AMOUNT", typeof(int));
			table.Columns.Add("DATE", typeof(DateTime));
			table.Columns.Add("CREATED_BY", typeof(string));
			table.Columns.Add("CREATED_ON", typeof(DateTime));
			table.Columns.Add("NOTE", typeof(string));
			table.Columns.Add("STATUS", typeof(string));
			table.Columns.Add("REFERENCE", typeof(string));
			table.Columns.Add("BRANCH", typeof(string));
			table.Columns.Add("VERIFIED_BY", typeof(string));
			table.Columns.Add("VERIFIED_ON", typeof(DateTime));
			table.Columns.Add("ROLLING_SUM", typeof(long));
			table.Columns.Add("NOT_USED", typeof(string));
			var users = new[] { null, "", "rick", "marty", "suzane", "eric", "mick", "admin" };
			var notes = new[] { null, null, "-", "...", "IMPORTANT", "REMINDER", "something to look into later", "special char;" };
			var stats = new[] { "", "APPROVED", "", "APPROVED", "", "APPROVED", "VERIFIED", "CANCELED" };
			var startDate = DateTime.Today.AddDays(-1000);
			var startTimestamp = DateTime.Now.AddDays(-1000);
			decimal total = 0;
			for (int i = 0; i < 100000; i++)
			{
				total += 2000 + i % 5000;
				table.Rows.Add(
					1000000 + i,
					2000 + i % 5000,
					startDate.AddDays(i / 1000),
					users[i % users.Length],
					startTimestamp.AddDays(i / 1000),
					notes[i % notes.Length],
					stats[i % stats.Length],
					"reference" + i,
					"branch" + i % 100,
					users[(i + 4) % users.Length],
					startTimestamp.AddDays(i / 1000),
					total,
					null
				);
			}
			using (var doc = Configuration.Builder.Include(Quoter).Build().Open("export.csv"))
				doc.Process(table);
			Process.Start(new ProcessStartInfo("export.csv") { UseShellExecute = true });
		}
	}
}
