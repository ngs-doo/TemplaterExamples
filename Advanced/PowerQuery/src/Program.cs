using System;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using NGS.Templater;

namespace PowerQuery
{
	public class Program
	{
		private static readonly IDocumentFactory Factory =
			Configuration.Builder
			.Include(ToIsoFormat)
			//Excel will complain about corrupted file unless Templater is initialized with a valid license
			.Build("Customer email", "Customer license");

		private static object ToIsoFormat(object value, string tag, string[] metadata)
		{
			//only apply iso format on CSV part of the processing
			if (!tag.StartsWith("csv.")) return value;
			if (value is DateTime)
			{
				var dt = (DateTime)value;
				return dt.Year + "-" + dt.Month + "-" + dt.Day;
			}
			else if (value is decimal)
			{
				var d = (decimal)value;
				return d.ToString(CultureInfo.InvariantCulture);
			}
			return value;
		}

		private static int GetIso8601WeekOfYear(DateTime time)
		{
			var day = CultureInfo.InvariantCulture.Calendar.GetDayOfWeek(time);
			if (day >= DayOfWeek.Monday && day <= DayOfWeek.Wednesday)
				time = time.AddDays(3);
			return CultureInfo.InvariantCulture.Calendar.GetWeekOfYear(time, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Monday);
		}

		private static CsvData[] GenerateData(int size)
		{
			var startDate = new DateTime(2015, 2, 3);
			var result = new CsvData[size];
			for (int i = 0; i < result.Length; i++)
			{
				CsvData csv = new CsvData();
				csv.date = startDate.AddDays(i / 10);
				String yearOf = csv.date.Year + "/";
				csv.week = yearOf + GetIso8601WeekOfYear(csv.date);
				csv.month = yearOf + csv.date.Month;
				csv.quarter = yearOf + (csv.date.Month / 4 + 1);
				csv.year = csv.date.Year;
				var isPaid = i % 7 != 0;
				csv.paymentDate = isPaid ? csv.date.AddDays(i % 100) : (DateTime?)null;
				csv.originalPrincipal = 1000 + 1000 * (i % 100) + 10 * (i / 100);
				csv.personID = "PER-" + (i % 100) + "-" + (i / 1000);
				csv.operatorID = "OP-" + (i % 10);
				csv.invoiceNumber = "INV-" + csv.year + "-" + (i + 1);
				csv.dueDate = csv.date.AddMonths(1);
				csv.invoiceDate = csv.date.AddDays(i % 3);
				csv.collectionDate = isPaid ? (i % 5 == 0 ? csv.date.AddDays(i % 13) : (DateTime?)null) : (DateTime?)null;
				csv.invoiceFee = i % 8 == 0 ? 0 : (i % 1000) / 100m;
				csv.interest = i % 6 == 0 ? 0 : (i % 1000) / 100m;
				csv.reminderFee = i % 5 == 0 ? 50 : 0;
				csv.currentAmount = csv.originalPrincipal + csv.interest + csv.reminderFee + csv.invoiceFee;
				result[i] = csv;
			}
			return result;
		}

		class CsvData
		{
			public DateTime date;
			public string week;
			public string month;
			public string quarter;
			public int year;
			public DateTime? paymentDate;
			public int originalPrincipal;
			public string personID;
			public string operatorID;
			public string invoiceNumber;
			public DateTime dueDate;
			public DateTime invoiceDate;
			public DateTime? collectionDate;
			public decimal invoiceFee;
			public decimal interest;
			public decimal reminderFee;
			public decimal currentAmount;
		}

		class InputData
		{
			public CsvData[] csv;
			public CsvData[] sheet;
		}

		public static void Main(string[] args)
		{
			var data = new InputData();
			data.csv = GenerateData(100000);
			data.sheet = GenerateData(25000);

			using (var fis = File.OpenRead("template/PowerQuery.xlsx"))
			using (var fos = File.OpenWrite("PowerQuery.xlsx"))
			using (var doc = Factory.Open(fis, fos, "xlsx"))
				doc.Process(data);

			Process.Start("PowerQuery.xlsx");
		}
	}
}
