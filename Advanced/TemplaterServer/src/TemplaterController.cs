using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using NGS.Templater;

namespace TemplaterServer
{
    [Route("/")]
    public class TemplaterController : Controller
    {
		private static readonly JsonSerializer Newtonsoft;

		private static readonly IDocumentFactory DocumentFactory = Configuration.Builder.Include(JavaFormat).Build();
		//schema embedding and debugLog will only work with valid Reporting Team or Enterprise license
		private static readonly IDocumentFactory DebugFactory = Configuration.Builder.Include(JavaFormat).ConfigureEditor().DebugLog(true).Configure(false).Build();
		private static readonly IDocumentFactory SchemaFactory = Configuration.Builder.ConfigureEditor().TagListing(true).Configure(true).Build();
		
		static TemplaterController()
		{
			Newtonsoft = new JsonSerializer();
			Newtonsoft.Culture = System.Globalization.CultureInfo.InvariantCulture;
			Newtonsoft.TypeNameHandling = TypeNameHandling.None;
			Newtonsoft.Converters.Add(new DictionaryConverter());
		}

		private readonly SharedResource SharedResource;
		private readonly Dictionary<string, FileInfo> ResourceFiles = new Dictionary<string, FileInfo>();

		public TemplaterController(SharedResource sharedResource)
		{
			this.SharedResource = sharedResource;
			var resourcesPath = new DirectoryInfo("resources");
			foreach(var d in resourcesPath.GetDirectories())
			{
				foreach (var f in d.GetFiles())
					ResourceFiles[d.Name.ToLowerInvariant() + "/" + f.Name.ToLowerInvariant()] = f;
			}
		}

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

		[HttpGet("{template?}")]
		public IActionResult Get([FromQuery]string template)
		{
			if (string.IsNullOrEmpty(template) || !SharedResource.Jsons.ContainsKey(template.ToLowerInvariant())) 
				return File(SharedResource.Default, "text/html;charset=UTF-8");
			var index = SharedResource.CreateIndex(template);
			return File(Encoding.UTF8.GetBytes(SharedResource.DefaultHtml.Replace("${content}", index)), "text/html;charset=UTF-8");
		}

		[HttpGet("content/{template?}")]
		public IActionResult Nested([FromQuery]string template)
		{
			if (string.IsNullOrEmpty(template) || !SharedResource.Jsons.ContainsKey(template.ToLowerInvariant())) 
				return File(SharedResource.Index, "text/html;charset=UTF-8");
			var index = SharedResource.CreateIndex(template);
			return File(Encoding.UTF8.GetBytes(index), "text/html;charset=UTF-8");
		}

		[HttpGet("static/{file}")]
		public IActionResult Static(string file)
		{
			var name = "static/" + file.ToLowerInvariant().Trim();
			FileInfo fi;
			if (!ResourceFiles.TryGetValue(name, out fi) || !fi.Exists) return NotFound();
			return PhysicalFile(fi.FullName, file.EndsWith(".css") ? "text/css" : "application/javascript");
		}

		[HttpGet("js/{file}")]
		public IActionResult JS(string file)
		{

			var name = "js/" + file.ToLowerInvariant().Trim();
			FileInfo fi;
			if (!ResourceFiles.TryGetValue(name, out fi) || !fi.Exists) return NotFound();
			return PhysicalFile(fi.FullName, "application/javascript");
		}

		[HttpGet("examples/{file}")]
		public IActionResult Examples(string file)
		{
			var name = "examples/" + file.ToLowerInvariant().Trim();
			FileInfo fi;
			if (!ResourceFiles.TryGetValue(name, out fi) || !fi.Exists) return NotFound();
			return PhysicalFile(fi.FullName, "text/json");
		}

		[HttpGet("templates/{file}")]
		public IActionResult Templates(string file, [FromQuery] string withSchema)
		{
			var templateName = "templates/" + file.ToLowerInvariant().Trim();
			var jsonName = "examples/" + file.ToLowerInvariant().Trim() + ".json";
			FileInfo fi, jfi;
			if (!ResourceFiles.TryGetValue(templateName, out fi) || !fi.Exists) return NotFound();
			if (!ResourceFiles.TryGetValue(jsonName, out jfi) || !jfi.Exists) return NotFound();
			if ("true".Equals(withSchema, StringComparison.OrdinalIgnoreCase)) 
			{
				string jsonString = System.IO.File.ReadAllText(jfi.FullName);
				MemoryStream ms;
				try 
				{
					ms = Process(fi, jsonString, true, false);
				} 
				catch (OperationCanceledException) 
				{
					return StatusCode(429, "Processing the request took too long. Processing canceled");
				}
				return File(ms, MimeType(file), file);
			}
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
			public string pdf { get; set; }
			public bool debugLog { get; set; }
		}

		private MemoryStream Process(FileInfo fi, string argument, bool asSchema, bool debugLog)
		{
			var cts = new CancellationTokenSource();
			//if processing does not finish within specified timeout (default 30 seconds),
			//cancel the run which will throw OperationCancelledException
			if (SharedResource.Timeout > 0)
				cts.CancelAfter(SharedResource.Timeout * 1000);
			var ms = new MemoryStream();
			var factory = asSchema ? SchemaFactory : debugLog ? DebugFactory : DocumentFactory;
			using (var input = System.IO.File.Open(fi.FullName, FileMode.Open, FileAccess.Read))
			using (var doc = factory.Open(input, fi.Extension, ms, cts.Token))
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
			if (arg == null || string.IsNullOrEmpty(arg.template)) return NotFound();
			var name = "templates/" + arg.template.ToLowerInvariant().Trim();
			FileInfo fi;
			if (!ResourceFiles.TryGetValue(name, out fi) || !fi.Exists) return NotFound();
			MemoryStream ms;
			try
			{
				ms = Process(fi, arg.json, false, arg.debugLog);
			} 
			catch (OperationCanceledException) 
			{
				return StatusCode(429, "Processing the request took too long. Processing canceled");
			}				
			if (arg.toPdf)
				return ConvertToPdf(ms, arg.template, arg.pdf);
			return File(ms, MimeType(arg.template), arg.template);
		}

		private IActionResult ConvertToPdf(MemoryStream ms, string template, string use)
		{
			try
			{
				var converters = !string.IsNullOrEmpty(use) && SharedResource.PdfConverters.ContainsKey(use)
					? new[] { SharedResource.PdfConverters[use] }
					: SharedResource.PdfConverters.Values.ToArray();
				foreach (var pdf in converters)
				{
					var result = pdf.Convert(ms, Path.GetExtension(template));
					return File(result, "application/pdf", Path.GetFileNameWithoutExtension(template) + ".pdf");
				}
			}
			catch (TimeoutException)
			{
				return StatusCode(503, "Timeout waiting for PDF conversion");
			}
			catch { }
			return StatusCode(500, "PDF conversion failed");
		}
	}
}
