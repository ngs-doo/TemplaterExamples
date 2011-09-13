using System;
using System.Windows.Forms;

namespace ExchangeRates
{
	static class Program
	{
		[STAThread]
		static void Main()
		{
			Application.EnableVisualStyles();
			Application.SetCompatibleTextRenderingDefault(false);
			Application.SetUnhandledExceptionMode(UnhandledExceptionMode.CatchException);
			Application.ThreadException += (s, ea) => ExceptionHandler.Log(ea.Exception);
			AppDomain.CurrentDomain.UnhandledException += (s, ea) => ExceptionHandler.Log(ea.ExceptionObject as Exception);
			Application.Run(new MainForm());
		}
	}
}
