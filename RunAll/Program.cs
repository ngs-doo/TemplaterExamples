namespace RunAll
{
	class Program
	{
		static void Main(string[] args)
		{
			SimpleDocument.Program.Main(args);
			SimpleSpreadsheet.Program.Main(args);
			DataSetExample.Program.Main(args);
			ListsAndTables.Program.Main(args);
			//ExchangeRates.Program.Main(args);//standalone app. run manually
			WordLinks.Program.Main(args);
			//IsoCountries.Program.Main(args);//standalone app. run manually
			Labels.Program.Main(args);
			WordDataTable.Program.Main(args);
			MailMerge.Program.Main(args);
			//FoodOrder // web app. run manually
			HtmlPlugin.Program.Main(args);
			ChartExample.Program.Main(args);
			QuestionnairePlugin.Program.Main(args);
			//TemplaterWeb // web app. run manually
			SpreadsheetGrouping.Program.Main(args);
			ExcelContextRules.Program.Main(args);
			ToFormulaConversion.Program.Main(args);
			DoubleProcessing.Program.Main(args);
			//SalesOrderMVP standalone desktop app. run manually
		}
	}
}
