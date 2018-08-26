using System;
using System.Drawing;

namespace CollapseRegion
{
	public class Loan
	{
		private string bank;
		private decimal amount;
		private Color color;

		public Loan(String bank, decimal amount, Color color)
		{
			this.bank = bank;
			this.amount = amount;
			this.color = color;
		}

		public String getBank()
		{
			return bank;
		}

		public decimal getAmount()
		{
			return amount;
		}

		public Color getColor()
		{
			return color;
		}
	}
}
