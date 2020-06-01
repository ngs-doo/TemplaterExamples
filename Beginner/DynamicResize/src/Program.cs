using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using NGS.Templater;

namespace DynamicResize
{
	public class Program
	{
		public static void Main(string[] args)
		{
			File.Copy("template/GroceryList.docx", "Groceries.docx", true);

			var array = new[]{
				new []{"Apples", "Milk", "Bread"},
				new []{"Golden apple", "Dukat", "Black bread"},
				new []{"Granny smith", "Omega 3", "Alpine"},
				new []{"Red GMO", "Cow", "French bread"}
			};

			var horizontal = new[]{
				new []{"Day", "Breakfast", "Lunch", "Dinner"},
				new []{"Monday", "Cornflakes", "Cevapi with onions", null},
				new []{"Tuesday", "Serial", "Meatballs", "Apple"},
				new []{"Wednesday", "Cokolino", null, "Bananas"},
				new []{"Thursday", "Salad", null, "Fruit"},
				new []{"Friday", "Nutella", "Chocolate", null},
				new []{"Saturday", "Lasagnas", null, null},
				new []{"Sunday", "Cookies", "Cake", "Cake"}
			};

			var vertical = new[]{
				new []{"Meal", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",  "Saturday", "Sunday" },
				new []{"Breakfast", "Cornflakes", "Serial", "Cokolino", "Salad", "Nutella", "Lasagnas", "Cookies"},
				new []{"Lunch", "Cevapi with onions", "Meatballs", null, null, "Chocolate", null, "Cake"},
				new []{"Dinner", null, "Apple", "Bananas", "Fruit", null, null, "Cake"}
			};

			using (var doc = Configuration.Factory.Open("Groceries.docx"))
			{
				//low level API call supports the dynamic resize feature
				doc.Templater.Replace("myArr", array);
				//high level API call supports the dynamic resize feature
				doc.Process(new Dictionary<string, object>
				{
					{"horizontal-nulls", horizontal},
					{"vertical-nulls", vertical}
				});
			}
			Process.Start(new ProcessStartInfo("Groceries.docx") { UseShellExecute = true });
		}
	}
}
