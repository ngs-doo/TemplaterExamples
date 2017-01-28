using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using NGS.Templater;

namespace MailMerge
{
	public class Program
	{
		struct ImageReference
		{
			public readonly string Value;
			public ImageReference(string value)
			{
				this.Value = value;
			}
		}

		private static object ImageReferenceReplacer(object value)
		{
			if (value is ImageReference)
			{
				var ir = (ImageReference)value;
				if (File.Exists(ir.Value)) return Image.FromFile(ir.Value);
				return null;
			}
			return value;
		}

		public static void Main(string[] args)
		{
			var csv = File.ReadAllLines("data.csv");
			var data =
				(from line in csv.Skip(1)
				 let values = line.Split(',')
				 let img = File.Exists(values[2]) ? Image.FromFile(values[2]) : null
				 select new
				 {
					 Name = values[0],
					 date = values[1],
					 signature = img,
					 customSignature = new ImageReference(values[2])
				 })
				.ToList();
			File.Copy("letter.docx", "merge.docx", true);
			using (var doc = Configuration.Builder.Include(ImageReferenceReplacer).Build().Open("merge.docx"))
			{
				doc.Process(data);
			}
			Process.Start("merge.docx");
		}
	}
}
