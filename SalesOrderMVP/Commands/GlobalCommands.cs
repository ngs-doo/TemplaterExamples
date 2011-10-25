using System.Windows.Input;

namespace SalesOrderMVP.Commands
{
	public static class GlobalCommands
	{
		public static RoutedUICommand New = new RoutedUICommand();
		public static RoutedUICommand Edit = new RoutedUICommand();
		public static RoutedUICommand Delete = new RoutedUICommand();
		public static RoutedUICommand Save = new RoutedUICommand();
		public static RoutedUICommand Cancel = new RoutedUICommand();

		public static RoutedUICommand First = new RoutedUICommand();
		public static RoutedUICommand Previous = new RoutedUICommand();
		public static RoutedUICommand Next = new RoutedUICommand();
		public static RoutedUICommand Last = new RoutedUICommand();

		public static RoutedUICommand EditGridTemplate = new RoutedUICommand();
		public static RoutedUICommand EditItemTemplate = new RoutedUICommand();
		public static RoutedUICommand EditTxtTemplate = new RoutedUICommand();
		public static RoutedUICommand ShowGridData = new RoutedUICommand();
		public static RoutedUICommand ShowItemData = new RoutedUICommand();
		public static RoutedUICommand ShowTxtData = new RoutedUICommand();

		public static RoutedUICommand ShowGridView = new RoutedUICommand();
		public static RoutedUICommand ShowItemView = new RoutedUICommand();
	}
}
