using System;
using System.Collections;
using System.Diagnostics;
using System.Windows.Forms;

namespace IsoCountries
{
	public partial class MainForm : Form
	{
		public MainForm()
		{
			InitializeComponent();
		}

		private void btnDownload_Click(object sender, EventArgs e)
		{
			btnDownload.Enabled = false;
			tssStatus.Text = "Downloading...";

			WebCountries.Download(
				isoLink.Text,
				data => Threading.SafeInvoke(this, () => OnDownload(data)));
		}

		private void OnDownload(IEnumerable data)
		{
			tssStatus.Text = "Ready.";
			btnDownload.Enabled = true;
			dgvCountries.DataSource = data;

			btnDownload.Visible = data == null;
			btnDocument.Visible = data != null;
		}

		private void btnDocument_Click(object sender, EventArgs e)
		{
			tssStatus.Text = "Creating document...";
			ReportEngine.Populate(
				dgvCountries.DataSource as IEnumerable,
				file => Threading.SafeInvoke(this, () => OnReport(file)));
		}

		private void OnReport(string file)
		{
			tssStatus.Text = "Ready.";
			Process.Start(new ProcessStartInfo(file) { UseShellExecute = true });
		}

		private void isoLink_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
		{
			Process.Start(new ProcessStartInfo(isoLink.Text) { UseShellExecute = true });
		}
	}
}
