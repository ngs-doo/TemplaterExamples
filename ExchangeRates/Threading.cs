using System;
using System.Threading;
using System.Windows.Forms;

namespace ExchangeRates
{
	public static class Threading
	{
		public static void RunSafeThread(Action action)
		{
			ThreadPool.QueueUserWorkItem(_ =>
			{
				try
				{
					action();
				}
				catch (Exception ex)
				{
					ExceptionHandler.Log(ex);
				}
			});
		}

		public static void SafeInvokeAsync(Control ctr, Action action)
		{
			if (ctr == null || ctr.IsDisposed)
				return;

			if (ctr.InvokeRequired)
				ctr.BeginInvoke(action);
			else
				action();
		}
	}
}
