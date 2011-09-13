namespace ExchangeRates
{
	partial class ExchangeRateGraph
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

		#region Component Designer generated code

		/// <summary> 
		/// Required method for Designer support - do not modify 
		/// the contents of this method with the code editor.
		/// </summary>
		private void InitializeComponent()
		{
			this.zedGraph = new ZedGraph.ZedGraphControl();
			this.SuspendLayout();
			// 
			// zedGraph
			// 
			this.zedGraph.Dock = System.Windows.Forms.DockStyle.Fill;
			this.zedGraph.Location = new System.Drawing.Point(0, 0);
			this.zedGraph.Name = "zedGraph";
			this.zedGraph.ScrollGrace = 0D;
			this.zedGraph.ScrollMaxX = 0D;
			this.zedGraph.ScrollMaxY = 0D;
			this.zedGraph.ScrollMaxY2 = 0D;
			this.zedGraph.ScrollMinX = 0D;
			this.zedGraph.ScrollMinY = 0D;
			this.zedGraph.ScrollMinY2 = 0D;
			this.zedGraph.Size = new System.Drawing.Size(459, 263);
			this.zedGraph.TabIndex = 0;
			// 
			// ExchangeRateGraph
			// 
			this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
			this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
			this.Controls.Add(this.zedGraph);
			this.Name = "ExchangeRateGraph";
			this.Size = new System.Drawing.Size(459, 263);
			this.ResumeLayout(false);

		}

		#endregion

		private ZedGraph.ZedGraphControl zedGraph;
	}
}
