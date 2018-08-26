using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using NGS.Templater;
using System.Collections;

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
					while(size-- > 0)
						list.RemoveAt(x);
				}
			}
			//say that we did not process object, so it's passed down to next processor (built-in)
			//which will process it with more complex logic
			return false;
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
			}
			var input = new Dictionary<string, object>();
			input["dynamic"] = dynamicResize;
			input["fixed"] = instances;

			var factory = Configuration.Builder.Include(TopNElementsFormatting).Include<IList>(TopNElementsProcessing).Build();
			using (var doc = factory.Open("Limits.docx"))
				doc.Process(input);
			Process.Start("Limits.docx");
		}
	}
}
