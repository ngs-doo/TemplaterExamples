using System;
using System.Threading;
using System.Windows.Forms;

namespace IsoCountries
{
	public static class Threading
	{
		public static void RunSafeThread(Action action)
		{
			ThreadPool.QueueUserWorkItem(o =>
			{
				try
				{
					action();
				}
				catch (Exception ex)
				{
					MessageBox.Show(ex.ToString());
				}
			});
		}

		public static void SafeInvoke(Control ctr, Action action)
		{
			if (ctr == null || ctr.IsDisposed)
				return;

			if (ctr.InvokeRequired)
				ctr.Invoke(action);
			else
				action();
		}
	}
}
