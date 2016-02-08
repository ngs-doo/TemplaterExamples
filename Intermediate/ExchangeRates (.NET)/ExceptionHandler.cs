using System;
using System.Windows.Forms;

namespace ExchangeRates
{
	public static class ExceptionHandler
	{
		public static void Log(Exception ex)
		{
			if (ex != null)
				MessageBox.Show(ex.ToString());
		}
	}
}
