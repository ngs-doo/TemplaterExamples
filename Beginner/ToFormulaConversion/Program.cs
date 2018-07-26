using System.Diagnostics;
using System.IO;
using NGS.Templater;

namespace ToFormulaConversion
{
	public class Program
	{
		public static void Main(string[] args)
		{
			File.Copy("template/SimpleConversion.xlsx", "formula.xlsx", true);

			using (var doc = Configuration.Factory.Open("formula.xlsx"))
			{
				doc.Process(new { aa = 100, bb = 22.2m });
			}
			Process.Start("formula.xlsx");
		}
	}
}
