namespace SalesOrderMVP.Models
{
	public class SalesOrderLine
	{
		public Product Product { get; set; }
		public decimal Quantity { get; set; }

		public decimal Cost
		{
			get
			{
				return Product != null ? Product.Price * Quantity : 0;
			}
		}
	}
}
