using System;
using System.Diagnostics;
using System.IO;
using System.Threading;
using NGS.Templater;

namespace AlternativeProperty
{
	public class Program
	{
		class MyObjectA
		{
			public string fieldA = null;
		}
		class MyObjectB
		{
			public string fieldB = "alternative value";
		}
		class MyObject
		{
			public MyObjectA objectA = new MyObjectA();
			public MyObjectB objectB = new MyObjectB();
		}

		public static void Main(string[] args)
		{
			File.Copy("template/Fields.docx", "Fields.docx", true);
			object currentRoot = null;
			Func<object, string, object> missingFormatter = (value, metadata) =>
			{
				if (metadata.StartsWith("missing(") && value == null)
				{
					//path to appropriate field
					string[] path = metadata.Substring(8, metadata.Length - 9).Split('.');
					object current = currentRoot;
					foreach (string p in path)
					{
						var f = current.GetType().GetField(p);
						current = f.GetValue(current);
					}
					return current;
				}
				return value;
			};
			var factory = Configuration.Builder.Include(missingFormatter).Build();
			using (var doc = factory.Open("Fields.docx"))
				ProcessValue(ref currentRoot, doc, new MyObject());
			Process.Start(new ProcessStartInfo("Fields.docx") { UseShellExecute = true });
		}

		private static void ProcessValue(ref object currentRoot, ITemplateDocument doc, object value)
		{
			try
			{
				currentRoot = value;
				doc.Process(value);
			}
			finally
			{
				currentRoot = null;
			}
		}
	}
}
