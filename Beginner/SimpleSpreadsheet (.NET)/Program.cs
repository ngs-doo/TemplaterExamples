using System;
using System.Diagnostics;
using NGS.Templater;

namespace SimpleSpreadsheet
{
	public class Program
	{
		public static void Main(string[] args)
		{
			var myFile = "MySpreadsheet.xlsx";
			var data = new
			{
				Name = "Marry",
				BirthDay = new DateTime(2005, 10, 10),
				Today = DateTime.Today
			};

			// Please rebuild your application before starting it
			// to copy the original template into the output folder

			using (var document = Configuration.Factory.Open(myFile))
			{
				document.Process(data);
			}

			Process.Start(myFile);
		}
	}
}



