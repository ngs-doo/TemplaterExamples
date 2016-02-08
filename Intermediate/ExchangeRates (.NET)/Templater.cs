using System.Collections;
using System.Drawing;
using System.IO;
using NGS.Templater;

namespace ExchangeRates
{
	public static class Templater
	{
		private static IDocumentFactory DocumentFactory = Configuration.Factory;
		private static int FileCounter;

		public static void Process(IEnumerable rates, Image image)
		{
			var file = "Exchange" + (++FileCounter) + ".xlsx";
			File.Copy("Templates\\ExchangeRate.xlsx", file, true);

			using (var document = DocumentFactory.Open(file))
			{
				document.Process(rates);
				document.Templater.Replace("Image", image);
			}

			System.Diagnostics.Process.Start(file);
		}
	}
}
