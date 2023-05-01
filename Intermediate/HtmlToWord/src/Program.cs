using System.Collections.Generic;
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
		public static object SimpleHtmlConverter(object value, string metadata)
		{
			if (metadata == "simple-html")
			{
				var wpd = WordprocessingDocument.Create(new MemoryStream(), WordprocessingDocumentType.Document, false).AddMainDocumentPart();
				var converter = new HtmlConverter(wpd);
				var paragraphs = converter.Parse(value.ToString());
				//return single XElement object which will be inserted as is into document after current tag
				return XElement.Parse(paragraphs[0].OuterXml);
			}
			return value;
		}

		private static readonly XName HyperlinkName = XName.Get("hyperlink", "http://schemas.openxmlformats.org/wordprocessingml/2006/main");
		private static readonly XName FldSimpleName = XName.Get("fldSimple", "http://schemas.openxmlformats.org/wordprocessingml/2006/main");
		private static readonly XName InstrName = XName.Get("instr", "http://schemas.openxmlformats.org/wordprocessingml/2006/main");
		private static readonly XName RelIDName = XName.Get("id", "http://schemas.openxmlformats.org/officeDocument/2006/relationships");

		private static void RewriteHyperlinks(XElement element, Dictionary<string, string> links)
		{
			string url;
			if (element.Name == HyperlinkName && links.TryGetValue(element.Attribute(RelIDName).Value, out url))
			{
				element.RemoveAttributes();
				element.Name = FldSimpleName;
				element.SetAttributeValue(InstrName, " HYPERLINK " + url + " ");
			}
			else
			{
				foreach (var el in element.Elements())
					RewriteHyperlinks(el, links);
			}
		}

		public static object ComplexHtmlConverter(object value, string metadata)
		{
			if (metadata == "complex-html")
			{
				var wpd = WordprocessingDocument.Create(new MemoryStream(), WordprocessingDocumentType.Document, false).AddMainDocumentPart();
				var converter = new HtmlConverter(wpd);
				var paragraphs = converter.Parse(value.ToString());
				var links = new Dictionary<string, string>();
				foreach (var hl in wpd.Document.MainDocumentPart.HyperlinkRelationships)
					links[hl.Id] = hl.Uri.ToString();
				//return collection of XElement objects which will be inserted as is into document current tag
				var xmls = paragraphs.Select(it =>
				{
					var element = XElement.Parse(it.OuterXml);
					if (links.Count > 0)
						RewriteHyperlinks(element, links);
					return element;
				}).ToList();
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
<a href=""https://templater.info/"">Templater</a>
</body>
</html>",
					Html3 = new FileInfo("template/example.html")
				});
			}
			Process.Start(new ProcessStartInfo("Html.docx") { UseShellExecute = true });
		}
	}
}
