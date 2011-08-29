namespace IsoCountries
{
	partial class frmCountries
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
			this.gbDownload = new System.Windows.Forms.GroupBox();
			this.btnDownload = new System.Windows.Forms.Button();
			this.isoLink = new System.Windows.Forms.LinkLabel();
			this.label1 = new System.Windows.Forms.Label();
			this.btnDocument = new System.Windows.Forms.Button();
			this.dgvCountries = new System.Windows.Forms.DataGridView();
			this.ColumnName = new System.Windows.Forms.DataGridViewTextBoxColumn();
			this.ColumnCode = new System.Windows.Forms.DataGridViewTextBoxColumn();
			this.statusBar = new System.Windows.Forms.StatusStrip();
			this.tssStatus = new System.Windows.Forms.ToolStripStatusLabel();
			this.gbDownload.SuspendLayout();
			((System.ComponentModel.ISupportInitialize)(this.dgvCountries)).BeginInit();
			this.statusBar.SuspendLayout();
			this.SuspendLayout();
			// 
			// gbDownload
			// 
			this.gbDownload.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
			this.gbDownload.Controls.Add(this.btnDownload);
			this.gbDownload.Controls.Add(this.isoLink);
			this.gbDownload.Controls.Add(this.label1);
			this.gbDownload.Controls.Add(this.btnDocument);
			this.gbDownload.Location = new System.Drawing.Point(13, 11);
			this.gbDownload.Name = "gbDownload";
			this.gbDownload.Size = new System.Drawing.Size(390, 60);
			this.gbDownload.TabIndex = 0;
			this.gbDownload.TabStop = false;
			this.gbDownload.Text = "Info";
			// 
			// btnDownload
			// 
			this.btnDownload.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
			this.btnDownload.Location = new System.Drawing.Point(262, 20);
			this.btnDownload.Name = "btnDownload";
			this.btnDownload.Size = new System.Drawing.Size(109, 29);
			this.btnDownload.TabIndex = 2;
			this.btnDownload.Text = "&Download";
			this.btnDownload.UseVisualStyleBackColor = true;
			this.btnDownload.Click += new System.EventHandler(this.btnDownload_Click);
			// 
			// isoLink
			// 
			this.isoLink.AutoSize = true;
			this.isoLink.Location = new System.Drawing.Point(42, 26);
			this.isoLink.Name = "isoLink";
			this.isoLink.Size = new System.Drawing.Size(205, 13);
			this.isoLink.TabIndex = 1;
			this.isoLink.TabStop = true;
			this.isoLink.Text = "http://www.iso.org/iso/list-en1-semic-3.txt";
			// 
			// label1
			// 
			this.label1.AutoSize = true;
			this.label1.Location = new System.Drawing.Point(16, 26);
			this.label1.Name = "label1";
			this.label1.Size = new System.Drawing.Size(20, 13);
			this.label1.TabIndex = 0;
			this.label1.Text = "Uri";
			// 
			// btnDocument
			// 
			this.btnDocument.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
			this.btnDocument.Location = new System.Drawing.Point(262, 20);
			this.btnDocument.Name = "btnDocument";
			this.btnDocument.Size = new System.Drawing.Size(109, 29);
			this.btnDocument.TabIndex = 4;
			this.btnDocument.Text = "&Create document";
			this.btnDocument.UseVisualStyleBackColor = true;
			this.btnDocument.Visible = false;
			this.btnDocument.Click += new System.EventHandler(this.btnDocument_Click);
			// 
			// dgvCountries
			// 
			this.dgvCountries.AllowUserToAddRows = false;
			this.dgvCountries.AllowUserToDeleteRows = false;
			this.dgvCountries.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
			this.dgvCountries.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
			this.dgvCountries.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.ColumnName,
            this.ColumnCode});
			this.dgvCountries.Location = new System.Drawing.Point(13, 77);
			this.dgvCountries.MultiSelect = false;
			this.dgvCountries.Name = "dgvCountries";
			this.dgvCountries.ReadOnly = true;
			this.dgvCountries.SelectionMode = System.Windows.Forms.DataGridViewSelectionMode.FullRowSelect;
			this.dgvCountries.Size = new System.Drawing.Size(382, 341);
			this.dgvCountries.TabIndex = 1;
			// 
			// ColumnName
			// 
			this.ColumnName.AutoSizeMode = System.Windows.Forms.DataGridViewAutoSizeColumnMode.Fill;
			this.ColumnName.DataPropertyName = "Name";
			this.ColumnName.HeaderText = "Name";
			this.ColumnName.Name = "ColumnName";
			this.ColumnName.ReadOnly = true;
			// 
			// ColumnCode
			// 
			this.ColumnCode.DataPropertyName = "Code";
			this.ColumnCode.HeaderText = "Code";
			this.ColumnCode.Name = "ColumnCode";
			this.ColumnCode.ReadOnly = true;
			// 
			// statusBar
			// 
			this.statusBar.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.tssStatus});
			this.statusBar.Location = new System.Drawing.Point(0, 421);
			this.statusBar.Name = "statusBar";
			this.statusBar.Size = new System.Drawing.Size(414, 22);
			this.statusBar.TabIndex = 2;
			// 
			// tssStatus
			// 
			this.tssStatus.Name = "tssStatus";
			this.tssStatus.Size = new System.Drawing.Size(0, 17);
			// 
			// frmCountries
			// 
			this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
			this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
			this.ClientSize = new System.Drawing.Size(414, 443);
			this.Controls.Add(this.statusBar);
			this.Controls.Add(this.dgvCountries);
			this.Controls.Add(this.gbDownload);
			this.MinimumSize = new System.Drawing.Size(420, 250);
			this.Name = "frmCountries";
			this.Text = "List of iso countries";
			this.gbDownload.ResumeLayout(false);
			this.gbDownload.PerformLayout();
			((System.ComponentModel.ISupportInitialize)(this.dgvCountries)).EndInit();
			this.statusBar.ResumeLayout(false);
			this.statusBar.PerformLayout();
			this.ResumeLayout(false);
			this.PerformLayout();

		}

		#endregion

		private System.Windows.Forms.GroupBox gbDownload;
		private System.Windows.Forms.Button btnDownload;
		private System.Windows.Forms.LinkLabel isoLink;
		private System.Windows.Forms.Label label1;
		private System.Windows.Forms.Button btnDocument;
		private System.Windows.Forms.DataGridView dgvCountries;
		private System.Windows.Forms.DataGridViewTextBoxColumn ColumnName;
		private System.Windows.Forms.DataGridViewTextBoxColumn ColumnCode;
		private System.Windows.Forms.StatusStrip statusBar;
		private System.Windows.Forms.ToolStripStatusLabel tssStatus;
	}
}

