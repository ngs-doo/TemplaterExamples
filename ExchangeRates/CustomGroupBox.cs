using System;
using System.ComponentModel;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Text;
using System.Windows.Forms;

namespace ExchangeRates
{
	public partial class CustomGroupBox : GroupBox, ISupportInitialize
	{
		private Color defaultColor = SystemColors.Control;
		private Color middleInactiveColor = SystemColors.Control;
		private Color middleActiveColor = SystemColors.ControlDark;

		private Color borderColor = SystemColors.WindowText;
		private Color currentMiddleColor = SystemColors.Control;

		private bool animationRequired = true;
		private System.Timers.Timer timerChange = new System.Timers.Timer(20);
		private System.Timers.Timer timerMouse = new System.Timers.Timer(20);

		private short destination = 0;
		private short current = 0;
		private short step = 1;

		private short botValue = 0;
		private short topValue = 10;
		private short stepValue = 1;

		private int roundedCornersFont = 5;
		private int roundedCornersGroupBox = 10;

		private GraphicsPath bodyPath = new GraphicsPath();
		private GraphicsPath titlePath = new GraphicsPath();

		private Rectangle bodyRectangle = new Rectangle();
		private Rectangle titleRectangle = new Rectangle();

		private StringFormat mFormat = new StringFormat();

		private Brush fontBrush = new SolidBrush(SystemColors.ControlText);

		private bool calculateTextRequired, calculateSizeRequired;

		private bool mouseInside;
		private bool mouseInsideTimer;
		private bool mouseInsideSubControl;

		private bool hasFocus;
		private bool subHasFocus;

		private bool isEnabled = true;

		public CustomGroupBox()
		{
			InitializeComponent();
		}

		protected override void OnControlAdded(ControlEventArgs e)
		{
			HandleEventsOnChildren(e.Control);
			ProcesChildControls(e.Control.Controls);
			try
			{
				if (!(e.Control is TextBoxBase
					|| e.Control is DateTimePicker
					|| e.Control is DataGridView))
					e.Control.BackColor = Color.Transparent;
			}
			catch (ArgumentException)
			{
				//Control does not support transparent background 
			}
			base.OnControlAdded(e);
		}

		protected override void OnEnabledChanged(EventArgs e)
		{
			isEnabled = Enabled;
			base.OnEnabledChanged(e);
			destination = botValue;
			step = (short)(-stepValue);
			if (animationRequired)
				timerChange.Start();
		}

		private void ProcesChildControls(ControlCollection cc)
		{
			foreach (Control c in cc)
			{
				HandleEventsOnChildren(c);
				if (c.Controls.Count > 0)
					ProcesChildControls(c.Controls);
			}
		}

		private void HandleEventsOnChildren(Control child)
		{
			child.MouseEnter += delegate(object o, EventArgs ea)
			{
				mouseInsideSubControl = true;
				DoAnimation();
			};
			child.MouseLeave += delegate(object o, EventArgs ea)
			{
				mouseInsideSubControl = false;
				DoAnimation();
			};
			child.GotFocus += delegate(object o, EventArgs ea)
			{
				subHasFocus = true;
				DoAnimation();
			};
			child.LostFocus += delegate(object o, EventArgs ea)
			{
				subHasFocus = child.ContainsFocus;
				DoAnimation();
			};
		}

		private void timerChange_Elapsed(object sender, System.Timers.ElapsedEventArgs e)
		{
			if (timerChange == null)
				return;
			current += step;
			if (current <= destination && step < 0 || current >= destination && step > 0)
			{
				current = destination;
				try
				{
					timerChange.Stop();
				}
				catch
				{
					return;
				}
			}
			if (timerChange == null)
				return;
			currentMiddleColor = InterpolateColors(middleInactiveColor, middleActiveColor, current / (float)topValue);
			Invalidate();
		}

