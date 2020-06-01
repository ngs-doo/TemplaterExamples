using System.Diagnostics;
using System.IO;
using NGS.Templater;

namespace Paragraphs
{
	public class Program
	{
		public static void Main(string[] args)
		{
			File.Copy("template/Paragraphs.docx", "Paragraphs.docx", true);
			var paragraphs = new[] {
				new { paragraph = "While Templater does not support resizing of paragraphs, same effect can be created through the use of lists and tables which are considered resizable by Templater." },
				new { paragraph = "A common use case for paragraphs is custom indentation rules for paragraphs which can be replicated just fine inside lists and tables with a use of some tricks."}
			};
			using (var doc = Configuration.Factory.Open("Paragraphs.docx"))
				doc.Process(new { table = paragraphs, list = paragraphs });
			Process.Start(new ProcessStartInfo("Paragraphs.docx") { UseShellExecute = true });
		}
	}
}
