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

			using (var doc = Configuration.Factory.Open("dynamic.docx"))
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
