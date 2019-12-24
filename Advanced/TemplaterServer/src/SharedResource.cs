using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace TemplaterServer
{
	public class SharedResource
	{
		internal readonly byte[] Default;
		internal readonly byte[] Index;
		internal readonly string[] TemplateFiles;
		internal readonly string TemplateHtml;
		internal readonly string DefaultHtml;
		internal readonly Dictionary<string, string> Jsons;
		internal readonly Dictionary<string, PdfConverter> PdfConverters = new Dictionary<string, PdfConverter>();

		public SharedResource(string[] args)
		{
			var asm = typeof(SharedResource).Assembly;
			var types = asm.GetTypes().Where(t => typeof(PdfConverter).IsAssignableFrom(t) && t.IsClass && !t.IsAbstract);
			var pdf = new string[0];
			foreach (var a in args)
			{
				if (a.StartsWith("pdf="))
					pdf = a.Substring("pdf=".Length).Split(',');
			}

			foreach (var t in types)
			{
				var ctors = t.GetConstructors();
				if (ctors.Length == 0 || pdf.Length > 0 && !pdf.Contains(t.Name)) continue;
				var ctor = ctors[0];
				try
				{
					if (ctor.GetParameters().Length == 0)
						PdfConverters[t.Name] = (PdfConverter)Activator.CreateInstance(t);
					else if (ctor.GetParameters().Length == 1)
						PdfConverters[t.Name] = (PdfConverter)Activator.CreateInstance(t, new[] { args });
				}
				catch (Exception ex)
				{
					Console.WriteLine(ex.ToString());
				}
			}
			DefaultHtml = new StreamReader(asm.GetManifestResourceStream("TemplaterServer.template.default.html")).ReadToEnd();
			TemplateHtml = new StreamReader(asm.GetManifestResourceStream("TemplaterServer.template.index.html")).ReadToEnd();
			TemplateFiles = Directory.EnumerateFiles("resources/templates/").OrderBy(it => it).ToArray();
			Jsons = new Dictionary<string, string>();
			foreach (var f in Directory.EnumerateFiles("resources/examples/"))
				Jsons[Path.GetFileNameWithoutExtension(f.ToLowerInvariant())] = System.IO.File.ReadAllText(f);

			var index = CreateIndex(TemplateFiles.Length > 0 ? Path.GetFileName(TemplateFiles[0]) : string.Empty);
			Index = Encoding.UTF8.GetBytes(index);
			Default = Encoding.UTF8.GetBytes(DefaultHtml.Replace("${content}", index));
		}

		internal string CreateIndex(string current)
		{
			var sb = new StringBuilder();
			for (int i = 0; i < TemplateFiles.Length; i++)
			{
				var t = TemplateFiles[i];
				var name = t.Substring("resources/templates/".Length);
				sb.AppendFormat(@"
<li><p>
	<button style=""display:none;"" class=""template btn btn-primary feat-btn feat-btn-lg{1}"" data-template=""{0}"">
		<i class=""fa fa-file-text"" ></i> {0}
	</button>
	<noscript>
		<a href=""?template={0}"">
			<button class=""btn btn-primary feat-btn feat-btn-lg{1}""><i class=""fa fa-file-text"" ></i> {0} </button>
		</a>
	</noscript>
</p></li>", name, string.Equals(name, current, StringComparison.OrdinalIgnoreCase) || string.IsNullOrEmpty(current) && i == 0 ? " active" : string.Empty);
			}

			var defaultTemplate = string.IsNullOrEmpty(current) ? string.Empty : "Create " + current.Substring(current.LastIndexOf('.') + 1) + " document with " + current;
			string json;
			if (Jsons.TryGetValue(current.ToLowerInvariant(), out json))
				json = json.Replace("&", "&amp;");
			else
				json = string.Empty;
			var pdfConverters = new StringBuilder();
			foreach(var pdf in PdfConverters)
				pdfConverters.Append("\"").Append(pdf.Key).Append("\",");
			if (pdfConverters.Length > 0)
				pdfConverters.Length = pdfConverters.Length - 1;

			return TemplateHtml
				.Replace("${pdfConverters}", pdfConverters.ToString())
				.Replace("${templates}", sb.ToString())
				.Replace("${defaultTemplate}", defaultTemplate)
				.Replace("${defaultJson}", json)
				.Replace("${downloadUrl}", string.IsNullOrEmpty(current) ? "#" : "templates/" + current)
				.Replace("${defaultFilename}", string.IsNullOrEmpty(current) ? string.Empty : current);
		}
	}
}
