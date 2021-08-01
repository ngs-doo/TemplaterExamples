using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Threading;
using Ionic.Zip;
using NGS.Templater;

namespace CsvStreaming
{
	public class Program
	{
		static object Quoter(object value, string tag, string[] metadata)
		{
			var str = value as string;
			if (str != null)
			{
				var ind1 = str.IndexOf(',');
				var ind2 = str.IndexOf('"');
				if (ind1 != -1 && ind2 == -1) return "\"" + str + "\"";
				if (ind2 != -1) return "\"" + str.Replace("\"", "\"\"") + "\"";
			}
			return value;
		}
		static object NumberAsDot(object value, string tag, string[] metadata)
		{
			if (value is decimal)
				return ((decimal)value).ToString(CultureInfo.InvariantCulture);
			return value;
		}

		struct StreamingRow
		{
			public int id;
			public decimal amount;
			public DateTime date;
			public string createdBy;
			public DateTime createdOn;
			public string note;
			public string status;
			public string reference;
			public string branch;
			public string verifiedBy;
			public DateTime verifiedOn;

			public StreamingRow(DataTableReader reader)
			{
				id = reader.GetInt32(0);
				amount = reader.GetDecimal(1);
				date = reader.GetDateTime(2);
				createdBy = reader.IsDBNull(3) ? null : reader.GetString(3);
				createdOn = reader.GetDateTime(4);
				note = reader.IsDBNull(5) ? null : reader.GetString(5);
				status = reader.GetString(6);
				reference = reader.GetString(7);
				branch = reader.GetString(8);
				verifiedBy = reader.IsDBNull(9) ? null : reader.GetString(9);
				verifiedOn = reader.GetDateTime(10);
			}
		}

		public static void Main(string[] args)
		{
			var table = new DataTable();
			table.Columns.Add("ID", typeof(int));
			table.Columns.Add("AMOUNT", typeof(decimal));
			table.Columns.Add("DATE", typeof(DateTime));
			table.Columns.Add("CREATED_BY", typeof(string));
			table.Columns.Add("CREATED_ON", typeof(DateTime));
			table.Columns.Add("NOTE", typeof(string));
			table.Columns.Add("STATUS", typeof(string));
			table.Columns.Add("REFERENCE", typeof(string));
			table.Columns.Add("BRANCH", typeof(string));
			table.Columns.Add("VERIFIED_BY", typeof(string));
			table.Columns.Add("VERIFIED_ON", typeof(DateTime));
			var users = new[] { null, "", "rick", "marty", "suzane", "eric", "mick", "admin" };
			var notes = new[] { null, null, "-", "...", "IMPORTANT", "REMINDER", "something to look \"into later", "special\" char," };
			var stats = new[] { "", "APPROVED", "", "APPROVED", "", "APPROVED", "VERIFIED", "CANCELED" };
			var startDate = DateTime.Today.AddDays(-1000);
			var startTimestamp = DateTime.Now.AddDays(-1000);
			//for simplicity reasons we will provide fixed number of rows
			for (int i = 0; i < 200000; i++)
			{
				table.Rows.Add(
					1000000 + i,
					(2000 + i % 5000) * 0.13m,
					startDate.AddDays(i / 1000),
					users[i % users.Length],
					startTimestamp.AddHours(i),
					notes[i % notes.Length],
					stats[i % stats.Length],
					"reference" + i,
					"branch" + i % 100,
					users[(i + 4) % users.Length],
					startTimestamp.AddMinutes(i)
				);
			}
			var reader = table.CreateDataReader();
			var config = Configuration.Builder.Include(Quoter);
			//if we are using a culture which has comma as decimal separator, change the output to dot
			//we could apply this always, but it adds a bit of overhead, so let's apply it conditionally
			if (Thread.CurrentThread.CurrentCulture.NumberFormat.NumberDecimalSeparator.Contains(","))
				config.Include(NumberAsDot);
			//for example purposes we will stream it a zip file
			using (var zip = new ZipOutputStream("output.zip"))
			{
				zip.PutNextEntry("output.csv");
				using (var doc = config.Build().Open(File.OpenRead("template/input.csv"), "csv", zip))
				{
					//streaming processing assumes we have only a single collection, which means we first need to process all other tags
					doc.Process(new { filter = new { date = "All", user = "All" } });
					//to do a streaming processing we need to process collection in chunks
					var chunk = new List<StreamingRow>(50000);
					var hasData = reader.Read();
					while (hasData)
					{
						//one way of doing streaming is first duplicating the template row (context)
						doc.Templater.Resize(doc.Templater.Tags, 2);
						//and then process that row with all known data
						//this way we will have additional row to process (or remove) later
						do
						{
							chunk.Add(new StreamingRow(reader));
							hasData = reader.Read();
						} while (chunk.Count < 50000 && hasData);
						doc.Process(new { data = chunk });
						chunk.Clear();
					}
					//remove remaining rows
					doc.Templater.Resize(doc.Templater.Tags, 0);
				}
			}
			Process.Start(new ProcessStartInfo("output.zip") { UseShellExecute = true });
		}
	}
}
