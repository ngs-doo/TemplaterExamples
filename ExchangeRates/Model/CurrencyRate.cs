using System;

namespace ExchangeRates.Model
{
	public class CurrencyRate
	{
		public DateTime Date { get; set; }
		public double USD { get; set; }
		public double CHF { get; set; }
		public double GBP { get; set; }
	}
}
