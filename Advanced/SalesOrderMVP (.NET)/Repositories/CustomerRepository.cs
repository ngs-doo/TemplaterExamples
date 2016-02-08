using System.Collections.Generic;
using System.Linq;
using System.Xml.Linq;
using SalesOrderMVP.Models;

namespace SalesOrderMVP.Repositories
{
	public class CustomerRepository : IRepository<Customer>
	{
		private const string CustomersFile = "Data\\Customers.xml";
		private readonly XDocument Document = XDocument.Load(CustomersFile);

		public IEnumerable<Customer> Data
		{
			get
			{
				return from item in Document.Root.Descendants("Customer")
					   select new Customer
					   {
						   URI = item.Attribute("URI").Value,
						   Name = item.Element("Name").Value,
						   Address = item.Element("Address").Value
					   };
			}
		}
	}
}
