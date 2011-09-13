namespace SalesOrderMVP.Models
{
	public class Product : IAggregateRoot
	{
		public string URI { get { return Name; } }
		public string Name { get; set; }
		public decimal Price { get; set; }

		public override int GetHashCode() { return URI.GetHashCode(); }
		public override bool Equals(object obj) { return this.IsSameAs(obj); }
	}
}
