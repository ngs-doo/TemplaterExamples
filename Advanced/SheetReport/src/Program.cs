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
			var result = new InputData();
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
		}

		class RawData
		{
			public String country;
			public String city;
			public int year;
			public long population;
		}

		class CityData
		{
			public String name;
			public long population;
		}

		class CountryInfo
		{
			public String name;
			//In this case, Tenplater doesn't cope with same tag twice, so let's put tag for the sheet into a separate tag
			//also, sheet name can't be longer than 31 characters
			public String sheetName() { return name.Substring(0, Math.Min(30, name.Length)); }
			public List<CityData> city = new List<CityData>();
		}
	}
}
