using System;
using System.Diagnostics;
using System.IO;
using System.IO.Packaging;
using System.Xml.Linq;
using NGS.Templater;

namespace XmlBinding
{
	public class Program
	{
		public static void Main(string[] args)
		{
			File.Copy("template/Binding.docx", "XmlBinding.docx", true);
			var factory = Configuration.Factory;
			using (var doc = factory.Open("XmlBinding.docx"))
			{
				doc.Process(new[] {
					new Item { product = "Templater", code = "TPL", description = "Reporting library", quantity = 3, title = "How many" },
					new Item { product = "Computer", code = "COMP", description = "Hardware", quantity = 1, title = "Items"},
					new Item { product = "Planets", code = "PLN", description = "Big balls", quantity = 123567, title = "Very much"},
					new Item { product = "Stars", code = "STR", description = "Glowing things", quantity = 66554433, title = "Very many"}
				});
			}

			//load resulting bound xml from the document
			var zip = ZipPackage.Open("XmlBinding.docx");
			var part = zip.GetPart(new Uri("/customXml/item1.xml", UriKind.Relative));
			var xml = XElement.Load(part.GetStream());
			zip.Close();

			//bind xml to a custom field for presentation
			using (var doc = factory.Open("XmlBinding.docx"))
				doc.Templater.Replace("xml", xml.ToString());

			Process.Start("XmlBinding.docx");
		}
	}

	class Item
	{
		public string product { get; set; }
		public string code { get; set; }
		public string description { get; set; }
		public int quantity { get; set; }
		public string title { get; set; }
	}
}
