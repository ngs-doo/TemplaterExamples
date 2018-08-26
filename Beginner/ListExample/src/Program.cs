using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using NGS.Templater;

namespace ListExample
{
	public class Program
	{
		public class MyHorse
		{
			public string name { get; set; }
			public float odds { get; set; }
		}

		public class MyBets
		{
			public string name { get; set; }
			public DateTime date { get; set; }
			public string announced { get; set; }
			public List<MyHorse> horses { get; set; }
		}

		public static void Main(string[] args)
		{
			File.Copy("template/MyList.docx", "List.docx", true);

			var horses1 = new List<MyHorse>() {
				new MyHorse{ name = "Blizzard", odds = 1.4500134f },
				new MyHorse{ name = "Sandstorm", odds = 1.5500134f },
				new MyHorse{ name = "Earth", odds = 1.2500134f },
				new MyHorse{ name = "Cat", odds = 2.4500134f }};
			var horses2 = new List<MyHorse>() {
				new MyHorse{ name = "Blizzard", odds = 2.42f},
				new MyHorse{ name = "Earth", odds = 1.5500134f},
				new MyHorse{ name = "Sandstorm", odds = 1.00134f},
				new MyHorse{ name = "Cat", odds = 2.0134f}};

			var myList = new List<MyBets>() {
				new MyBets { name = "BetSafe", date = DateTime.Parse("11/05/2012"), announced = "2012-05-12", horses = horses1 },
				new MyBets { name =  "BetUnsafe", date = DateTime.Parse("12/04/2014"), announced = "2014-04-12", horses = horses2 }};

			using (var doc = Configuration.Factory.Open("List.docx"))
				doc.Process(myList);
			Process.Start("List.docx");
		}
	}
}
