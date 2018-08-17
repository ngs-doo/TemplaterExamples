using System.Collections;
using System.Diagnostics;
using System.Drawing;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Xml.Linq;
using Humanizer;
using NGS.Templater;

namespace CollapseRegion
{

	public class Program
	{
		public static void Main(string[] args)
		{
			File.Copy("template/Collapse.docx", "Collapse.docx", true);
			var application1 =
					new Application()
							.setPaybackYears(20)
							.setUcCheck(true).setUcCheckResponse("Ok")
							.setApplicant(new Applicant("first applicant").setFrom("Google", 2012, 11));
			application1.getLoans().Add(new Loan("Big Bank", 10000, Color.Blue));
			application1.getLoans().Add(new Loan("Small Bank", 2000, Color.Lime));
			var application2 =
					new Application().hideLoans()
							.setPaybackYears(15)
							.setUcCheck(false)
							.setUcCheckResponse("Not good enough")
							.setApplicant(new Applicant("second applicant").setFrom("Apple", 2015, 12))
							.setCoApplicant(new Applicant("second co-applicant").setFromUntil("IBM", 2014, 11, 2015, 12));
			var application3 =
					new Application()
							.setPaybackYears(10)
							.setUcCheck(true).setUcCheckResponse("Ok")
							.setApplicant(new Applicant("third applicant").setFrom("Microsoft", 2010, 1));
			var factory = Configuration.Builder.Include((value, metadata, path, templater) =>
			{
				var str = value as string;
				if (str != null && metadata.StartsWith("collapseIf("))
				{
					//Extract the matching expression
					var expression = metadata.Substring("collapseIf(".Length, metadata.Length - "collapseIf(".Length - 1);
					if (str == expression)
					{
						//remove the context around the specific property
						templater.Resize(new[] { path }, 0);
						return true;
					}
				}
				return false;
			}).Include((value, metadata, property, templater) =>
			{
				if (value is IList && ("collapseNonEmpty" == metadata || "collapseEmpty" == metadata))
				{
					var list = (IList)value;
					//loop until all tags with the same name are processed
					do
					{
						var md = templater.GetMetadata(property, false);
						var collapseOnEmpty = md.Contains("collapseEmpty");
						var collapseNonEmpty = md.Contains("collapseNonEmpty");
						if (list.Count == 0)
						{
							if (collapseOnEmpty)
								templater.Resize(new[] { property }, 0);
							else
								templater.Replace(property, "");
						}
						else
						{
							if (collapseNonEmpty)
								templater.Resize(new[] { property }, 0);
							else
								templater.Replace(property, "");
						}
					} while (templater.Tags.Contains(property));
					//we want to stop further processing if list is empty
					//otherwise we want to continue resizing list and processing it's elements
					return list.Count == 0;
				}
				return false;
			}).Include(value =>
			{
				if (value is Color)
				{
					var fillValue = ((Color)value).ToArgb().ToString("X4").Substring(2);
					return new XElement(
						XName.Get("tc", "http://schemas.openxmlformats.org/wordprocessingml/2006/main"),
						new XElement(
							XName.Get("tcPr", "http://schemas.openxmlformats.org/wordprocessingml/2006/main"),
							new XElement(
								XName.Get("shd", "http://schemas.openxmlformats.org/wordprocessingml/2006/main"),
								new XAttribute(XName.Get("val", "http://schemas.openxmlformats.org/wordprocessingml/2006/main"), "clear"),
								new XAttribute(XName.Get("color", "http://schemas.openxmlformats.org/wordprocessingml/2006/main"), "auto"),
								new XAttribute(XName.Get("fill", "http://schemas.openxmlformats.org/wordprocessingml/2006/main"), fillValue))));
				}
				return value;
			}).Include((value, metadata) =>
			{
				if ("verbalize" == metadata && value is decimal)
				{
					var d = (decimal)value;
					return NumberToWordsExtension.ToWords((int)d, GrammaticalGender.Neuter, CultureInfo.CurrentUICulture);
				}
				return value;
			}).Build();

			using (var doc = factory.Open("Collapse.docx"))
				doc.Process(new[] { application1, application2, application3 });
			Process.Start("Collapse.docx");
		}
	}
}
