using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using NGS.Templater;

namespace SharedCollection
{
	public class Program
	{
		class Patient
		{
			public readonly string name;
			public readonly List<History> history;
			public readonly List<Medicine> medicine;

			public Patient(string name, History[] history, Medicine[] medicine)
			{
				this.name = name;
				this.history = history.ToList();
				this.medicine = medicine.ToList();
			}
		}
		class History
		{
			public readonly string description;
			public readonly int hospitalization;

			public History(string description, int hospitalization)
			{
				this.description = description;
				this.hospitalization = hospitalization;
			}
		}
		class Medicine
		{
			public readonly string name;
			public readonly int cost;
			public readonly int interval;
			public readonly int duration;

			public Medicine(string name, int cost, int interval, int duration)
			{
				this.name = name;
				this.cost = cost;
				this.interval = interval;
				this.duration = duration;
			}
		}
		static object ImageWithDPI(object value, string metadata)
		{
			if (metadata.StartsWith("dpi(") && value is string)
			{
				var dpi = int.Parse(metadata.Substring(4, metadata.Length - 5));
				var image = (Bitmap)Image.FromFile("template" + value.ToString());
				image.SetResolution(dpi, dpi);
				return image;
			}
			return value;
		}

		public static void Main(string[] args)
		{
			File.Copy("template/TwoTables.docx", "TwoTables.docx", true);
			var certificate = new X509Certificate2("template/templater.pfx", "templater");

			var data = new Dictionary<string, object>();
			data["analysis"] = "Patient info";
			var patients = new List<Patient>();
			data["patients"] = patients;
			patients.Add(
				new Patient("Kill Bill",
					new[] { new History("Sword cut", 13), new History("Knife stab", 6) },
					new[] { new Medicine("Prozac", 100, 6, 365), new Medicine("Zoloft", 120, 12, 200) }));
			patients.Add(
				new Patient("Miracle man",
					new[] { new History("Gunshot", 0) },
					new Medicine[] { }));
			patients.Add(
				new Patient("Bruce Lee",
					new[] { new History("Claw cut", 1), new History("Bruising", 0) },
					new[] { new Medicine("Vitamins", 4, 8, 365), new Medicine("Fiber", 6, 8, 365) }));

			data["imageWithDPI"] = "/java.png";

			var factory = Configuration.Builder.Include(ImageWithDPI).Sign(certificate).Build();
			using (var doc = factory.Open("TwoTables.docx"))
			{
				doc.Process(data);
			}
			Process.Start(new ProcessStartInfo("TwoTables.docx") { UseShellExecute = true });
		}
	}
}
