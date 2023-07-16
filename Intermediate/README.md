## Plugins and non-trivial documents

Learning how to extend Templater via plugins and create more complicated reports.

### [Combining basics](FoodOrder%20(.NET)/Readme.md)

The path to pretty reports is to create a pretty template.

[Word template](https://github.com/ngs-doo/TemplaterExamples/raw/master/Intermediate/FoodOrder%20(.NET)/FoodOrder.Web/App_Data/Order.docx) - [result](https://github.com/ngs-doo/TemplaterExamples/raw/master/Intermediate/FoodOrder%20(.NET)/result.docx)

[Excel template](https://github.com/ngs-doo/TemplaterExamples/raw/master/Intermediate/FoodOrder%20(.NET)/FoodOrder.Web/App_Data/Order.xlsx) - [result](https://github.com/ngs-doo/TemplaterExamples/raw/master/Intermediate/FoodOrder%20(.NET)/result.xlsx)

[CSV template](FoodOrder%20(.NET)/FoodOrder.Web/App_Data/Order.csv) - [result](FoodOrder%20(.NET)/result.csv)

### [Overriding builtin plugins](BoolOverride/Readme.md)

How to register custom plugin instead of built-in one.

[template](https://github.com/ngs-doo/TemplaterExamples/raw/master/Intermediate/BoolOverride/template/Bools.docx) - [result](https://github.com/ngs-doo/TemplaterExamples/raw/master/Intermediate/BoolOverride/result.docx)

### [Providing alternative values](AlternativeProperty/Readme.md)

How to provide additional data to plugin which is not supported by Templater API.

[template](https://github.com/ngs-doo/TemplaterExamples/raw/master/Intermediate/AlternativeProperty/template/Fields.docx) - [result](https://github.com/ngs-doo/TemplaterExamples/raw/master/Intermediate/AlternativeProperty/result.docx)

### [Handling missing properties](MissingProperty/Readme.md)

Cope with missing values in dynamic input.

[template](https://github.com/ngs-doo/TemplaterExamples/raw/master/Intermediate/MissingProperty/template/dynamic.docx) - [result](https://github.com/ngs-doo/TemplaterExamples/raw/master/Intermediate/MissingProperty/result.docx)

### [Excel tables](IsoCountries%20(.NET)/Readme.md)

Templater understand tables and will retain colors, fonts and other cell styles while processing documents.

[template](https://github.com/ngs-doo/TemplaterExamples/raw/master/Intermediate/IsoCountries%20(.NET)/Templates/Countries.xlsx) - [result](https://github.com/ngs-doo/TemplaterExamples/raw/master/Intermediate/IsoCountries%20(.NET)/result.xlsx)

### [Pictures in Word](Pictures/Readme.md)

Injecting image at the tag location.

[template](https://github.com/ngs-doo/TemplaterExamples/raw/master/Intermediate/Pictures/template/Pictures.docx) - [result](https://github.com/ngs-doo/TemplaterExamples/raw/master/Intermediate/Pictures/result.docx)

### [ResultSet](ResultSetExample%20(Java)/Readme.md)

JVM version supports ResultSet. Context can span multiple rows.

[template](https://github.com/ngs-doo/TemplaterExamples/raw/master/Intermediate/ResultSetExample%20(Java)/src/main/resources/MyCoffeeTable.xlsx) - [result](https://github.com/ngs-doo/TemplaterExamples/raw/master/Intermediate/ResultSetExample%20(Java)/result.xlsx)

### [Tag regex and unicodes](QuestionnairePlugin/Readme.md)

Tag format can be configured via custom regex. Characters such as checkbox can added through unicode.

[template](https://github.com/ngs-doo/TemplaterExamples/raw/master/Intermediate/QuestionnairePlugin/template/questions.docx) - [result](https://github.com/ngs-doo/TemplaterExamples/raw/master/Intermediate/QuestionnairePlugin/result.docx)

### [Exploring plugins](LimitPlugins/Readme.md)

Limiting maximum displayed results via plugins.

[template](https://github.com/ngs-doo/TemplaterExamples/raw/master/Intermediate/LimitPlugins/template/Limits.docx) - [result](https://github.com/ngs-doo/TemplaterExamples/raw/master/Intermediate/LimitPlugins/result.docx)

### [Importing/merging documents](DocxImport/Readme.md)

Documents can be embedded or added directly as XML.

[template](https://github.com/ngs-doo/TemplaterExamples/raw/master/Intermediate/DocxImport/template/Master.docx) - [import](https://github.com/ngs-doo/TemplaterExamples/raw/master/Intermediate/DocxImport/template/ToImport.docx) - [result](https://github.com/ngs-doo/TemplaterExamples/raw/master/Intermediate/DocxImport/result.docx)

### [Excel pictures and charts](ExchangeRates%20(.NET)/Readme.md)

Binding chart to data source populated by Templater.

[template](https://github.com/ngs-doo/TemplaterExamples/raw/master/Intermediate/ExchangeRates%20(.NET)/Templates/ExchangeRate.xlsx) - [result](https://github.com/ngs-doo/TemplaterExamples/raw/master/Intermediate/ExchangeRates%20(.NET)/result.xlsx)

### [Conditional removal](CollapseRegion/Readme.md)

Parts of document can be removed.

[template](https://github.com/ngs-doo/TemplaterExamples/raw/master/Intermediate/CollapseRegion/template/Collapse.docx) - [result](https://github.com/ngs-doo/TemplaterExamples/raw/master/Intermediate/CollapseRegion/result.docx)

### [Excel context explained](ExcelContextRules/Readme.md)

Tweaking the result via formulas, named ranges and tables.

[template](https://github.com/ngs-doo/TemplaterExamples/raw/master/Intermediate/ExcelContextRules/template/flattening.xlsx) - [result](https://github.com/ngs-doo/TemplaterExamples/raw/master/Intermediate/ExcelContextRules/result.xlsx)

### [Charts in Word](ChartExample/Readme.md)

Charts are embedded Excel files.

[template](https://github.com/ngs-doo/TemplaterExamples/raw/master/Intermediate/ChartExample/template/Charts.docx) - [result](https://github.com/ngs-doo/TemplaterExamples/raw/master/Intermediate/ChartExample/result.docx)

### [Formula rewriting](Formulas/Readme.md)

Templater will rewrite formulas affected by resize actions.

[template](https://github.com/ngs-doo/TemplaterExamples/raw/master/Intermediate/Formulas/template/Formulas.xlsx) - [result](https://github.com/ngs-doo/TemplaterExamples/raw/master/Intermediate/Formulas/result.xlsx)

### [Importing HTML in Word](HtmlToWord/Readme.md)

HTML can be imported natively or via external library which knows how to do HTML -> DOCX conversion.

[template](https://github.com/ngs-doo/TemplaterExamples/raw/master/Intermediate/HtmlToWord/template/template.docx) - [result](https://github.com/ngs-doo/TemplaterExamples/raw/master/Intermediate/HtmlToWord/result.docx)

### [Importing HTML in Excel](HtmlToExcel/Readme.md)

HTML can be imported via external library which knows how to do HTML -> OOXML conversion.

[template](https://github.com/ngs-doo/TemplaterExamples/raw/master/Intermediate/HtmlToExcel/template/Document.xlsx) - [result](https://github.com/ngs-doo/TemplaterExamples/raw/master/Intermediate/HtmlToExcel/result.xlsx)

### [Nesting lists and tables](ListsAndTables/Readme.md)

Deep nesting in practice.

[template](https://github.com/ngs-doo/TemplaterExamples/raw/master/Intermediate/ListsAndTables/template/Nesting.docx) - [result](https://github.com/ngs-doo/TemplaterExamples/raw/master/Intermediate/ListsAndTables/result.docx)

### [Shared collection](SharedCollection/Readme.md)

Different parts of same collection can be used in different tables. Digital signatures.

[template](https://github.com/ngs-doo/TemplaterExamples/raw/master/Intermediate/SharedCollection/template/TwoTables.docx) - [result](https://github.com/ngs-doo/TemplaterExamples/raw/master/Intermediate/SharedCollection/result.docx)

### [Shared charts](SharedCharts/Readme.md)

Data source can be repeated even in the embedded Excels within PowerPoint files.

[template](https://github.com/ngs-doo/TemplaterExamples/raw/master/Intermediate/SharedCharts/template/charts.pptx) - [result](https://github.com/ngs-doo/TemplaterExamples/raw/master/Intermediate/SharedCharts/result.pptx)

### [Various ways to populate Word table](WordTables/Readme.md)

By combining various features, complex layouts can be created.

[template](https://github.com/ngs-doo/TemplaterExamples/raw/master/Intermediate/WordTables/template/Tables.docx) - [result](https://github.com/ngs-doo/TemplaterExamples/raw/master/Intermediate/WordTables/result.docx)

### [Passing JSON to templates](TemplaterJson/Readme.md)

Since Templater is very good at processing dynamic inputs, JSON can be passed in to populate specific templates.
