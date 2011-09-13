using System.Collections.Generic;
using System.IO;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Xml;
using SalesOrderMVP.Models;

namespace SalesOrderMVP.Repositories
{
	public class ProductRepository : IRepository<Product>
	{
		private const string ProductsFile = "Data\\Products.json";
		private readonly List<Product> Products = new List<Product>(LoadFile());

		public IEnumerable<Product> Data
		{
			get
			{
				return Products;
			}
		}

		private static Product[] LoadFile()
		{
			var serializer = new DataContractJsonSerializer(typeof(Product[]));

			using (var reader =
				JsonReaderWriterFactory.CreateJsonReader(
					Encoding.UTF8.GetBytes(File.ReadAllText(ProductsFile, Encoding.UTF8)),
					new XmlDictionaryReaderQuotas()))
				return (Product[])serializer.ReadObject(reader);
		}
	}
}
