using Aspose.Words;
using System.IO;

namespace TemplaterServer.src
{
	public class Aspose : PdfConverter
	{
		public Stream Convert(Stream template, string extension)
		{
			var doc = new Document(template);
			var ms = new MemoryStream();
			doc.Save(ms, SaveFormat.Pdf);
			ms.Position = 0;
			return ms;
		}
	}
}