		private static Color InterpolateColors(Color start, Color end, float percentage)
		{
			if (percentage < 0)
				percentage = 0;
			if (percentage > 1)
				percentage = 1;
			int num1 = ((int)start.R);
			int num2 = ((int)start.G);
			int num3 = ((int)start.B);
			int num4 = ((int)end.R);
			int num5 = ((int)end.G);
			int num6 = ((int)end.B);
			byte num7 = Convert.ToByte(((float)(((float)num1) + (((float)(num4 - num1)) * percentage))));
			byte num8 = Convert.ToByte(((float)(((float)num2) + (((float)(num5 - num2)) * percentage))));
			byte num9 = Convert.ToByte(((float)(((float)num3) + (((float)(num6 - num3)) * percentage))));
			return Color.FromArgb(num7, num8, num9);
		}

		private void timerMouse_Elapsed(object sender, System.Timers.ElapsedEventArgs e)
		{
			Threading.SafeInvokeAsync(this, delegate()
			{
				Point pt = PointToClient(MousePosition);
				mouseInsideTimer = pt.X >= 0 && pt.Y >= 0 && pt.X <= Size.Width && pt.Y <= Size.Height;
				DoAnimation();
				if (!mouseInsideTimer)
					timerMouse.Stop();
			});
		}

		protected override void OnTextChanged(EventArgs e)
		{
			calculateTextRequired = true;
			base.OnTextChanged(e);
		}

		protected override void OnResize(EventArgs e)
		{
			calculateSizeRequired = true;
			base.OnResize(e);
		}

		protected override void OnForeColorChanged(EventArgs e)
		{
			fontBrush = new SolidBrush(ForeColor);
			base.OnForeColorChanged(e);
		}

		protected override void OnPaint(PaintEventArgs e)
		{
			Graphics g = e.Graphics;

			if (g.ClipBounds.Width <= 0 || g.ClipBounds.Height <= 0)
				return;

			if (calculateTextRequired)
			{
				SizeF StringSize = TextRenderer.MeasureText(Text, Font);
				Size StringSize2 = StringSize.ToSize();

				int ArcX1 = 15;
				int ArcX2 = (StringSize2.Width + 20) + roundedCornersFont / 2 - 2;
				int ArcY1 = 1;
				int ArcY2 = Font.Height + roundedCornersFont / 2 - 2;

				titlePath = new GraphicsPath();

				titlePath.AddArc(ArcX1, ArcY1, roundedCornersFont, roundedCornersFont, 180, 90);
				titlePath.AddArc(ArcX2, ArcY1, roundedCornersFont, roundedCornersFont, 270, 90);
				titlePath.AddArc(ArcX2, ArcY2, roundedCornersFont, roundedCornersFont, 0, 90);
				titlePath.AddArc(ArcX1, ArcY2, roundedCornersFont, roundedCornersFont, 90, 90);

				titlePath.CloseAllFigures();

				titleRectangle = new Rectangle(0, 0, StringSize2.Width + 20 + roundedCornersFont, Font.Height + roundedCornersFont);

				calculateTextRequired = false;
			}

			if (calculateSizeRequired)
			{
				int ArcX1 = 0;
				int ArcX2 = Width - roundedCornersGroupBox - 1;
				int ArcY1 = Font.Height / 2 + 2;
				int ArcY2 = Height - roundedCornersGroupBox - 1;

				bodyPath = new GraphicsPath();

				bodyPath.AddArc(ArcX1, ArcY1, roundedCornersGroupBox, roundedCornersGroupBox, 180, 90);
				bodyPath.AddArc(ArcX2, ArcY1, roundedCornersGroupBox, roundedCornersGroupBox, 270, 90);
				bodyPath.AddArc(ArcX2, ArcY2, roundedCornersGroupBox, roundedCornersGroupBox, 360, 90);
				bodyPath.AddArc(ArcX1, ArcY2, roundedCornersGroupBox, roundedCornersGroupBox, 90, 90);
				bodyPath.CloseAllFigures();

				bodyRectangle = new Rectangle(0, 0, Width, Height);

				calculateSizeRequired = false;
			}

			g.SmoothingMode = SmoothingMode.AntiAlias;

			using (SolidBrush sb = new SolidBrush(Color.Transparent))
				g.FillRectangle(sb, ClientRectangle);

			using (LinearGradientBrush aGB = new LinearGradientBrush(bodyRectangle, defaultColor, defaultColor, LinearGradientMode.Vertical))
			{
				ColorBlend cb = new ColorBlend();
				cb.Colors = new Color[] { defaultColor, currentMiddleColor, defaultColor };
				cb.Positions = new float[] { 0, 0.55f, 1 };
				aGB.InterpolationColors = cb;
				g.FillPath(aGB, bodyPath);
			}

			Brush BorderBrush = new SolidBrush(borderColor);
			Pen BorderPen = new Pen(BorderBrush);
			g.DrawPath(BorderPen, bodyPath);

			if (Text.Length > 0)
			{
				using (LinearGradientBrush aGB = new LinearGradientBrush(titleRectangle, defaultColor, defaultColor, LinearGradientMode.Vertical))
				{
					ColorBlend cb = new ColorBlend();
					cb.Colors = new Color[] { middleActiveColor, defaultColor, middleActiveColor };
					cb.Positions = new float[] { 0, 0.55f, 1 };
					aGB.InterpolationColors = cb;
					g.FillPath(aGB, titlePath);
				}

				g.DrawPath(BorderPen, titlePath);

				g.TextRenderingHint = TextRenderingHint.ClearTypeGridFit;
				g.DrawString(Text, Font, fontBrush, new PointF(20, 3), mFormat);
				g.TextRenderingHint = TextRenderingHint.SystemDefault;
			}

			g.SmoothingMode = SmoothingMode.Default;
		}

