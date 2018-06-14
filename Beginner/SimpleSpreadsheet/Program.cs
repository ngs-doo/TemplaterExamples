using System;
using System.Diagnostics;
using System.IO;
using NGS.Templater;

namespace SimpleSpreadsheet
{
	public class Program
	{
		public static void Main(string[] args)
		{
			File.Copy("MySpreadsheet.xlsx", "out.xlsx", true);

			var data = new
			{
				Name = "Marry",
				BirthDay = new DateTime(2005, 10, 10),
				Today = DateTime.Today
			};

			using (var document = Configuration.Factory.Open("out.xlsx"))
			{
				document.Process(data);
			}

			Process.Start("out.xlsx");
		}
	}
}



