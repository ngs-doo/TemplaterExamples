using System.Collections.Generic;
using System.IO;

namespace TemplaterJson
{
	internal static class SupportedType
	{
		private readonly static Dictionary<string, string> Extensions = new Dictionary<string, string>();
		static SupportedType()
		{
			Extensions["docm"] = "Macro-Enabled Office Open XML document (Word)";
			Extensions["docx"] = "Office Open XML document (Word)";
			Extensions["xlsm"] = "Macro-Enabled Office Open XML spreadsheet (Excel)";
			Extensions["xlsx"] = "Office Open XML spreadsheet (Excel)";
			Extensions["csv"] = "Comma separated values document";
			Extensions["txt"] = "Text file (native encoding)";
			Extensions["utf8"] = "Text file (UTF-8 encoding)";
		}

		public static string FindExtension(string file)
		{
			var ind = file.LastIndexOf('.');
			if (ind == -1) return null;
			var ext = file.Substring(ind + 1).ToLowerInvariant();
			if (Extensions.ContainsKey(ext)) return ext;
			return null;
		}

		public static void ShowHelp(TextWriter writer)
		{
			writer.WriteLine("Supported extensions:");
			foreach (var kv in Extensions)
				writer.WriteLine(kv.Key + " - " + kv.Value);
		}
	}
}
