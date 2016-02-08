using System.Diagnostics;
using NGS.Templater;

namespace SimpleDocument
{
	class Program
	{
		static void Main(string[] args)
		{
			var myFile = "MyDocument.docx";
			var data = new { Tag = "an example" };

			// Please rebuild your application before starting it
			// to copy the original template into the output folder

			using (var document = Configuration.Factory.Open(myFile))
			{
				document.Process(data);
			}

			Process.Start(myFile);
		}
	}
}
