using System.Diagnostics;
using System.IO;
using NGS.Templater;

namespace BoolOverride
{
	public class Program
	{
		class Bools
		{
			public bool game1;
			public bool game2 = true;
		}

		static object CustomBoolFormater(object value, string metadata)
		{
			if (metadata.StartsWith("bool(") && value is bool)
			{
				var split = metadata.Substring(5, metadata.Length - 6).Split('/');
				if ((bool)value) return split[0].Replace("\\,", ",");
				else return split[split.Length - 1].Replace("\\,", ",");
			}
			return value;
		}

		public static void Main(string[] args)
		{
			File.Copy("template/Bools.docx", "Bools.docx", true);
			var factory = Configuration.Builder.Include(CustomBoolFormater).Build();
			using (var doc = factory.Open("Bools.docx"))
				doc.Process(new Bools());
			Process.Start(new ProcessStartInfo("Bools.docx") { UseShellExecute = true });
		}
	}
}
