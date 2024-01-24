using System.Diagnostics;
using System.Drawing;
using System.IO;
using NGS.Templater;

namespace ImageExample
{
	public class Program
	{
		public static void Main(string[] args)
		{
			File.Copy("template/Picture.docx", "Image.docx", true);
			var image = Image.FromFile("template/Chuck_Norris.jpg");
			//On modern .NET Images are not supported out of the box, so we need to manually activate image plugin.
			//Otherwise we would need to use ImageInfo type from Templater
			using (var doc = Configuration.Builder.BuiltInLowLevelPlugins(true).Build().Open("Image.docx"))
			{
				//we can even use low level API to change tags directly
				doc.Templater.Replace("picture", image);
			}
			Process.Start(new ProcessStartInfo("Image.docx") { UseShellExecute = true });
		}
	}
}
