using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Xml.Linq;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using NGS.Templater;
using NotesFor.HtmlToOpenXml;

namespace HtmlPlugin
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
				return paragraphs.Select(it => XElement.Parse(it.OuterXml));
			}
			return value;
		}

		public static void Main(string[] args)
		{
			File.Copy("template.docx", "HtmlPlugin.docx", true);
			var factory = Configuration.Builder
				.Include(SimpleHtmlConverter)//include custom plugins
				.Include(ComplexHtmlConverter)
				.Build();
			using (var doc = factory.Open("HtmlPlugin.docx"))
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
</html>"
				});
			}
			Process.Start("HtmlPlugin.docx");
		}
	}
}