		protected override void OnMouseEnter(EventArgs e)
		{
			mouseInside = true;
			DoAnimation();
			base.OnMouseEnter(e);
		}

		protected override void OnMouseLeave(EventArgs e)
		{
			mouseInside = false;
			DoAnimation();
			base.OnMouseLeave(e);
		}

		protected override void OnGotFocus(EventArgs e)
		{
			base.OnGotFocus(e);
			hasFocus = true;
			DoAnimation();
		}

		protected override void OnLostFocus(EventArgs e)
		{
			base.OnLostFocus(e);
			hasFocus = false;
			DoAnimation();
		}

		private void DoAnimation()
		{
			if (!isEnabled)
				return;
			timerMouse.Start();
			if (mouseInside || mouseInsideTimer || mouseInsideSubControl || hasFocus || subHasFocus)
			{
				destination = topValue;
				step = stepValue;
				if (animationRequired)
					timerChange.Start();
			}
			else
			{
				destination = botValue;
				step = (short)(-stepValue);
				if (animationRequired)
					timerChange.Start();
			}
		}

		[DefaultValue(5)]
		public int RoundedCordersFont
		{
			get { return roundedCornersFont; }
			set { roundedCornersFont = value; }
		}

		[DefaultValue(10)]
		public int RoundedCornersGroupBox
		{
			get { return roundedCornersGroupBox; }
			set { roundedCornersGroupBox = value; }
		}

		public Color BorderColor
		{
			get { return borderColor; }
			set { borderColor = value; }
		}

		public Color DefaultColor
		{
			get { return defaultColor; }
			set { defaultColor = value; }
		}

		public Color MiddleInactiveColor
		{
			get { return middleInactiveColor; }
			set { middleInactiveColor = value; }
		}

		public Color MiddleActiveColor
		{
			get { return middleActiveColor; }
			set { middleActiveColor = value; }
		}

		#region ISupportInitialize Members

		public void BeginInit()
		{
			DoubleBuffered = true;
		}

		public void EndInit()
		{
			timerChange.Elapsed += timerChange_Elapsed;
			timerMouse.Elapsed += timerMouse_Elapsed;
			mFormat.Alignment = StringAlignment.Near;
			mFormat.LineAlignment = StringAlignment.Near;

			BackColor = Color.Transparent;
		}

		#endregion
	}
}
