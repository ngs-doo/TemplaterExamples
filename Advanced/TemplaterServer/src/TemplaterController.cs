using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using NGS.Templater;

namespace TemplaterServer
{
    [Route("/")]
    public class TemplaterController : Controller
    {
		private static readonly byte[] Default;
		private static readonly byte[] Index;
		private static readonly string[] TemplateFiles;
		private static readonly string TemplateHtml;
		private static readonly string DefaultHtml;
		private static readonly Dictionary<string, string> Jsons;

		private static readonly JsonSerializer Newtonsoft;
		private static readonly IDocumentFactory Factory = Configuration.Builder.Include(JavaFormat).Build();

		static object JavaFormat(object value, string metadata)
		{
			if (metadata == "format(%.3f)")
			{
				if (value is decimal)
					return ((decimal)value).ToString("N3");
				else if (value is double)
					return ((double)value).ToString("N3");
				else if (value is float)
					return ((float)value).ToString("N3");
				else if (value is long)
					return ((long)value).ToString("N3");
				else if (value is long)
					return ((long)value).ToString("N3");
			}
			return value;
		}

		static TemplaterController()
		{
			var asm = typeof(TemplaterController).Assembly;
			DefaultHtml = new StreamReader(asm.GetManifestResourceStream("TemplaterServer.template.default.html")).ReadToEnd();
			TemplateHtml = new StreamReader(asm.GetManifestResourceStream("TemplaterServer.template.index.html")).ReadToEnd();
			TemplateFiles = Directory.EnumerateFiles("resources/templates/").OrderBy(it => it).ToArray();
			Jsons = new Dictionary<string, string>();
			foreach(var f in Directory.EnumerateFiles("resources/examples/")) 
				Jsons[Path.GetFileNameWithoutExtension(f.ToLowerInvariant())] = System.IO.File.ReadAllText(f);	

			var index = CreateIndex(TemplateFiles.Length > 0 ? Path.GetFileName(TemplateFiles[0]) : string.Empty);
			Index = Encoding.UTF8.GetBytes(index);
			Default = Encoding.UTF8.GetBytes(DefaultHtml.Replace("${content}", index));
			Newtonsoft = new JsonSerializer();
			Newtonsoft.Culture = System.Globalization.CultureInfo.InvariantCulture;
			Newtonsoft.TypeNameHandling = TypeNameHandling.None;
			Newtonsoft.Converters.Add(new DictionaryConverter());
		}

		private static string CreateIndex(string current)
		{
			var sb = new StringBuilder();
			for(int i = 0; i < TemplateFiles.Length; i++)
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

			return TemplateHtml
				.Replace("${templates}", sb.ToString())
                .Replace("${defaultTemplate}", defaultTemplate)
                .Replace("${defaultJson}", json)
                .Replace("${downloadUrl}", string.IsNullOrEmpty(current) ? "#" : "templates/" + current)
                .Replace("${defaultFilename}", string.IsNullOrEmpty(current) ? string.Empty : current);
		}

		[HttpGet("{template?}")]
		public IActionResult Get([FromQuery]string template)
		{
			if (string.IsNullOrEmpty(template) || !Jsons.ContainsKey(template.ToLowerInvariant())) 
				return File(Default, "text/html;charset=UTF-8");
			var index = CreateIndex(template);
			return File(Encoding.UTF8.GetBytes(DefaultHtml.Replace("${content}", index)), "text/html;charset=UTF-8");
		}

		[HttpGet("content/{template?}")]
		public IActionResult Nested([FromQuery]string template)
		{
			if (string.IsNullOrEmpty(template) || !Jsons.ContainsKey(template.ToLowerInvariant())) 
				return File(Index, "text/html;charset=UTF-8");
			var index = CreateIndex(template);
			return File(Encoding.UTF8.GetBytes(index), "text/html;charset=UTF-8");
		}

