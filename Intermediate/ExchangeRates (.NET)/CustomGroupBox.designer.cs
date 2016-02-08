namespace ExchangeRates
{
	partial class CustomGroupBox
	{
		/// <summary>
		/// Required designer variable.
		/// </summary>
		private System.ComponentModel.IContainer components = null;

		/// <summary>
		/// Clean up any resources being used.
		/// </summary>
		/// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
		protected override void Dispose(bool disposing)
		{
			if (titlePath != null)
				titlePath.Dispose();
			if (bodyPath != null)
				bodyPath.Dispose();
			if (mFormat != null)
				mFormat.Dispose();
			if (fontBrush != null)
				fontBrush.Dispose();

			timerChange.Stop();
			timerMouse.Stop();
			timerChange = null;
			timerMouse = null;

			if (disposing && (components != null))
			{
				components.Dispose();
			}
			if (!InvokeRequired)
				base.Dispose(disposing);
		}

		#region Component Designer generated code

		/// <summary>
		/// Required method for Designer support - do not modify 
		/// the contents of this method with the code editor.
		/// </summary>
		private void InitializeComponent()
		{
			components = new System.ComponentModel.Container();
		}

		#endregion
	}
}
