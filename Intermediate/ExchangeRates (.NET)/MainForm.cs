using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Windows.Forms;
using ExchangeRates.Model;

namespace ExchangeRates
{
	public partial class MainForm : Form
	{
		private readonly Repository Currencies = new Repository();

		public MainForm()
		{
			InitializeComponent();
		}

		private void btnDownload_Click(object sender, EventArgs e)
		{
			tssStatus.Text = "Downloading data...";
			btnDownload.Enabled = false;
			Currencies.Downloading += Currencies_Downloading;
			Threading.RunSafeThread(DownloadData);
		}

		private void DownloadData()
		{
			try
			{
				var data = Currencies.Data.ToList();
				Threading.SafeInvokeAsync(this, () => PopulateData(data));
			}
			catch
			{
				Threading.SafeInvokeAsync(this, DownloadFailed);
				throw;
			}
			finally
			{
				Threading.SafeInvokeAsync(this, DownloadCompleted);
			}
		}

		private void DownloadFailed()
		{
			DownloadCompleted();
			btnDownload.Enabled = true;
		}

		private void DownloadCompleted()
		{
			Currencies.Downloading -= Currencies_Downloading;
			waitPicture.Visible = false;
			waitPicture.SendToBack();
			tssStatus.Text = "Ready";
		}

		private void PopulateData(IEnumerable<CurrencyRate> data)
		{
			var list = data.ToList();
			exchangeRate.SetRange("Rate vs EUR", list.Min(it => it.Date), list.Max(it => it.Date));
			exchangeRate.AddData("USD", list.Select(it => ExchangeRateGraph.DataPair.Create(it.Date, it.USD)), Color.Blue);
			exchangeRate.AddData("GBP", list.Select(it => ExchangeRateGraph.DataPair.Create(it.Date, it.GBP)), Color.Red);
			exchangeRate.AddData("CHF", list.Select(it => ExchangeRateGraph.DataPair.Create(it.Date, it.CHF)), Color.Green);
			btnReport.Enabled = true;
		}

		private void Currencies_Downloading(object sender, EventArgs e)
		{
			Threading.SafeInvokeAsync(
				this,
				() =>
				{
					waitPicture.Visible = true;
					waitPicture.BringToFront();
				});
		}

		private void btnReport_Click(object sender, EventArgs e)
		{
			tssStatus.Text = "Creating report...";
			Templater.Process(Currencies.Data, exchangeRate.GetImage());
			tssStatus.Text = "Ready";
		}
	}
}
