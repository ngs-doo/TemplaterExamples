using NGS.Templater;

namespace TemplaterWeb
{
	public class Global : System.Web.HttpApplication
	{
		//Templater is configured from resource embedded in the application
		//if templater.lic had a valid license there would be no warning text in the output
		public static IDocumentFactory TemplaterFactory = NGS.Templater.Configuration.Factory;
	}
}