		[HttpGet("static/{file}")]
		public IActionResult Static(string file)
		{
			var fi = new FileInfo("resources/static/" + file);
			if (!fi.Exists) return NotFound();
			return PhysicalFile(fi.FullName, file.EndsWith(".css") ? "text/css" : "application/javascript");
		}

		[HttpGet("js/{file}")]
		public IActionResult JS(string file)
		{
			var fi = new FileInfo("resources/js/" + file);
			if (!fi.Exists) return NotFound();
			return PhysicalFile(fi.FullName, "application/javascript");
		}

		[HttpGet("examples/{file}")]
		public IActionResult Examples(string file)
		{
			var fi = new FileInfo("resources/examples/" + file);
			if (!fi.Exists) return NotFound();
			return PhysicalFile(fi.FullName, "text/json");
		}

		[HttpGet("templates/{file}")]
		public IActionResult Templates(string file)
		{
			var fi = new FileInfo("resources/templates/" + file);
			if (!fi.Exists) return NotFound();
			return PhysicalFile(fi.FullName, MimeType(file));
		}

		private static string MimeType(string file)
		{
			if (file.EndsWith(".docx"))
			    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
			if (file.EndsWith(".xlsx"))
				return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
			if (file.EndsWith(".pptx"))
				return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
			return "application/octet-stream";
		}

		public class Argument
		{
			public string json { get; set; }
			public string template { get; set; }
			public bool toPdf { get; set; }
		}

		private static MemoryStream Process(FileInfo fi, string argument)
		{
			var ms = new MemoryStream();
			var bytes = System.IO.File.ReadAllBytes(fi.FullName);
			ms.Write(bytes, 0, bytes.Length);
			ms.Position = 0;
			using (var doc = Factory.Open(ms, fi.Extension))
			{
				if (argument.TrimStart().StartsWith("["))
					doc.Process(Newtonsoft.Deserialize<IDictionary<string, object>[]>(new JsonTextReader(new StringReader(argument))));
				else
					doc.Process(Newtonsoft.Deserialize<IDictionary<string, object>>(new JsonTextReader(new StringReader(argument))));
			}
			ms.Position = 0;
			return ms;
		}

		[HttpPost("process")]
        public IActionResult Post(Argument arg)
        {
			if (arg == null) return NotFound();
			var fi = new FileInfo("resources/templates/" + arg.template);
			if (!fi.Exists) return NotFound();
			var ms = Process(fi, arg.json);
			if (arg.toPdf)
				return ConvertToPdf(ms, arg.template);
			return File(ms, MimeType(arg.template), arg.template);
		}

		private static int FileCounter;

		private IActionResult ConvertToPdf(MemoryStream ms, string template)
		{
			lock (Index)
			{
				var tmpPath = Path.GetTempPath();
				var fileName = (++FileCounter) + template;
				var tmpFile = Path.Combine(tmpPath, fileName);
				using (var fs = System.IO.File.OpenWrite(tmpFile))
					ms.WriteTo(fs);
				try
				{
					var info = new ProcessStartInfo
					{
						FileName = "libreoffice", //use exact path on your local machine
						//FileName = @"C:\Program Files (x86)\LibreOffice 3.6\program\soffice.exe",
						Arguments = "--norestore --nofirststartwizard --nologo --headless --convert-to pdf " + fileName,
						WorkingDirectory = tmpPath
					};
					var conv = System.Diagnostics.Process.Start(info);
					conv.Start();
					if (!conv.WaitForExit(30000))
						return StatusCode(503, "Timeout waiting for PDF conversion");
					var pdfFile = Path.Combine(tmpPath, Path.GetFileNameWithoutExtension(fileName) + ".pdf");
					var bytes = System.IO.File.ReadAllBytes(pdfFile);
					System.IO.File.Delete(pdfFile);
					return File(bytes, "application/pdf", Path.GetFileNameWithoutExtension(template) + ".pdf");
				}
				catch
				{
					return StatusCode(500, "PDF conversion failed");
				}
				finally
				{
					System.IO.File.Delete(tmpFile);
				}
			}
		}
	}
}
