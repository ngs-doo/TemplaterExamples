using System.Diagnostics;
using System.IO;
using NGS.Templater;

namespace SimplePresentation
{
	public class Program
	{
		public static void Main(string[] args)
		{
			File.Copy("template/Presentation.pptx", "out.pptx", true);
			var data = new { title = "Important presentation", subtitle = "Powered by Templater" };

			using (var document = Configuration.Factory.Open("out.pptx"))
			{
				document.Process(data);
			}

			Process.Start(new ProcessStartInfo("out.pptx") { UseShellExecute = true });
		}
	}
}
