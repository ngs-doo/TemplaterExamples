using System;
using System.Collections.ObjectModel;
using System.Linq;

namespace SalesOrderMVP.Models
{
	public class SalesOrder : IAggregateRoot
	{
		internal readonly Guid ID;
		public string URI { get { return ID.ToString(); } }
		public DateTime Date { get; set; }
		public Customer Customer { get; set; }

		public ObservableCollection<SalesOrderLine> Items { get; private set; }

		public SalesOrder()
			: this(Guid.NewGuid())
		{
			Date = DateTime.Today;
		}

		public SalesOrder(Guid id)
		{
			this.ID = id;
			Items = new ObservableCollection<SalesOrderLine>();
		}

		public decimal Total
		{
			get { return Items.Sum(it => it.Cost); }
		}

		public SalesOrderLine AddItem(Product product, decimal quantity)
		{
			var line = new SalesOrderLine { Product = product, Quantity = quantity };
			Items.Add(line);
			return line;
		}

		public void Validate()
		{
			if (DateTime.Today.AddDays(30) < Date)
				throw new ArgumentException("Check your date");
			if (Customer == null)
				throw new ArgumentException("Customer not set");
			if (Items.Any(it => it.Product == null))
				throw new ArgumentException("Product not set");
		}

		public override int GetHashCode() { return URI.GetHashCode(); }
		public override bool Equals(object obj) { return this.IsSameAs(obj); }
	}
}
