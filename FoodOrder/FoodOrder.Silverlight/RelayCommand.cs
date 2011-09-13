using System;
using System.Windows.Input;

namespace FoodOrder
{
	public class RelayCommand : ICommand
	{
		private readonly Action CommandAction;

		public RelayCommand(Action commandAction)
		{
			this.CommandAction = commandAction;
		}

		public bool CanExecute(object parameter)
		{
			return true;
		}

		public event EventHandler CanExecuteChanged;

		public void Execute(object parameter)
		{
			CommandAction();
		}
	}
}
