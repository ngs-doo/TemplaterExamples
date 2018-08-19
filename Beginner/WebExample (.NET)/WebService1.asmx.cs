using System;
using System.IO;
using System.Web.Services;

namespace TemplaterWeb
{
	/// <summary>
	/// Summary description for WebService1
	/// </summary>
	[WebService(Namespace = "http://tempuri.org/")]
	[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
	[System.ComponentModel.ToolboxItem(false)]
	// To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
	// [System.Web.Script.Services.ScriptService]
	public class WebService1 : System.Web.Services.WebService
	{
		private static readonly byte[] Template = File.ReadAllBytes(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "template", "template.docx"));

		[WebMethod]
		public void TestTemplater(string argument)
		{
			using (var ms = new MemoryStream(Template))
			{
				ms.Position = 0;
				Context.Response.ClearContent();
				Context.Response.AddHeader("Content-Disposition", "attachment; filename=test.docx");
				Context.Response.ContentType = "application/octet-stream";
				using (var doc = Global.TemplaterFactory.Open(ms, Context.Response.OutputStream, "docx"))
				{
					doc.Templater.Replace("test", DateTime.Now);
					doc.Templater.Replace("argument", argument);
				}
				Context.Response.End();
			}
		}
	}
}
