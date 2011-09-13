using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Windows.Forms;
using ZedGraph;

namespace ExchangeRates
{
	public partial class ExchangeRateGraph : UserControl
	{
		public ExchangeRateGraph()
		{
			InitializeComponent();
			zedGraph.GraphPane.Title.Text = "Exchange rates";
			zedGraph.GraphPane.XAxis.Title.Text = "Date";
			zedGraph.GraphPane.XAxis.Type = AxisType.Date;
			zedGraph.GraphPane.XAxis.Scale.MajorUnit = DateUnit.Day;
			zedGraph.GraphPane.XAxis.Scale.Format = "D";
			zedGraph.GraphPane.XAxis.Scale.MajorStep = 7;
			zedGraph.GraphPane.XAxis.Scale.MinorStep = 1;
			zedGraph.GraphPane.Legend.IsVisible = true;
			zedGraph.GraphPane.Legend.Position = LegendPos.Right;

			SetRange("Rate", DateTime.Today.AddDays(-30), DateTime.Today);
		}

		public void SetRange(string title, DateTime start, DateTime end)
		{
			zedGraph.GraphPane.YAxis.Title.Text = title;
			var today = DateTime.Today;
			zedGraph.GraphPane.XAxis.Scale.Min = start.ToOADate();
			zedGraph.GraphPane.XAxis.Scale.Max = end.ToOADate();
		}

		public class DataPair
		{
			public static DataPair Create(DateTime date, double rate)
			{
				return new DataPair { Value = new PointPair(date.ToOADate(), rate) };
			}

			public PointPair Value { get; private set; }
		}

		public void AddData(string currency, IEnumerable<DataPair> data, Color color)
		{
			var min = zedGraph.GraphPane.XAxis.Scale.Min;
			var points = new PointPairList();
			points.AddRange(data.Select(it => it.Value).ToArray());
			zedGraph.GraphPane.AddCurve(currency, points, color);
			zedGraph.AxisChange();
			zedGraph.RestoreScale(zedGraph.GraphPane);
			zedGraph.ZoomOut(zedGraph.GraphPane);
		}

		public Image GetImage()
		{
			return zedGraph.GetImage();
		}
	}
}
