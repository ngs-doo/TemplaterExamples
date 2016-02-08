using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Windows;
using System.Windows.Data;
using SalesOrderMVP.Controllers;
using SalesOrderMVP.Models;
using SalesOrderMVP.Repositories;
using SalesOrderMVP.Utility;
using SalesOrderMVP.Views;

namespace SalesOrderMVP.Presenters
{
	public class SalesOrderPresenter : INotifyPropertyChanged, IDisposable
	{
		private readonly SalesOrderGridView GridView = new SalesOrderGridView();
		private readonly SalesOrderItemView ItemView = new SalesOrderItemView();

		private readonly List<IDisposable> Controllers = new List<IDisposable>();

		public SalesOrderPresenter()
		{
			var repository = new SalesOrderRepository();
			ItemsCollection = new ObservableCollection<SalesOrder>(repository.Data);

			GridView.DataContext = this;
			ItemView.DataContext = this;

			var collectionView = CollectionViewSource.GetDefaultView(ItemsCollection);

			Controllers.AddRange(
				new IDisposable[]
				{
					new BrowseController(collectionView, ChangeCurrentItem, () => !EditableState),
					new CrudController<SalesOrder>(
						repository,
						collectionView,
						() => CurrentItem,
						SetCurrent,
						EditableStateChanged),
					new TemplaterController(
						"Templates\\SalesOrderGrid.xlsx",
						"Templates\\SalesOrderItem.xlsx",
						"Templates\\SalesOrderItem.docx",
						"Templates\\SalesOrder.txt",
						ItemsCollection,
						() => GridView.dataGrid.SelectedItems),
					new LayoutController(ChangeView, GridView, ItemView, GridView.dataGrid)
				});

			ChangeView(GridView);
			PropertyChanged.Notify(() => CurrentItem);
		}

		private void ChangeCurrentItem(object current)
		{
			CurrentItem = (SalesOrder)current;
			PropertyChanged.Notify(() => CurrentItem);
		}

		private void ChangeView(FrameworkElement view)
		{
			this.View = view;
			PropertyChanged.Notify(() => View);
		}

		private void SetCurrent(SalesOrder current)
		{
			if (current == null)
			{
				if (CurrentItem == null)
					return;
				ItemsCollection.Remove(CurrentItem);
				return;
			}
			var index = ItemsCollection.IndexOf(current);
			if (index >= 0)
				ItemsCollection[index] = current;
			else
				ItemsCollection.Add(current);
			ChangeCurrentItem(current);
		}

		private void EditableStateChanged(bool inEdit)
		{
			EditableState = inEdit;
			PropertyChanged.Notify(() => EditableState);
			if (inEdit)
				ChangeView(ItemView);
			else
				ChangeView(GridView);
		}

		public bool EditableState { get; private set; }
		public SalesOrder CurrentItem { get; private set; }
		public ObservableCollection<SalesOrder> ItemsCollection { get; private set; }

		public FrameworkElement View { get; private set; }
		public string Title { get { return "Sales order "; } }

		public event PropertyChangedEventHandler PropertyChanged = (s, ea) => { };

		public void Dispose()
		{
			Controllers.ForEach(it => it.Dispose());
		}
	}
}
