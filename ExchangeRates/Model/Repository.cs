using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Xml.Linq;

namespace ExchangeRates.Model
{
	public class Repository
	{
		public Repository()
		{
			Threading.RunSafeThread(DownloadData);
		}

		private void DownloadData()
		{
			var webClient = new WebClient();
			var result = webClient.DownloadData(new Uri("http://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist-90d.xml"));
			var xml = XDocument.Parse(webClient.Encoding.GetString(result));
			var items =
				from cube in xml.Root.Element(XName.Get("Cube", "http://www.ecb.int/vocabulary/2002-08-01/eurofxref")).Elements()
				from currency in cube.Elements()
				select new
				{
					Date = cube.Attribute("time").Value,
					Currency = currency.Attribute("currency").Value,
					Rate = currency.Attribute("rate").Value
				};
			dataList =
				(from item in items
				 group item by item.Date into g
				 let usd = g.FirstOrDefault(it => it.Currency == "USD")
				 let gbp = g.FirstOrDefault(it => it.Currency == "GBP")
				 let chf = g.FirstOrDefault(it => it.Currency == "CHF")
				 orderby g.Key
				 select new CurrencyRate
				 {
					 Date = DateTime.Parse(g.Key, CultureInfo.InvariantCulture),
					 USD = usd != null ? double.Parse(usd.Rate, CultureInfo.InvariantCulture) : 0,
					 GBP = gbp != null ? double.Parse(gbp.Rate, CultureInfo.InvariantCulture) : 0,
					 CHF = chf != null ? double.Parse(chf.Rate, CultureInfo.InvariantCulture) : 0
				 })
				.ToList();
		}

		public event EventHandler Downloading = (s, ea) => { };

		private List<CurrencyRate> dataList;
		public IEnumerable<CurrencyRate> Data
		{
			get
			{
				if (dataList == null)
				{
					Downloading(this, EventArgs.Empty);
					DownloadData();
				}
				return dataList;
			}
		}
	}
}
