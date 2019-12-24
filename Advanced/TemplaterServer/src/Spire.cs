using Spire.Doc;
using System.IO;

namespace TemplaterServer
{
	public class Spire : PdfConverter
	{
		public Stream Convert(Stream template, string extension)
		{
			var doc = new Document();
			doc.LoadFromStream(template, FileFormat.Docx);
			var ms = new MemoryStream();
			doc.SaveToStream(ms, FileFormat.PDF);
			ms.Position = 0;
			return ms;
		}
	}
}
