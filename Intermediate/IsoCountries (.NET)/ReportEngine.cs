using System;
using System.Collections;
using System.IO;
using NGS.Templater;

namespace IsoCountries
{
	public static class ReportEngine
	{
		static IDocumentFactory DocumentFactory = NGS.Templater.Configuration.Factory;
		static int FileCounter;

		public static void Populate(IEnumerable countries, Action<string> execute)
		{
			FileCounter++;
			var file = "Example" + FileCounter + ".xlsx";
			File.Copy("Templates\\Countries.xlsx", file, true);

			using (var document = DocumentFactory.Open(file))
				document.Process(countries);

			execute(file);
		}
	}
}
