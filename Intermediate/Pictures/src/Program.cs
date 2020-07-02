using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Xml;
using System.Xml.Linq;
using NGS.Templater;

namespace Pictures
{
	public class Program
	{
		class Car
		{
			public readonly string name;
			//Templater recognizes Image data type and will convert it into Templater specific ImageInfo
			public readonly Image image;

			public Car(string name, string image)
			{
				this.name = name;
				this.image = Image.FromFile("template/" + image);
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

		class SvgDoc
		{
			public readonly string name;
			public readonly string description;
			public readonly XDocument document;

			public SvgDoc(string name, string description, string path)
			{
				this.name = name;
				this.description = description;
				this.document = XDocument.Load("template/" + path);
			}
		}

		static object ImageLoader(object value, string metadata)
		{
			//Plugin can be used to convert string into an Image type which Templater recognizes
			if (metadata == "from-resource" && value is string)
				return Image.FromFile("template/" + value);
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
					//Before passing image for processing it can be manipulated via Templater plugins
					bmp.SetResolution(bmp.HorizontalResolution * scale, bmp.VerticalResolution * scale);
				}
			}
			return value;
		}

		public static ImageInfo ConvertSvg(XDocument document)
		{
			var xml = new XmlDocument();
			xml.LoadXml(document.ToString());
			//don't convert first picture for example sake
			if (xml.InnerXml.StartsWith("<!--")) return null;
			var svg = Svg.SvgDocument.Open(xml);
			var bmp = svg.Draw();
			var ms = new MemoryStream();
			bmp.Save(ms, ImageFormat.Png);
			ms.Position = 0;
			return new ImageInfo(ms, "png", bmp.Width, bmp.HorizontalResolution, bmp.Height, bmp.VerticalResolution);
		}

		public static void Main(string[] args)
		{
			File.Copy("template/Pictures.docx", "Pictures.docx", true);

			var data = new Dictionary<string, object>();
			data["cars"] = new[] {
					new Car("Really fast car", "car1.gif"),
					new Car("Ford Focus", "car2.jpg"),
					new Car("Regular car", "car3.png")
			};
			data["boats"] = new[] {
					new Boat("Speadboat", "boat1.jpg"),
					new Boat("Slowboat", "boat2.png"),
					new Boat("Cruiser", "boat3.jpg")
			};
			data["svg"] = new[] {
					new SvgDoc("Cat face", "without fallback image conversion - works only in MS Word 2016+", "cat_face.svg"), //Icon made by Freepik from www.flaticon.com
					new SvgDoc("Happy cat", "with fallback image conversion", "cat_happy.svg") //Icon made by Smashicons from www.flaticon.com
			};
			data["placeholder"] = Image.FromFile("template/unicorn.jpg");
			var factory = Configuration.Builder
				.Include(ImageLoader)//setup image loading via from-resource metadata
				.Include(ImageMaxSize)//setup image resizing via maxSize(X, Y) metadata
				.SvgConverter(ConvertSvg)
				.Build();
			using (var doc = factory.Open("Pictures.docx"))
			{
				doc.Process(data);
			}
			Process.Start(new ProcessStartInfo("Pictures.docx") { UseShellExecute = true });
		}
	}
}
