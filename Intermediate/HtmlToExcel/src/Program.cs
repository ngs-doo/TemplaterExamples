using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Xml.Linq;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using HtmlToOpenXml;
using NGS.Templater;

namespace HtmlToExcel
{
	public class Program
	{
		struct Number
		{
			public readonly int number;

			public Number(int number)
			{
				this.number = number;
			}
		}

		private static readonly HtmlConverter Converter =
			new HtmlConverter(
				WordprocessingDocument.Create(
					new MemoryStream(),
					WordprocessingDocumentType.Document, false
				).AddMainDocumentPart());

		private static void StripWordTags(XElement element)
		{
			if (element.Name.NamespaceName == "http://schemas.openxmlformats.org/wordprocessingml/2006/main")
				element.Name = XName.Get(element.Name.LocalName, "http://schemas.openxmlformats.org/spreadsheetml/2006/main");
			foreach (var a in element.Attributes())
			{
				if (a.Name.NamespaceName == "http://schemas.openxmlformats.org/wordprocessingml/2006/main")
				{
					a.Remove();
					element.Add(new XAttribute(a.Name.LocalName, a.Value));
				}
			}
			foreach (var child in element.Elements())
				StripWordTags(child);
			if (element.Name.LocalName == "color")
			{
				var val = element.Attribute("val");
				if (val != null)
				{
					val.Remove();
					element.Add(new XAttribute("rgb", val.Value));
				}
			}
		}

		private static IEnumerable<XElement> StripWordTags(string input)
		{
			var xml = XElement.Parse(input);
			var elements = xml.Elements().ToList();
			foreach (var e in elements)
				StripWordTags(e);
			return elements;
		}

		public static object ConverterHtml(object value, string metadata)
		{
			if (metadata == "convert-html")
			{
				var paragraphs = Converter.Parse(value.ToString());
				//return collection of XElement objects which will be inserted as is into document current tag
				return paragraphs.SelectMany(it => StripWordTags(it.OuterXml));
			}
			return value;
		}

		enum Color
		{
			RED = 0,
			ORANGE = 1,
			YELLOW = 2,
			GREEN = 3,
			BLUE = 4
		}

		static object ColorToXML(object value, string tag, string[] metadata)
		{
			if (value is Color)
			{
				var c = (Color)value;
				//we need to know the location of conversion table in Excel (this could be provided as argument if needed)
				var t = new XElement(XName.Get("t", "http://schemas.openxmlformats.org/spreadsheetml/2006/main"));
				t.SetAttributeValue("templater-cell-style", "Colors!A" + (2 + (int)c));
				return t;
			}
			return value;
		}

		public static void Main(string[] args)
		{
			File.Copy("template/Document.xlsx", "Html.xlsx", true);
			var factory = Configuration.Builder
				.Include(ConverterHtml)
				.Include(ColorToXML)
				.Build();
			using (var doc = factory.Open("Html.xlsx"))
			{
				doc.Process(new
				{
					html = "<p>My simple <b>bold</b> text in <span style=\"color:red\">red!</span></p>",
					numbers = new[] { new Number(100), new Number(-100), new Number(10) },
					background = Color.ORANGE
				});
			}
			Process.Start(new ProcessStartInfo("Html.xlsx") { UseShellExecute = true });
		}
	}
}
