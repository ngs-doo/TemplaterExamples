using System.Diagnostics;
using System.IO;
using NGS.Templater;

namespace SimpleDocument
{
	public class Program
	{
		public static void Main(string[] args)
		{
			File.Copy("MyDocument.docx", "out.docx", true);
			var data = new { Tag = "an example" };

			using (var document = Configuration.Factory.Open("out.docx"))
			{
				document.Process(data);
			}

			Process.Start("out.docx");
		}
	}
}
