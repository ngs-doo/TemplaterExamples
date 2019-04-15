using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using NGS.Templater;

namespace MissingProperty
{
	public class Program
	{
		public static void Main(string[] args)
		{
			File.Copy("template/dynamic.docx", "dynamic.docx", true);

			var dictionary = new Dictionary<string, object>();
			dictionary["provided"] = "something";
			dictionary["null"] = null;
			dictionary["collection"] = new[]{
				new Dictionary<string, object>{{"tagA", "a"},{"tagB","b"}},
				new Dictionary<string, object>{{"tagA", "c"}},
				new Dictionary<string, object>{{"tagA", "e"},{"tagB","f"}},
			};

			Action<string, ITemplater, IEnumerable<string>, object> handleUnprocessed = (prefix, templater, tags, value) =>
			{
				foreach (var t in tags)
				{
					var md = templater.GetMetadata(t, false);
					var missing = md.FirstOrDefault(it => it.StartsWith("missing("));
					if (missing != null)
						templater.Replace(t, missing.Substring("missing(".Length, missing.Length - 1 - "missing(".Length));
				}
			};

			using (var doc = Configuration.Builder.OnUnprocessed(handleUnprocessed).Build().Open("dynamic.docx"))
			{
				doc.Process(dictionary);
				RemoveTagsWithMissing(doc.Templater);
			}
			Process.Start("dynamic.docx");
		}

		static void RemoveTagsWithMissing(ITemplater templater)
		{
			foreach (var tag in templater.Tags.ToList())
			{
				int i = 0;
				string[] md;
				//metadata will return null when a tag does not exist at that index
				while ((md = templater.GetMetadata(tag, i)) != null)
				{
					var missing = md.FirstOrDefault(it => it.StartsWith("missing("));
					if (missing != null)
					{
						var description = missing.Substring(8, missing.Length - 9);
						//Replace tag at specific index, not just the first tag
						templater.Replace(tag, i, description);
					}
					else i++;
				}
			}
		}
	}
}
