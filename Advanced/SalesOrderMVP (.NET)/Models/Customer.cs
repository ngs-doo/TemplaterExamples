namespace SalesOrderMVP.Models
{
	public class Customer : IAggregateRoot
	{
		public string URI { get; internal set; }
		public string Name { get; set; }
		public string Address { get; set; }

		public override int GetHashCode() { return URI.GetHashCode(); }
		public override bool Equals(object obj) { return this.IsSameAs(obj); }
	}
}
