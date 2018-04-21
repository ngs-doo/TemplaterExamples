## Understanding how Templater works

Introduction to basic features and processing rules.

### [Simple document](SimpleDocument%20(.NET)/Readme.md)

Replacing a single tag in the document.

[template](SimpleDocument%20(.NET)/MyDocument.docx?raw=true) - [result](SimpleDocument%20(.NET)/result.docx?raw=true)

### [Simple spreadsheet](SimpleSpreadsheet%20(.NET)/Readme.md)

Replacing tags in the spreadsheet.

[template](SimpleSpreadsheet%20(.NET)/MySpreadsheet.xlsx?raw=true) - [result](SimpleSpreadsheet%20(.NET)/result.xlsx?raw=true)

### [Inserting images](ImageExample%20(Java)/Readme.md)

How to insert an image into the document.

[template](ImageExample%20(Java)/src/main/resources/Picture.docx?raw=true) - [result](ImageExample%20(Java)/result.docx?raw=true)

### [License embedding](WebExample%20(.NET)/Readme.md)

How to embed license file (templater.lic) into a web project.

[resource](WebExample%20(.NET)[WebExample%20(.NET)/TemplaterWeb.csproj#L96)

### [Flexible types](MapExample%20(Java)/Readme.md)

Templater supports classes via reflection and more dynamic types such as maps.

[template](MapExample%20(Java)/src/main/resources/MyMap.docx?raw=true) - [result](MapExample%20(Java)/result.docx?raw=true)

### [Scala specifics](BeerList%20(Scala)/Readme.md)

Templater is written in Scala and supports some Scala specific collections/types.

[template](BeerList%20(Scala)/src/main/resources/BeerList.docx?raw=true) - [result](BeerList%20(Scala)/result.docx?raw=true)

### [Collections](ListExample%20(Java)/Readme.md)

While simple scenario such as repeating of a table rows is supported, arbitrary nesting is also supported - nesting collection inside a collection inside a collection...

[template](ListExample%20(Java)/src/main/resources/MyList.docx?raw=true) - [result](ListExample%20(Java)/result.docx?raw=true)

### [Labels](Labels%20(.NET)/Readme.md)

Word features, such as columns, can be leveraged for layout.

[template](Labels%20(.NET)/label.docx?raw=true) - [result](Labels%20(.NET)/result.docx?raw=true)

### [Named range](NamedRange%20(Java)/Readme.md)

In Excel, region fine tuning can be done via named ranges.

[template](NamedRange%20(Java)/src/main/resources/Scorecard.xlsx?raw=true) - [result](NamedRange%20(Java)/result.xlsx?raw=true)

### [Context detection](SpreadsheetGrouping%20(.NET)/Readme.md)

Context analysis will work across nested collections.

[template](SpreadsheetGrouping%20(.NET)/Grouping.xlsx?raw=true) - [result](SpreadsheetGrouping%20(.NET)/result.xlsx?raw=true)

### [Excel links](ExcelLinks%20(Java)/Readme.md)

Various Excel features are supported.

[template](ExcelLinks%20(Java)/src/main/resources/Links.xlsx?raw=true) - [result](ExcelLinks%20(Java)/result.xlsx?raw=true)

### [Special Word objects](ExternalLinks%20(.NET)/Readme.md)

Various Word features are supported.

[template](ExternalLinks%20(.NET)/Links.docx?raw=true) - [result](ExternalLinks%20(.NET)/result.docx?raw=true)

### [Mail merge](MailMerge%20(.NET)/Readme.md)

Inserting pictures via plugins allows for simple templates.

[template](MailMerge%20(.NET)/letter.docx?raw=true) - [result](MailMerge%20(.NET)/result.docx?raw=true)

### [Pivots](PivotExample%20(Java)/Readme.md)

Integration with complex office features gets the most out of Templater.

[template](PivotExample%20(Java)/src/main/resources/Pivot.xlsx?raw=true) - [result](PivotExample%20(Java)/result.xlsx?raw=true)

### [Excel pushdown](PushDownExample%20(Java)/Readme.md)

When region extends, stuff needs to be moved around.

[template](PushDownExample%20(Java)/src/main/resources/MyTable.xlsx?raw=true) - [result](PushDownExample%20(Java)/result.xlsx?raw=true)

### [.NET DataSet](DataSet%20(.NET)/Readme.md)

Master-detail relationship in DataSet type. Injecting colors via XML type.

[template](DataSet%20(.NET)/SampleLetter.docx?raw=true) - [result](DataSet%20(.NET)/result.docx?raw=true)

### [Dynamic resize](DynamicResize%20(Java)/Readme.md)

When number of columns is unknown - two dimensional objects can be used.

[template](DynamicResize%20(Java)/src/main/resources/GroceryList.docx?raw=true) - [result](DynamicResize%20(Java)/result.docx?raw=true)

### [Conversion to formulas](ToFormulaConversion%20(.NET)/Readme.md)

Special tag **[[equals]]** is used to convert cells into formulas.

[template](ToFormulaConversion%20(.NET)/SimpleConversion.xlsx?raw=true) - [result](ToFormulaConversion%20(.NET)/result.xlsx?raw=true)
