using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using HtmlAgilityPack;
using NGS.Templater;

namespace HtmlAsXml
{
	public class Program
	{

		public static void Main(string[] args)
		{
			var hap = new HtmlDocument();
			hap.LoadHtml(File.ReadAllText("template/document.html"));
			hap.OptionOutputAsXml = true;
			var ms = new MemoryStream();
			hap.Save(ms);
			ms.Position = 0;

			var map = new Dictionary<string, object>();
			var customer = new Dictionary<string, object>();
			map.Add("title", "HTML generated from Templater");
			map.Add("invoice.number", "123456");
			map.Add("invoice.created", "Yesterday");
			map.Add("invoice.due", "Tomorrow");
			map.Add("customer", customer);
			customer.Add("name", "John Doe");
			customer.Add("address", "Zagreb, Croatia");
			customer.Add("email", "john.doe@example.com");
			map["payment"] = new Dictionary<string, object> {
				{ "method", "Cash" },
				{ "description", "Amount" },
				{ "details", "EUR 1000" }
			};
			map.Add("invoice.total", "8997");
			map.Add("items", new[]{
				new Dictionary<string, object> { {"description", "Reporting" }, {"amount", "999" } },
				new Dictionary<string, object> { { "description", "Enterprise" },{"amount", "2999" } },
				new Dictionary<string, object> { {"description", "Jumpstart"},{ "amount", "4999" } }
			});
			using (var fs = File.Create("result.html"))
			using (var doc = Configuration.Factory.Open(ms, "xml", fs))
			{
				doc.Process(map);
			}
			Process.Start(new ProcessStartInfo("result.html") { UseShellExecute = true });
		}
	}
}
