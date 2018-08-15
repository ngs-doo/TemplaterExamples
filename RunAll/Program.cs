namespace RunAll
{
	class Program
	{
		static void Main(string[] args)
		{
			SimpleDocument.Program.Main(args);
			SimpleSpreadsheet.Program.Main(args);
			ListExample.Program.Main(args);
			DataSetExample.Program.Main(args);
			ImageExample.Program.Main(args);
			Labels.Program.Main(args);
			ListsAndTables.Program.Main(args);
			DynamicResize.Program.Main(args);
			NamedRange.Program.Main(args);
			SpreadsheetGrouping.Program.Main(args);
			PushDownExample.Program.Main(args);
			PivotExample.Program.Main(args);
			ToFormulaConversion.Program.Main(args);
			BoolOverride.Program.Main(args);
			AlternativeProperty.Program.Main(args);
			//ExchangeRates.Program.Main(args);//standalone app. run manually
			ExcelLinks.Program.Main(args);
			WordLinks.Program.Main(args);
			//IsoCountries.Program.Main(args);//standalone app. run manually
			WordDataTable.Program.Main(args);
			MailMerge.Program.Main(args);
			ExcelContextRules.Program.Main(args);
			//FoodOrder // web app. run manually
			HtmlPlugin.Program.Main(args);
			ChartExample.Program.Main(args);
			QuestionnairePlugin.Program.Main(args);
			//TemplaterWeb // web app. run manually
			DoubleProcessing.Program.Main(args);
			SheetReport.Program.Main(args);
			XmlBinding.Program.Main(args);
			//SalesOrderMVP standalone desktop app. run manually
		}
	}
}
