using System.Diagnostics;
using System.IO;
using NGS.Templater;

namespace ChartExample
{
	class Program
	{
		static void Main(string[] args)
		{
			File.Copy("SimpleConversion.xlsx", "out.xlsx", true);

			using (var doc = Configuration.Factory.Open("out.xlsx"))
			{
				doc.Process(new { aa = 100, bb = 22.2m });
			}
			Process.Start("out.xlsx");
		}
	}
}
