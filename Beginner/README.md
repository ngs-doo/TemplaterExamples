## Understanding how Templater works

Introduction to basic features and processing rules.

### [Simple document](SimpleDocument/Readme.md)

Replacing a single tag in the document.

[template](SimpleDocument/template/MyDocument.docx?raw=true) - [result](SimpleDocument/result.docx?raw=true)

### [Simple spreadsheet](SimpleSpreadsheet/Readme.md)

Replacing tags in the spreadsheet.

[template](SimpleSpreadsheet/template/MySpreadsheet.xlsx?raw=true) - [result](SimpleSpreadsheet/result.xlsx?raw=true)

### [Simple presentation](SimplePresentation/Readme.md)

Replacing tags in the presentation.

[template](SimplePresentation/template/Presentation.pptx?raw=true) - [result](SimplePresentation/result.pptx?raw=true)

### [Inserting images](ImageExample/Readme.md)

How to insert an image into a document.

[template](ImageExample/template/Picture.docx?raw=true) - [result](ImageExample/result.docx?raw=true)

### [Android](AndroidExample/Readme.md)

Templater also works in Android.

[template](AndroidExample/app/src/main/res/raw/template.docx?raw=true) - [result](AndroidExample/output.docx?raw=true)

### [License embedding](WebExample%20(.NET)/Readme.md)

How to embed license file (templater.lic) into a web project.

[resource](WebExample%20(.NET)/TemplaterWeb.csproj#L96)

### [Flexible types](MapExample%20(Java)/Readme.md)

Templater supports classes via reflection and more dynamic types such as maps.

[template](MapExample%20(Java)/src/main/resources/MyMap.docx?raw=true) - [result](MapExample%20(Java)/result.docx?raw=true)

### [Scala specifics](BeerList%20(Scala)/Readme.md)

Templater is written in Scala and supports some Scala specific collections/types.

[template](BeerList%20(Scala)/src/main/resources/BeerList.docx?raw=true) - [result](BeerList%20(Scala)/result.docx?raw=true)

### [Collections](ListExample/Readme.md)

While simple scenario such as repeating of a table rows is supported, arbitrary nesting is also supported - nesting collection inside a collection inside a collection...

[template](ListExample/template/MyList.docx?raw=true) - [result](ListExample/result.docx?raw=true)

### [Labels](Labels/Readme.md)

Word features, such as columns, can be leveraged for layout.

[template](Labels/template/label.docx?raw=true) - [result](Labels/result.docx?raw=true)

### [CSV](CsvExample/Readme.md)

CSV output can be used when appropriate.

[template](CsvExample/template/export.csv?raw=true) - [result](CsvExample/result.csv?raw=true)

### [Named range](NamedRange/Readme.md)

In Excel, region fine tuning can be done via named ranges.

[template](NamedRange/template/Scorecard.xlsx?raw=true) - [result](NamedRange/result.xlsx?raw=true)

### [Context detection](SpreadsheetGrouping/Readme.md)

Context analysis will work across nested collections.

[template](SpreadsheetGrouping/template/Grouping.xlsx?raw=true) - [result](SpreadsheetGrouping/result.xlsx?raw=true)

### [Excel links](ExcelLinks/Readme.md)

Various Excel features are supported.

[template](ExcelLinks/template/Links.xlsx?raw=true) - [result](ExcelLinks/result.xlsx?raw=true)

### [PowerPoint tables](PresentationTables/Readme.md)

Populating tables works the same way across formats.

[template](PresentationTables/template/tables.pptx?raw=true) - [result](PresentationTables/result.pptx?raw=true)

### [Special Word objects](WordLinks/Readme.md)

Various Word features are supported.

[template](WordLinks/template/Links.docx?raw=true) - [result](WordLinks/result.docx?raw=true)

### [Mail merge](MailMerge/Readme.md)

Inserting pictures via plugins allows for simple templates.

[template](MailMerge/template/letter.docx?raw=true) - [result](MailMerge/result.docx?raw=true)

### [Pivots](PivotExample/Readme.md)

Integration with complex office features gets the most out of Templater.

[template](PivotExample/template/Pivot.xlsx?raw=true) - [result](PivotExample/result.xlsx?raw=true)

### [Excel pushdown](PushDownExample/Readme.md)

When region extends, stuff needs to be moved around.

[template](PushDownExample/template/MyTable.xlsx?raw=true) - [result](PushDownExample/result.xlsx?raw=true)

### [.NET DataSet](DataSet%20(.NET)/Readme.md)

Master-detail relationship in DataSet type. Injecting colors via XML type.

[template](DataSet%20(.NET)/SampleLetter.docx?raw=true) - [result](DataSet%20(.NET)/result.docx?raw=true)

### [Dynamic resize](DynamicResize/Readme.md)

When number of columns is unknown - two dimensional objects can be used.

[template](DynamicResize/template/GroceryList.docx?raw=true) - [result](DynamicResize/result.docx?raw=true)

### [Conversion to formulas](ToFormulaConversion/Readme.md)

Special tag **[[equals]]** is used to convert cells into formulas.

[template](ToFormulaConversion/template/SimpleConversion.xlsx?raw=true) - [result](ToFormulaConversion/result.xlsx?raw=true)
