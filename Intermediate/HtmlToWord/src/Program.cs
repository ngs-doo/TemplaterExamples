using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Xml.Linq;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using HtmlToOpenXml;
using NGS.Templater;

namespace HtmlToWord
{
	public class Program
	{
		private static readonly HtmlConverter Converter =
			new HtmlConverter(
				WordprocessingDocument.Create(
					new MemoryStream(),
					WordprocessingDocumentType.Document, false
				).AddMainDocumentPart());

		public static object SimpleHtmlConverter(object value, string metadata)
		{
			if (metadata == "simple-html")
			{
				var paragraphs = Converter.Parse(value.ToString());
				//return single XElement object which will be inserted as is into document after current tag
				return XElement.Parse(paragraphs[0].OuterXml);
			}
			return value;
		}

		public static object ComplexHtmlConverter(object value, string metadata)
		{
			if (metadata == "complex-html")
			{
				var paragraphs = Converter.Parse(value.ToString());
				//return collection of XElement objects which will be inserted as is into document current tag
				var xmls = paragraphs.Select(it => XElement.Parse(it.OuterXml)).ToList();
				//lets put special attribute directly on XML so we don't need to put it on tag
				xmls[0].SetAttributeValue("templater-xml", "remove-old-xml");
				return xmls;
			}
			return value;
		}

		public static void Main(string[] args)
		{
			File.Copy("template/template.docx", "Html.docx", true);
			var factory = Configuration.Builder
				.Include(SimpleHtmlConverter)//include custom plugins
				.Include(ComplexHtmlConverter)
				.Build();
			using (var doc = factory.Open("Html.docx"))
			{
				doc.Process(new
				{
					Html1 = @"<html>
<head>title</head>
<body>
some <strong>text</strong> in <font color=""red"">red!</font>
</body>
</html>",
					Html2 = @"<html>
<head>title</head>
<body>
<ul>
		<li>Number 1</li>
		<li>Number 2</li>
</ul>
</body>
</html>",
					Html3 = new FileInfo("template/example.html")
				});
			}
			Process.Start(new ProcessStartInfo("Html.docx") { UseShellExecute = true });
		}
	}
}
