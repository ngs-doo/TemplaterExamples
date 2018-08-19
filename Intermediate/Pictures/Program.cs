using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using NGS.Templater;

namespace Pictures
{
	public class Program
	{
		class Car
		{
			public readonly string name;
			public readonly Image image;

			public Car(string name, string image)
			{
				this.name = name;
				this.image = Image.FromFile("template" + image);
			}
		}

		class Boat
		{
			public string name;
			public string picture;

			public Boat(string name, string picture)
			{
				this.name = name;
				this.picture = picture;
			}
		}

		static object ImageLoader(object value, string metadata)
		{
			if (metadata == "from-resource" && value is string)
				return Image.FromFile("template" + value);
			return value;
		}

		static object ImageMaxSize(object value, string metadata)
		{
			var bmp = value as Bitmap;
			if (metadata.StartsWith("maxSize(") && bmp != null)
			{
				var parts = metadata.Substring(8, metadata.Length - 9).Split(',');
				var maxWidth = int.Parse(parts[0].Trim()) * 28;
				var maxHeight = int.Parse(parts[parts.Length - 1].Trim()) * 28;
				if (bmp.Width > 0 && maxWidth > 0 && bmp.Width > maxWidth || bmp.Height > 0 && maxHeight > 0 && bmp.Height > maxHeight)
				{
					var widthScale = 1f * bmp.Width / maxWidth;
					var heightScale = 1f * bmp.Height / maxHeight;
					var scale = Math.Max(widthScale, heightScale);
					bmp.SetResolution(bmp.HorizontalResolution * scale, bmp.VerticalResolution * scale);
				}
			}
			return value;
		}

		public static void Main(string[] args)
		{
			File.Copy("template/Pictures.docx", "Pictures.docx", true);

			var data = new Dictionary<string, object>();
			data["cars"] = new[] {
					new Car("Really fast car", "/car1.jpg"),
					new Car("Ford Focus", "/car2.jpg"),
					new Car("Regular car", "/car3.png")
			};
			data["boats"] = new[] {
					new Boat("Speadboat", "/boat1.jpg"),
					new Boat("Slowboat", "/boat2.png"),
					new Boat("Cruiser", "/boat3.jpg")
			};
			var factory = Configuration.Builder.Include(ImageLoader).Include(ImageMaxSize).Build();
			using (var doc = factory.Open("Pictures.docx"))
			{
				doc.Process(data);
			}
			Process.Start("Pictures.docx");
		}
	}
}
