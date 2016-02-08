using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Windows;
using System.Windows.Input;
using SalesOrderMVP.Commands;

namespace SalesOrderMVP.Controllers
{
	public class CrudController<TRoot> : IDisposable
		where TRoot : IAggregateRoot, new()
	{
		private readonly List<CommandBinding> Bindings = new List<CommandBinding>();

		private readonly IPersistableRepository<TRoot> Repository;
		private readonly ICollectionView CollectionView;
		private readonly Func<TRoot> GetCurrent;
		private readonly Action<TRoot> SetCurrent;
		private readonly Action<bool> StateChanged;

		private bool InEdit;
		private Action SaveAction;

		public CrudController(
			IPersistableRepository<TRoot> repository,
			ICollectionView collectionView,
			Func<TRoot> getCurrent,
			Action<TRoot> setCurrent,
			Action<bool> stateChanged)
		{
			this.Repository = repository;
			this.CollectionView = collectionView;
			this.GetCurrent = getCurrent;
			this.SetCurrent = setCurrent;
			this.StateChanged = stateChanged;

			Bindings.Add(new CommandBinding(GlobalCommands.New, CreateNew, CanCreateNew));
			Bindings.Add(new CommandBinding(GlobalCommands.Edit, EditCurrent, CanEditOrDeleteCurrent));
			Bindings.Add(new CommandBinding(GlobalCommands.Delete, DeleteCurrent, CanEditOrDeleteCurrent));
			Bindings.Add(new CommandBinding(GlobalCommands.Save, SaveChanges, IsInEdit));
			Bindings.Add(new CommandBinding(GlobalCommands.Cancel, CancelChanges, IsInEdit));

			App.Current.MainWindow.CommandBindings.AddRange(Bindings);
		}

		private void CreateNew(object sender, ExecutedRoutedEventArgs ea)
		{
			var item = new TRoot();
			SetCurrent(item);
			CollectionView.MoveCurrentTo(item);
			StateChanged(InEdit = true);
			SaveAction = () => Repository.Insert(GetCurrent());
		}

		private void CanCreateNew(object sender, CanExecuteRoutedEventArgs ea)
		{
			ea.CanExecute = !InEdit;
		}

		private void CanEditOrDeleteCurrent(object sender, CanExecuteRoutedEventArgs ea)
		{
			ea.CanExecute = !InEdit && GetCurrent() != null;
		}

		private void EditCurrent(object sender, ExecutedRoutedEventArgs ea)
		{
			StateChanged(InEdit = true);
			SaveAction = () => Repository.Update(GetCurrent());
		}

		private void DeleteCurrent(object sender, ExecutedRoutedEventArgs ea)
		{
			Repository.Delete(GetCurrent());
			SetCurrent(default(TRoot));
			StateChanged(InEdit = false);
		}

		private void IsInEdit(object sender, CanExecuteRoutedEventArgs ea)
		{
			ea.CanExecute = InEdit;
		}

		private void SaveChanges(object sender, ExecutedRoutedEventArgs ea)
		{
			try
			{
				SaveAction();
				StateChanged(InEdit = false);
				CollectionView.Refresh();
			}
			catch (ArgumentException ex)
			{
				MessageBox.Show("Validation error: " + ex.Message, "Validation", MessageBoxButton.OK, MessageBoxImage.Error);
			}
		}

		private void CancelChanges(object sender, ExecutedRoutedEventArgs ea)
		{
			var currentURI = GetCurrent().URI;
			var original = Repository.Data.FirstOrDefault(it => it.URI == currentURI);
			if (original == null)
			{
				SetCurrent(default(TRoot));
				CollectionView.MoveCurrentToFirst();
			}
			else
			{
				SetCurrent(original);
				CollectionView.Refresh();
				CollectionView.MoveCurrentTo(original);
			}
			StateChanged(InEdit = false);
		}

		public void Dispose()
		{
			Bindings.ForEach(it => App.Current.MainWindow.CommandBindings.Remove(it));
		}
	}
}
