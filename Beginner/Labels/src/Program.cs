using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using NGS.Templater;

namespace Labels
{
	public class Program
	{
		class Address
		{
			public string FirstName;
			public string LastName;
			public string Line;
			public string PostCode;
		}
		public static void Main(string[] args)
		{
			File.Copy("template/label.docx", "label.docx", true);
			var addresses = new List<Address>();
			for (int i = 0; i < 100; i++)
				addresses.Add(new Address { FirstName = "name " + i, LastName = "surname " + i, Line = "line " + i, PostCode = "post " + i });
			using (var doc = Configuration.Factory.Open("label.docx"))
				doc.Process(addresses);
			Process.Start("label.docx");
		}
	}
}
