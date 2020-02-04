using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using Newtonsoft.Json;
using NGS.Templater;

namespace TemplaterJson
{
	class Program
	{
		static int Main(string[] args)
		{
			if (args == null || args.Length == 0) return ShowHelp(0, Console.Out);
			else if (args.Length > 3)
			{
				Console.WriteLine("Too many arguments (" + args.Length + ")");
				return ShowHelp(1, Console.Error);
			}
			else
			{
				try
				{
					return Process(
						args[0],
						args.Length > 1 ? args[1] : null,
						args.Length > 2 ? args[2] : null);
				}
				catch (Exception ex)
				{
					Console.Error.WriteLine("An error occurred while processing:");
					Console.Error.WriteLine(ex.ToString());
					return 2;
				}
			}
		}

		private static int ShowHelp(int result, TextWriter writer)
		{
			writer.WriteLine("Example usage: ");
			var location = typeof(Program).Assembly.Location;
			var name = location != null ? Path.GetFileName(location) : "TemplaterJson.exe";
			writer.WriteLine("	" + name + " template.ext [data.json] [output.ext]");
			writer.WriteLine("	template.ext: path to the template file (eg. document.docx)");
			writer.WriteLine("	data.json:    path to a file containing a JSON object or an array of JSON objects");
			writer.WriteLine();
			writer.WriteLine("Alternatively, you can use omit the [data.json] and [output.ext] arguments to read from stdin and write to stdout");
			writer.WriteLine("	" + name + " template.ext < [data.json] > [output.ext]");
			writer.WriteLine();
			writer.WriteLine("Images can be sent as base64 string in JSON and paired with :image metadata on the tag.");
			writer.WriteLine();
			SupportedType.ShowHelp(writer);
			writer.Flush();
			return result;
		}

		private static int Process(string templatePath, string dataPath, string outputPath)
		{
			var ext = SupportedType.FindExtension(templatePath);
			if (ext == null)
			{
				Console.Error.WriteLine("Unsupported extension: " + templatePath);
				return 2;
			}

			if (dataPath != null && !File.Exists(dataPath))
			{
				Console.Error.WriteLine("Unable to find specified data file: " + dataPath);
				return 2;
			}
			var json = dataPath == null ? Console.In : new StreamReader(new FileStream(dataPath, FileMode.Open, FileAccess.Read));

			var newtonsoft = new Newtonsoft.Json.JsonSerializer();
			newtonsoft.Converters.Add(new DictionaryConverter());

			using (var fis = new FileStream(templatePath, FileMode.Open, FileAccess.Read))
			using (var fos = outputPath == null ? Console.OpenStandardOutput() : new FileStream(outputPath, FileMode.Create, FileAccess.Write))
			{
				while (char.IsWhiteSpace((char)json.Peek()))
				{
					json.Read();
				}
				if (json.Peek() == '[')
				{
					var deser = newtonsoft.Deserialize<IDictionary<string, object>[]>(new JsonTextReader(json));
					using (var td = Configuration.Builder.Include(Base64Image).Build().Open(fis, fos, ext))
						td.Process(deser);
				}
				else
				{
					var deser = newtonsoft.Deserialize<IDictionary<string, object>>(new JsonTextReader(json));
					using (var td = Configuration.Builder.Include(Base64Image).Build().Open(fis, fos, ext))
						td.Process(deser);
				}
			}

			return 0;
		}

		static object Base64Image(object value, string metadata)
		{
			var str = value as string;
			if (metadata == "image" && str != null)
				return Image.FromStream(new MemoryStream(System.Convert.FromBase64String(str)));
			return value;
		}
	}
}
