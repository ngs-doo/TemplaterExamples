using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using SalesOrderMVP.Commands;

namespace SalesOrderMVP.Controllers
{
	public class LayoutController : IDisposable
	{
		private readonly Action<FrameworkElement> ChangeView;
		private readonly FrameworkElement GridView;
		private readonly FrameworkElement ItemView;

		private readonly CommandBinding BindingGrid;
		private readonly CommandBinding BindingItem;

		public LayoutController(
			Action<FrameworkElement> changeView,
			FrameworkElement gridView,
			FrameworkElement itemView,
			DataGrid dataGrid)
		{
			this.ChangeView = changeView;
			this.GridView = gridView;
			this.ItemView = itemView;

			dataGrid.MouseDoubleClick += (s, ea) => SwitchToItem(null, null);

			var bindings = App.Current.MainWindow.CommandBindings;
			bindings.Add(BindingGrid = new CommandBinding(GlobalCommands.ShowGridView, SwitchToGrid));
			bindings.Add(BindingItem = new CommandBinding(GlobalCommands.ShowItemView, SwitchToItem));
		}

		private void SwitchToGrid(object sender, ExecutedRoutedEventArgs ea)
		{
			ChangeView(GridView);
		}

		private void SwitchToItem(object sender, ExecutedRoutedEventArgs ea)
		{
			ChangeView(ItemView);
		}

		public void Dispose()
		{
			App.Current.MainWindow.CommandBindings.Remove(BindingGrid);
			App.Current.MainWindow.CommandBindings.Remove(BindingItem);
		}
	}
}
