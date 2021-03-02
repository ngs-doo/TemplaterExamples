using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using NGS.Templater;

namespace LimitPlugins
{
	public class Program
	{
		static object TopNElementsFormatting(object value, string metadata)
		{
			var list = value as List<List<string>>;
			if (list != null && metadata.StartsWith("top("))
			{
				var n = int.Parse(metadata.Substring(4, metadata.Length - 5));
				return list.GetRange(0, n);
			}
			return value;
		}

		static bool TopNElementsProcessing(string prefix, ITemplater templater, IList list)
		{
			foreach (var t in templater.Tags)
			{
				//if any of the tag metadata contain limit(X), apply limit on the provided list
				var limit = templater.GetMetadata(t, true).FirstOrDefault(it => it.StartsWith("limit("));
				if (limit != null)
				{
					int x = int.Parse(limit.Substring(6, limit.Length - 7));
					//mutate the object in place... while this is not ideal, it's a convenient way to implement such requirement
					//alternative is to replicate Iterable processor features which is not trivial
					var size = list.Count - x;
					while (size-- > 0)
						list.RemoveAt(x);
				}
			}
			//say that we did not process object, so it's passed down to next processor (built-in)
			//which will process it with more complex logic
			return false;
		}

		static object TopNElementNavigation(object parent, object value, string member, string metadata)
		{
			if (value is IList && metadata.StartsWith("limit("))
			{
				//extract argument from the metadata
				var limit = int.Parse(metadata.Substring(6, metadata.Length - 7));
				var list = (IList)value;
				//return only a subset of list for processing - does not mutate the object like previous plugin
				return list.OfType<object>().Take(limit);
			}
			return value;
		}

		static object ListGroupping(object parent, object value, string member, string metadata)
		{
			if (value is IList && metadata.StartsWith("group("))
			{
				//extract grouping column
				var name = metadata.Substring(6, metadata.Length - 7);
				return from dict in ((IList)value).OfType<IDictionary>()
					   //group by specified argument
					   group dict by dict[name] into grp
					   select new { key = grp.Key, value = grp.ToList() };
			}
			return value;
		}

		class Instance
		{
			public string column1;
			public string column2;
			public string column3;
		}

		public static void Main(string[] args)
		{
			File.Copy("template/Limits.docx", "Limits.docx", true);

			var dynamicResize = new List<List<string>>();
			var instances = new List<Instance>();
			var rnd = new Random();
			var col = rnd.Next(3) + 2;
			var list = new List<Dictionary<string, object>>();
			for (int i = 0; i < 100; i++)
			{
				var columns = new List<string>(col);
				for (int j = 0; j < col; j++)
					columns.Add("row " + i + " col " + j + " = " + rnd.Next());
				dynamicResize.Add(columns);
				var instance = new Instance();
				instance.column1 = "row " + i + " col1 " + " = " + rnd.Next();
				instance.column2 = "row " + i + " col2 " + " = " + rnd.Next();
				instance.column3 = "row " + i + " col3 " + " = " + rnd.Next();
				instances.Add(instance);
				var item = new Dictionary<string, object>();
				item["A"] = "group " + (i % 5 + 1);
				item["B"] = "row " + (i + 1);
				item["C"] = "modulo " + (i % 10);
				list.Add(item);
			}
			var input = new Dictionary<string, object>();
			input["dynamic"] = dynamicResize;
			input["fixed"] = instances;
			input["list"] = list;

			var factory = Configuration.Builder
				.Include(TopNElementsFormatting)
				.Include<IList>(TopNElementsProcessing)
				.NavigateSeparator(':')
				.Include(TopNElementNavigation)
				.Include(ListGroupping)
				.Build();
			using (var doc = factory.Open("Limits.docx"))
				doc.Process(input);
			Process.Start(new ProcessStartInfo("Limits.docx") { UseShellExecute = true });
		}
	}
}
