namespace ExchangeRates
{
	partial class MainForm
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
			if (disposing && (components != null))
			{
				components.Dispose();
			}
			base.Dispose(disposing);
		}

		#region Windows Form Designer generated code

		/// <summary>
		/// Required method for Designer support - do not modify
		/// the contents of this method with the code editor.
		/// </summary>
		private void InitializeComponent()
		{
			System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(MainForm));
			this.mainStrip = new System.Windows.Forms.StatusStrip();
			this.tssStatus = new System.Windows.Forms.ToolStripStatusLabel();
			this.waitPicture = new System.Windows.Forms.PictureBox();
			this.gbInfo = new ExchangeRates.CustomGroupBox();
			this.lblMsg = new System.Windows.Forms.Label();
			this.btnReport = new System.Windows.Forms.Button();
			this.btnDownload = new System.Windows.Forms.Button();
			this.exchangeRate = new ExchangeRates.ExchangeRateGraph();
			this.mainStrip.SuspendLayout();
			((System.ComponentModel.ISupportInitialize)(this.waitPicture)).BeginInit();
			((System.ComponentModel.ISupportInitialize)(this.gbInfo)).BeginInit();
			this.gbInfo.SuspendLayout();
			this.SuspendLayout();
			// 
			// mainStrip
			// 
			this.mainStrip.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.tssStatus});
			this.mainStrip.Location = new System.Drawing.Point(0, 416);
			this.mainStrip.Name = "mainStrip";
			this.mainStrip.Size = new System.Drawing.Size(499, 22);
			this.mainStrip.TabIndex = 2;
			this.mainStrip.Text = "statusStrip1";
			// 
			// tssStatus
			// 
			this.tssStatus.Name = "tssStatus";
			this.tssStatus.Size = new System.Drawing.Size(0, 17);
			// 
			// waitPicture
			// 
			this.waitPicture.Anchor = System.Windows.Forms.AnchorStyles.None;
			this.waitPicture.BackColor = System.Drawing.Color.Transparent;
			this.waitPicture.Image = global::ExchangeRates.Properties.Resources.wait;
			this.waitPicture.Location = new System.Drawing.Point(213, 175);
			this.waitPicture.Name = "waitPicture";
			this.waitPicture.Size = new System.Drawing.Size(100, 100);
			this.waitPicture.TabIndex = 4;
			this.waitPicture.TabStop = false;
			this.waitPicture.Visible = false;
			// 
			// gbInfo
			// 
			this.gbInfo.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
			this.gbInfo.BackColor = System.Drawing.Color.Transparent;
			this.gbInfo.BorderColor = System.Drawing.SystemColors.WindowText;
			this.gbInfo.Controls.Add(this.lblMsg);
			this.gbInfo.Controls.Add(this.btnReport);
			this.gbInfo.Controls.Add(this.btnDownload);
			this.gbInfo.DefaultColor = System.Drawing.SystemColors.Control;
			this.gbInfo.Location = new System.Drawing.Point(12, 12);
			this.gbInfo.MiddleActiveColor = System.Drawing.SystemColors.ControlLightLight;
			this.gbInfo.MiddleInactiveColor = System.Drawing.SystemColors.Control;
			this.gbInfo.Name = "gbInfo";
			this.gbInfo.Size = new System.Drawing.Size(475, 112);
			this.gbInfo.TabIndex = 3;
			this.gbInfo.TabStop = false;
			this.gbInfo.Text = "Info";
			// 
			// lblMsg
			// 
			this.lblMsg.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
			this.lblMsg.BackColor = System.Drawing.Color.Transparent;
			this.lblMsg.Location = new System.Drawing.Point(14, 24);
			this.lblMsg.Name = "lblMsg";
			this.lblMsg.Size = new System.Drawing.Size(339, 83);
			this.lblMsg.TabIndex = 4;
			this.lblMsg.Text = resources.GetString("lblMsg.Text");
			// 
			// btnReport
			// 
			this.btnReport.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
			this.btnReport.BackColor = System.Drawing.Color.Transparent;
			this.btnReport.Enabled = false;
			this.btnReport.Location = new System.Drawing.Point(364, 65);
			this.btnReport.Name = "btnReport";
			this.btnReport.Size = new System.Drawing.Size(105, 28);
			this.btnReport.TabIndex = 2;
			this.btnReport.Text = "Create report";
			this.btnReport.UseVisualStyleBackColor = false;
			this.btnReport.Click += new System.EventHandler(this.btnReport_Click);
			// 
			// btnDownload
			// 
			this.btnDownload.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
			this.btnDownload.BackColor = System.Drawing.Color.Transparent;
			this.btnDownload.Location = new System.Drawing.Point(364, 31);
			this.btnDownload.Name = "btnDownload";
			this.btnDownload.Size = new System.Drawing.Size(105, 28);
			this.btnDownload.TabIndex = 1;
			this.btnDownload.Text = "Download data";
			this.btnDownload.UseVisualStyleBackColor = false;
			this.btnDownload.Click += new System.EventHandler(this.btnDownload_Click);
			// 
			// exchangeRate
			// 
			this.exchangeRate.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
			this.exchangeRate.Location = new System.Drawing.Point(12, 130);
			this.exchangeRate.Name = "exchangeRate";
			this.exchangeRate.Size = new System.Drawing.Size(475, 283);
			this.exchangeRate.TabIndex = 0;
			// 
			// MainForm
			// 
			this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
			this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
			this.ClientSize = new System.Drawing.Size(499, 438);
			this.Controls.Add(this.gbInfo);
			this.Controls.Add(this.mainStrip);
			this.Controls.Add(this.exchangeRate);
			this.Controls.Add(this.waitPicture);
			this.MinimumSize = new System.Drawing.Size(319, 352);
			this.Name = "MainForm";
			this.Text = "Exchange rates";
			this.mainStrip.ResumeLayout(false);
			this.mainStrip.PerformLayout();
			((System.ComponentModel.ISupportInitialize)(this.waitPicture)).EndInit();
			((System.ComponentModel.ISupportInitialize)(this.gbInfo)).EndInit();
			this.gbInfo.ResumeLayout(false);
			this.ResumeLayout(false);
			this.PerformLayout();

		}

		#endregion

		private ExchangeRateGraph exchangeRate;
		private System.Windows.Forms.Button btnDownload;
		private System.Windows.Forms.StatusStrip mainStrip;
		private System.Windows.Forms.ToolStripStatusLabel tssStatus;
		private ExchangeRates.CustomGroupBox gbInfo;
		private System.Windows.Forms.Button btnReport;
		private System.Windows.Forms.Label lblMsg;
		private System.Windows.Forms.PictureBox waitPicture;
	}
}

