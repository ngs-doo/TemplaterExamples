using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Windows.Data;
using System.Windows.Input;
using SalesOrderMVP.Commands;

namespace SalesOrderMVP.Controllers
{
	public class BrowseController : IDisposable
	{
		private readonly ICollectionView CollectionView;
		private readonly Func<bool> CanNavigate;
		private int TotalCount;

		private readonly List<CommandBinding> Bindings = new List<CommandBinding>();

		public BrowseController(
			ICollectionView collectionView,
			Action<object> changeCurrent,
			Func<bool> canNavigate)
		{
			this.CollectionView = collectionView;
			this.CanNavigate = canNavigate;

			CollectionView.CurrentChanged += (s, ea) => changeCurrent(CollectionView.CurrentItem);
			CollectionView.CollectionChanged += (s, ea) => TotalCount = CollectionView.SourceCollection.Cast<object>().Count();

			Bindings.Add(new CommandBinding(GlobalCommands.First, MoveFirst, CanMoveBack));
			Bindings.Add(new CommandBinding(GlobalCommands.Previous, MovePrevious, CanMoveBack));
			Bindings.Add(new CommandBinding(GlobalCommands.Next, MoveNext, CanMoveForward));
			Bindings.Add(new CommandBinding(GlobalCommands.Last, MoveLast, CanMoveForward));

			App.Current.MainWindow.CommandBindings.AddRange(Bindings);
		}

		private void CanMoveBack(object sender, CanExecuteRoutedEventArgs ea)
		{
			ea.CanExecute = CanNavigate() && CollectionView.CurrentPosition > 0;
		}

		private void MoveFirst(object sender, ExecutedRoutedEventArgs ea)
		{
			CollectionView.MoveCurrentToFirst();
		}

		private void MovePrevious(object sender, ExecutedRoutedEventArgs ea)
		{
			CollectionView.MoveCurrentToPrevious();
		}

		private void CanMoveForward(object sender, CanExecuteRoutedEventArgs ea)
		{
			ea.CanExecute = CanNavigate() && CollectionView.CurrentPosition < TotalCount - 1;
		}

		private void MoveNext(object sender, ExecutedRoutedEventArgs ea)
		{
			CollectionView.MoveCurrentToNext();
		}

		private void MoveLast(object sender, ExecutedRoutedEventArgs ea)
		{
			CollectionView.MoveCurrentToLast();
		}

		public void Dispose()
		{
			Bindings.ForEach(it => App.Current.MainWindow.CommandBindings.Remove(it));
		}
	}
}
