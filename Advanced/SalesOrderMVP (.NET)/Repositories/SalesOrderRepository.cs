using System.Collections.Generic;
using System.Data;
using System.Data.SQLite;
using SalesOrderMVP.Models;

namespace SalesOrderMVP.Repositories
{
	public class SalesOrderRepository : IPersistableRepository<SalesOrder>
	{
		private const string ConnectionString = "Data Source=Data\\orders.sqlite;Version=3";

		public IEnumerable<SalesOrder> Data
		{
			get
			{
				using (var conn = new SQLiteConnection(ConnectionString))
				{
					conn.Open();
					var comOrder = conn.CreateCommand();
					comOrder.CommandText = "SELECT ID, Date, CustomerURI, CustomerName, CustomerAddress FROM SalesOrder ORDER BY ID";
					var orderReader = comOrder.ExecuteReader();
					var comItems = conn.CreateCommand();
					comItems.CommandText = "SELECT SalesOrderID, ProductName, Price, Quantity FROM SalesOrderLine ORDER BY SalesOrderID, ItemIndex";
					var itemsReader = comItems.ExecuteReader();
					itemsReader.Read();
					while (orderReader.Read())
					{
						var order = new SalesOrder(orderReader.GetGuid(0))
						{
							Date = orderReader.GetDateTime(1),
							Customer = new Customer
							{
								URI = orderReader.GetString(2),
								Name = orderReader.GetString(3),
								Address = orderReader.GetString(4)
							}
						};
						do
						{
							if (!itemsReader.HasRows || itemsReader.GetGuid(0) != order.ID)
								break;
							order.AddItem(
								new Product { Name = itemsReader.GetString(1), Price = itemsReader.GetDecimal(2) },
								itemsReader.GetDecimal(3));
						} while (itemsReader.Read());
						yield return order;
					}
					conn.Close();
				}
			}
		}

		private void InsertOrUpdate(
			SQLiteCommand comHead,
			SQLiteCommand comItem,
			IEnumerable<SalesOrder> data)
		{
			comHead.Parameters.Clear();
			comHead.Parameters.Add("@ID", DbType.Guid);
			comHead.Parameters.Add("@Date", DbType.Date);
			comHead.Parameters.Add("@Customer", DbType.String);
			comHead.Parameters.Add("@Name", DbType.String);
			comHead.Parameters.Add("@Address", DbType.String);
			comItem.CommandText = "INSERT INTO SalesOrderLine VALUES(@ID, @Index, @Product, @Price, @Quantity)";
			comItem.Parameters.Clear();
			comItem.Parameters.Add("@ID", DbType.Guid);
			comItem.Parameters.Add("@Index", DbType.Int32);
			comItem.Parameters.Add("@Product", DbType.String);
			comItem.Parameters.Add("@Price", DbType.Decimal);
			comItem.Parameters.Add("@Quantity", DbType.Decimal);
			foreach (var head in data)
			{
				head.Validate();
				comHead.Parameters["@ID"].Value = head.ID;
				comHead.Parameters["@Date"].Value = head.Date;
				comHead.Parameters["@Customer"].Value = head.Customer.URI;
				comHead.Parameters["@Name"].Value = head.Customer.Name;
				comHead.Parameters["@Address"].Value = head.Customer.Address;
				comHead.ExecuteNonQuery();
				for (int i = 0; i < head.Items.Count; i++)
				{
					var item = head.Items[i];
					comItem.Parameters["@ID"].Value = head.ID;
					comItem.Parameters["@Index"].Value = i + 1;
					comItem.Parameters["@Product"].Value = item.Product.Name;
					comItem.Parameters["@Price"].Value = item.Product.Price;
					comItem.Parameters["@Quantity"].Value = item.Quantity;
					comItem.ExecuteNonQuery();
				}
			}
		}

		public void Save(
			IEnumerable<SalesOrder> insert,
			IEnumerable<SalesOrder> update,
			IEnumerable<SalesOrder> delete)
		{
			using (var conn = new SQLiteConnection(ConnectionString))
			{
				var comHead = conn.CreateCommand();
				var comItem = conn.CreateCommand();
				conn.Open();
				var tran = conn.BeginTransaction();
				comHead.Transaction = tran;
				comItem.Transaction = tran;
				if (insert != null)
				{
					comHead.CommandText = "INSERT INTO SalesOrder VALUES(@ID, @Date, @Customer, @Name, @Address)";
					InsertOrUpdate(comHead, comItem, insert);
				}
				if (update != null)
				{
					comHead.CommandText = @"
UPDATE SalesOrder SET Date = @Date, CustomerURI = @Customer, CustomerName = @Name, CustomerAddress = @Address WHERE ID = @ID;
DELETE FROM SalesOrderLine WHERE SalesOrderID = @ID";
					InsertOrUpdate(comHead, comItem, update);
				}
				if (delete != null)
				{
					comHead.Parameters.Clear();
					comHead.CommandText = @"
DELETE FROM SalesOrderLine WHERE SalesOrderID = @ID;
DELETE FROM SalesOrder WHERE ID = @ID";
					comHead.Parameters.Add("@ID", DbType.Guid);
					foreach (var head in delete)
					{
						comHead.Parameters["@ID"].Value = head.ID;
						comHead.ExecuteNonQuery();
					}
				}
				tran.Commit();
				conn.Close();
			}
		}
	}
}