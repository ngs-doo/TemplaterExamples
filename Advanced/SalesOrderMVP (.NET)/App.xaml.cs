using System.Windows;
using SalesOrderMVP.Presenters;

namespace SalesOrderMVP
{
	public partial class App : Application
	{
		protected override void OnStartup(StartupEventArgs e)
		{
			var shell = new Shell();
			shell.DataContext = new SalesOrderPresenter();
			shell.Show();
		}
	}
}
