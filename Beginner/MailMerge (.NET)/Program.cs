using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using NGS.Templater;

namespace MailMerge
{
	public class Program
	{
		public static void Main(string[] args)
		{
			var csv = File.ReadAllLines("data.csv");
			var data =
				(from line in csv.Skip(1)
				 let values = line.Split(',')
				 let img = File.Exists(values[2]) ? Image.FromFile(values[2]) : null
				 select new { Name = values[0], date = values[1], signature = img })
				.ToList();
			File.Copy("letter.docx", "merge.docx", true);
			using (var doc = Configuration.Factory.Open("merge.docx"))
			{
				doc.Process(data);
			}
			Process.Start("merge.docx");
		}
	}
}
