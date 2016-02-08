using System.Collections.Generic;
using System.Diagnostics;

namespace Labels
{
	class Program
	{
		class Address
		{
			public string FirstName;
			public string LastName;
			public string Line;
			public string PostCode;
		}
		static void Main(string[] args)
		{
			var addresses = new List<Address>();
			for (int i = 0; i < 100; i++)
				addresses.Add(new Address { FirstName = "name " + i, LastName = "surname " + i, Line = "line " + i, PostCode = "post " + i });
			using (var doc = NGS.Templater.Configuration.Factory.Open("label.docx"))
				doc.Process(addresses);
			Process.Start("label.docx");
		}
	}
}
