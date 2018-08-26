using System.Collections.Generic;

namespace Formulas
{
	public class Group
	{
		public string name;
		public string description;
		public int person;
		public double targetPercentage;
		public float category;
		public List<Item> items = new List<Item>();

		public class Item
		{
			public string name;
			public int person;
			public float targetPercentage;
			public float category;
		}

		public Group(int id)
		{
			name = "Group " + id;
			description = "Description " + id;
			person = 1000 + id;
			targetPercentage = (2.2 + id) / 100;
			category = 10 + 50 * id;
			for (int i = 1; i <= id; i++)
			{
				Item item = new Item();
				item.name = "group " + id + " index " + i;
				item.person = 3000 + id * i + i;
				item.targetPercentage = 4.4f + id * i + i;
				item.category = category;
				items.Add(item);
			}
		}
	}
}
