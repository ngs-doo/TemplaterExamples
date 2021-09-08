using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Xml.Linq;
using ICSharpCode.SharpZipLib.Zip;
using NGS.Templater;

namespace SheetReport
{
	public class Program
	{
		public static void Main(string[] args)
		{
			File.Copy("template/Report.xlsx", "SheetReport.xlsx", true);

			var data = LoadXml();

			using (var doc = Configuration.Factory.Open("SheetReport.xlsx"))
				doc.Process(data);

			Process.Start(new ProcessStartInfo("SheetReport.xlsx") { UseShellExecute = true });
		}

		private static InputData LoadXml()
		{
			var zip = new ZipFile(File.Open("template/UNdata_Export.zip", FileMode.Open));
			var entry = zip.GetEntry("UNdata_Export.xml");
			var xml = XElement.Load(zip.GetInputStream(entry.ZipFileIndex));
			zip.Close();
			var result = new InputData(6);
			var lastCountry = string.Empty;
			CountryInfo country = new CountryInfo();
			var cities = new Dictionary<string, RawData>();
			foreach (var record in xml.Descendants("record"))
			{
				var fields = record.Elements().ToDictionary(it => it.Attribute("name").Value, it => it.Value);
				var stats = new RawData
				{
					country = fields["Country or Area"],
					year = int.Parse(fields["Year"]),
					city = fields["City"],
					population = (long)double.Parse(fields["Value"], CultureInfo.InvariantCulture)
				};
				result.data.Add(stats);
				if (lastCountry != stats.country)
				{
					var isFirst = lastCountry.Length == 0;
					country.name = lastCountry;
					lastCountry = stats.country;
					if (isFirst) continue;
					foreach (var rd in cities.Values)
						country.city.Add(new CityData { name = rd.city, population = rd.population });
					result.country.Add(country);
					cities.Clear();
					country = new CountryInfo { name = stats.country };
				}
				RawData last;
				if (!cities.TryGetValue(stats.city, out last) || last.year < stats.year)
					cities[stats.city] = stats;
			}
			foreach (var rd in cities.Values)
				country.city.Add(new CityData { name = rd.city, population = rd.population });
			result.country.Add(country);
			return result;
		}

		class InputData
		{
			public List<RawData> data = new List<RawData>();
			public List<CountryInfo> country = new List<CountryInfo>();
			public string[][] cities;

			public InputData(int size)
			{
				cities = new string[1][];
				cities[0] = new string[size];
				for (int i = 0; i < size; i++)
					cities[0][i] = Order[i] + " city";
			}

			public object[,] analysis()
			{
				var size = cities[0].Length;
				var result = new object[country.Count, size + 1];
				for (int i = 0; i < country.Count; i++)
				{
					var c = country[i];
					var sorted = c.city.OrderByDescending(it => it.population).ToArray();
					result[i, 0] = c.name;
					for (int j = 1; j <= size && j <= sorted.Length; j++)
						result[i, j] = sorted[j - 1].population;
				}
				return result;
			}
		}
		private static string[] Order = new string[]{
			"Largest",
			"Second",
			"Third",
			"Fourth",
			"Fifth",
			"Sixth",
			"Seventh",
		};

		class RawData
		{
			public string country;
			public string city;
			public int year;
			public long population;
		}

		class CityData
		{
			public string name;
			public long population;
		}

		class CountryInfo
		{
			public string name;
			//In this case, Templater doesn't cope with same tag twice, so let's put tag for the sheet into a separate tag
			//also, sheet name can't be longer than 31 characters
			public string sheetName() { return name.Substring(0, Math.Min(30, name.Length)); }
			public List<CityData> city = new List<CityData>();
		}
	}
}
