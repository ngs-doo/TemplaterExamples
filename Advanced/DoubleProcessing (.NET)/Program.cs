using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using NGS.Templater;

namespace DoubleProcessing
{
	public class Program
	{
		public static void Main(string[] args)
		{
			var ms = new MemoryStream();
			var bytes = File.ReadAllBytes("ResizeWithNesting.xlsx");
			ms.Write(bytes, 0, bytes.Length);
			ms.Position = 0;

			var rnd = new Random();
			var totalPeople = rnd.Next(3, 7);
			var person = new Person[totalPeople];
			for (int i = 0; i < person.Length; i++)
				person[i] = new Person(rnd, i);

			//let's do a horizontal resize so document is prepared for second pass
			using (var doc = Configuration.Factory.Open(ms, "xlsx"))
			{
				//[[equals]] at the beginning of the cell causes conversion to formula
				//this is processed at the end of processing, but since this tag is newly introduced, it's processed at the second pass
				doc.Process(new { Person = person, formula = "[[equals]]" });
			}
			ms.Position = 0;

			//now let's prepare our complex object for standard processing
			var complex = BuildComplexObject(totalPeople);

			//let's do a second pass with our prepared object
			using (var doc = Configuration.Factory.Open(ms, "xlsx"))
				doc.Process(complex);

			File.WriteAllBytes("DoubleProcessing.xlsx", ms.ToArray());

			Process.Start("DoubleProcessing.xlsx");
		}

		class Person
		{
			public string AccountDescription;
			public string RegistrationNumber;
			public string ShortName;
			public string AccountNumber;
			public int RealizedGains;
			public int UnrealizedLosses;
			public int NetUnrealizedGains;
			public string Group;
			public string Item;
			public string Total;
			public Person(Random rnd, int i)
			{
				AccountDescription = "account " + i;
				RegistrationNumber = "reg " + i;
				ShortName = "name " + i;
				AccountNumber = "number " + i;
				RealizedGains = rnd.Next(100, 10000);
				UnrealizedLosses = rnd.Next(100, 10000);
				NetUnrealizedGains = rnd.Next(100, 10000);
				Group = "[[Groups.Person" + i + "]]";
				Item = "[[Groups.Items.Person" + i + "]]";
				Total = "[[Total.Person" + i + "]]";
			}
		}

		class Group : Dictionary<string, object>
		{
			public Group(Random rnd, int cur, int people)
			{
				this["Name"] = "group " + cur;
				this["Description"] = "desc " + cur;
				this["TargetPercentage"] = (decimal)rnd.NextDouble() * 10;
				this["RecommendedDollars"] = (decimal)rnd.NextDouble() * 100;
				this["ToleranceDollars"] = (decimal)rnd.NextDouble() * 100;
				for (var i = 0; i < people; i++)
					this["Person" + i] = rnd.Next(100, 10000);
				var subitems = rnd.Next(1, 5);
				var items = new List<Dictionary<string, object>>();
				for (int i = 0; i < subitems; i++)
				{
					var dict = new Dictionary<string, object>();
					items.Add(dict);
					for (int j = 0; j < people; j++)
						dict["Person" + j] = rnd.Next(10, 10000);
					dict["Name"] = "subitem " + i + " for " + cur;
					dict["TargetPercentage"] = rnd.NextDouble();
					dict["RecommendedDollars"] = rnd.NextDouble() * 10;
					dict["ToleranceDollars"] = rnd.NextDouble() * 100;
				}
				this["Items"] = items;
			}
		}

		static Dictionary<string, object> BuildComplexObject(int people)
		{
			var rnd = new Random();
			var totalGroups = rnd.Next(4, 22) / 2;
			var result = new Dictionary<string, object>();
			result["ReportHeader"] = "report header";
			//or it would be better to format cell in excel instead of using string
			result["Date"] = DateTime.Today.ToShortDateString();
			var groups = new Group[totalGroups];
			result["Groups"] = groups;
			for (int i = 0; i < totalGroups; i++)
				groups[i] = new Group(rnd, i, people);
			var totals = new Dictionary<string, object>[totalGroups / 2];
			result["Total"] = totals;
			for (int i = 0; i < totals.Length; i++)
			{
				var dict = totals[i] = new Dictionary<string, object>();
				dict["Name"] = "total " + i;
				dict["TargetPercentage"] = rnd.NextDouble() * 10;
				dict["RecommendedDollars"] = rnd.NextDouble() * 100;
				dict["ToleranceDollars"] = rnd.NextDouble() * 100;
				dict["Description"] = "desc " + i;
				for (int j = 0; j < people; j++)
					dict["Person" + j] = groups.Skip(i * 2).Take(2).Sum(it => (int)it["Person" + j]);
			}
			return result;
		}
	}
}
