using System;
using System.Data;
using System.Diagnostics;
using System.IO;

namespace DataSetExample
{
	public class Program
	{
		public static void Main(string[] args)
		{
			var dt1 = new DataTable();
			dt1.Columns.Add("Id", typeof(int));
			dt1.Columns.Add("ClientName", typeof(string));
			dt1.Columns.Add("ClientRef", typeof(string));
			dt1.Columns.Add("ContactName", typeof(string));
			dt1.Columns.Add("CurrentDate", typeof(DateTime));

			dt1.Rows.Add(new object[] { 1, "Me", "ref", "Name", DateTime.Today });
			dt1.Rows.Add(new object[] { 2, "ABC", "ABC ref", "Cherry Pick", DateTime.Today.AddDays(1) });
			dt1.Rows.Add(new object[] { 3, "DEF", "DEF ref", "Jerry Springer", DateTime.Today.AddDays(-1) });

			var dt2 = new DataTable();
			dt2.Columns.Add("Id", typeof(int));
			dt2.Columns.Add("Type", typeof(string));
			dt2.Columns.Add("Category", typeof(string));
			dt2.Columns.Add("Items", typeof(string));

			dt2.Rows.Add(new object[] { 1, "10", "Domestic", "Milk and other dairy products" });
			dt2.Rows.Add(new object[] { 1, "11", "Foreign", "Yoghurt with fork" });
			dt2.Rows.Add(new object[] { 1, "12", "Foreign", "Ketchup and pizza" });
			dt2.Rows.Add(new object[] { 3, "1", "Domestic", "Washing services" });
			dt2.Rows.Add(new object[] { 3, "2", "Domestic", "IT support" });

			DataSet ds = new DataSet();
			ds.Tables.Add(dt1);
			ds.Tables.Add(dt2);

			DataRelation rel0 = new DataRelation("Rel", dt1.Columns["Id"], dt2.Columns["Id"]);
			ds.Relations.Add(rel0);

			using (var in2 = new FileStream("SampleLetter.docx", FileMode.Open))
			using (var out2 = new FileStream("out2.docx", FileMode.Create))
			using (var doc = NGS.Templater.Configuration.Factory.Open(in2, out2, "docx"))
			{
				doc.Process(ds);
			}
			Process.Start("out2.docx");
		}
	}
}
