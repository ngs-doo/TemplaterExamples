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
							.setApplicant(new Applicant("first applicant").setFrom("Google", 2012, 11).addChild("Mary"));
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
							.setApplicant(new Applicant("third applicant").setFrom("Microsoft", 2010, 1).addChild("Jack").addChild("Jane"));
			var yes = XElement.Parse("<w:p xmlns:w=\"http://schemas.openxmlformats.org/wordprocessingml/2006/main\">YES</w:p>");
			var no = XElement.Parse("<w:p xmlns:w=\"http://schemas.openxmlformats.org/wordprocessingml/2006/main\">NO</w:p>");
			var factory = Configuration.Builder.Include((value, metadata, path, position, templater) =>
			{
				var str = value as string;
				if (str != null && metadata.StartsWith("collapseIf("))
				{
					//Extract the matching expression
					var expression = metadata.Substring("collapseIf(".Length, metadata.Length - "collapseIf(".Length - 1);
					if (str == expression)
					{
						//remove the context around the specific property
						if (position == -1)
						{
							//when position is -1 it means non sharing tag is being used, in which case we can resize that region via "standard" API
							templater.Resize(new[] { path }, 0);
						}
						else
						{
							//otherwise we need to use "advanced" resize API to specify which exact tag to replace
							templater.Resize(new[] { new TagPosition(path, position) }, 0);
						}
						return Handled.NestedTags;
					}
				}
				return Handled.Nothing;
			}).Include((value, metadata, tag, position, templater) =>
			{
				if (value is IList && ("collapseNonEmpty" == metadata || "collapseEmpty" == metadata))
				{
					var list = (IList)value;
					//loop until all tags with the same name are processed
					do
					{
						var md = templater.GetMetadata(tag, false);
						var collapseOnEmpty = md.Contains("collapseEmpty");
						var collapseNonEmpty = md.Contains("collapseNonEmpty");
						if (list.Count == 0)
						{
							if (collapseOnEmpty)
							{
								//when position is -1 it means non sharing tag is being used, in which case we can resize that region via "standard" API
								//otherwise we need to use "advanced" resize API to specify which exact tag to replace
								if (position == -1)
									templater.Resize(new[] { tag }, 0);
								else
									templater.Resize(new[] { new TagPosition(tag, position) }, 0);
							}
							else
							{
								//when position is -1 it means non sharing tag is being used, in which case we can just replace the first tag
								//otherwise we can replace that exact tag via position API
								//replacing the first tag is the same as calling replace(tag, 0, value)
								if (position == -1)
									templater.Replace(tag, "");
								else
									templater.Replace(tag, position, "");
							}
						}
						else
						{
							if (collapseNonEmpty)
							{
								if (position == -1)
									templater.Resize(new[] { tag }, 0);
								else
									templater.Resize(new[] { new TagPosition(tag, position) }, 0);
							}
							else
							{
								if (position == -1)
									templater.Replace(tag, "");
								else
									templater.Replace(tag, position, "");
							}
						}
					} while (templater.Tags.Contains(tag));
					//we want to stop further processing if list is empty
					//otherwise we want to continue resizing list and processing it's elements
					return list.Count == 0 ? Handled.NestedTags : Handled.Nothing;
				}
				return Handled.Nothing;
			}).Include((value, tag, metadata) =>
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
			}).Include((value, metadata, tag, position, templater) =>
			{
				if ("leaveIfEmpty" == metadata && value is IList)
				{
					var list = (IList)value;
					if (list.Count == 0)
					{
						//when list is empty we want to leave the default message
						templater.Replace(tag, "");
					}
					else
					{
						//when list is not empty, we will remove the default message
						templater.Resize(new[] { tag }, 0);
					}
					//indicates that only this tag was handled,
					//so Templater will either duplicate or remove other tags from this collection
					return Handled.ThisTag;
				}
				return Handled.Nothing;
			}).Include((value, metadata) =>
			{
				if ("verbalize" == metadata && value is decimal)
				{
					var d = (decimal)value;
					return NumberToWordsExtension.ToWords((int)d, GrammaticalGender.Neuter, CultureInfo.CurrentUICulture);
				}
				return value;
			}).Include((value, metadata) =>
			{
				if ("paragraph-removal" == metadata && value is bool)
					return (bool)value ? yes : no;
				return value;
			}).XmlCombine("paragraph-removal", (location, xmls) =>
				xmls[0].Value == "YES" ? new[] { location } : new XElement[0]
			).Build();

			using (var doc = factory.Open("Collapse.docx"))
			{
				//manually invoke resize 0 on a tag. ideally this would be some boolean flag/empty collection
				doc.Templater.Resize(new[] { "remove_me" }, 0);
				doc.Process(new[] { application1, application2, application3 });
			}
			Process.Start(new ProcessStartInfo("Collapse.docx") { UseShellExecute = true });
		}
	}
}
