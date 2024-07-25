using System;
using System.Diagnostics;
using System.IO;
using System.Linq;

namespace TemplaterServer.src
{
	class LibreOffice : PdfConverter
	{
		private readonly string LibreOfficePath;
		private readonly int Timeout;

		public LibreOffice(string[] args)
		{
			int timeout = 30;
			var path = "";
			foreach(var a in args)
			{
				if (a.StartsWith("timeout="))
					timeout = int.Parse(a.Substring("timeout=".Length));
				else if (a.StartsWith("libreoffice="))
				{
					path = a.Substring("libreoffice=".Length);
				}
			}
			if (path.Length == 0)
			{
				var macFI = new FileInfo("/Applications/LibreOffice.app/Contents/MacOS/soffice");
				var linuxFI = new FileInfo("/usr/bin/libreoffice");
				var win32 = new DirectoryInfo("C:/Program Files (x86)");
				var win64 = new DirectoryInfo("C:/Program Files");
				if (macFI.Exists)
					path = macFI.ToString();
				else if (linuxFI.Exists)
					path = linuxFI.ToString();
				else 
					path = FindWindows(win32) ?? FindWindows(win64);
				if (string.IsNullOrEmpty(path))
					throw new ArgumentException("Unable to find LibreOffice on the system. Please explicitly specify it via: -libreoffice=C:/Program Files (x86)/LibreOffice 6.4/program/soffice.exe");
			}
			this.Timeout = timeout * 1000;
			this.LibreOfficePath = path;
		}
		
		private static string FindWindows(DirectoryInfo folder)
		{
			if (!folder.Exists) return null;
			var nested = folder.GetDirectories();
			if (nested == null || nested.Length == 0) return null;
			foreach (var lo in nested)
			{
				if (!lo.FullName.Contains("LibreOffice", StringComparison.OrdinalIgnoreCase)) continue;
				var file = lo.FullName.Replace('\\', '/') + "/program/soffice.exe";
				if (File.Exists(file))
					return file;
			}
			return null;
		}		

		private int FileCounter;

		public Stream Convert(Stream template, string extension)
		{
			lock (this)
			{
				var tmpPath = Path.GetTempPath();
				var fileName = "templateDocument" + (++FileCounter) + "." + extension;
				var tmpFile = Path.Combine(tmpPath, fileName);
				using (var fs = File.OpenWrite(tmpFile))
					template.CopyTo(fs);
				try
				{
					var info = new ProcessStartInfo
					{
						FileName = LibreOfficePath,
						Arguments = "--norestore --nofirststartwizard --nologo --headless --convert-to pdf " + fileName,
						WorkingDirectory = tmpPath
					};
					var conv = Process.Start(info);
					conv.Start();
					if (!conv.WaitForExit(Timeout))
						throw new TimeoutException("Timeout waiting for PDF conversion");
					var pdfFile = Path.Combine(tmpPath, Path.GetFileNameWithoutExtension(fileName) + ".pdf");
					var bytes = File.ReadAllBytes(pdfFile);
					File.Delete(pdfFile);
					return new MemoryStream(bytes);
				}
				finally
				{
					File.Delete(tmpFile);
				}
			}
		}
	}
}
