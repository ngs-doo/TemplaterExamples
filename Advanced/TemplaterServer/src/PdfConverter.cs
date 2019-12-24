using System.IO;

namespace TemplaterServer
{
	public interface PdfConverter
	{
		Stream Convert(Stream template, string extension);
	}
}
