## Plugins and non-trivial documents

Learning how to extend Templater via plugins and create more complicated reports.

### [Combining basics](FoodOrder%20(.NET)/Readme.md)

The path to good looking reports is to create a good looking template.

[Word template](FoodOrder%20(.NET)/FoodOrder.Web/App_Data/Order.docx?raw=true) - [result](FoodOrder%20(.NET)/result.docx?raw=true)

[Excel template](FoodOrder%20(.NET)/FoodOrder.Web/App_Data/Order.xlsx?raw=true) - [result](FoodOrder%20(.NET)/result.xlsx?raw=true)

[CSV template](FoodOrder%20(.NET)/FoodOrder.Web/App_Data/Order.csv) - [result](FoodOrder%20(.NET)/result.csv)

### [Overriding builtin plugins](BoolOverride/Readme.md)

How to register custom plugin instead of built-in one.

[template](BoolOverride/template/Bools.docx?raw=true) - [result](BoolOverride/result.docx?raw=true)

### [Providing alternative values](AlternativeProperty/Readme.md)

How to provide additional data to plugin which is not supported by Templater API.

[template](AlternativeProperty/template/Fields.docx?raw=true) - [result](AlternativeProperty/result.docx?raw=true)

### [Handling missing properties](MissingProperty/Readme.md)

Cope with missing values in dynamic input.

[template](MissingProperty/template/dynamic.docx?raw=true) - [result](MissingProperty/result.docx?raw=true)

### [Excel tables](IsoCountries%20(.NET)/Readme.md)

Templater understand tables and will retain colors, fonts and other cell styles while processing documents.

[template](IsoCountries%20(.NET)/Templates/Countries.xlsx?raw=true) - [result](IsoCountries%20(.NET)/result.xlsx?raw=true)

### [Pictures in Word](Pictures/Readme.md)

Injecting image at the tag location.

[template](Pictures/template/Pictures.docx?raw=true) - [result](Pictures/result.docx?raw=true)

### [ResultSet](ResultSetExample%20(Java)/Readme.md)

JVM version supports ResultSet. Context can span multiple rows.

[template](ResultSetExample%20(Java)/src/main/resources/MyCoffeeTable.xlsx?raw=true) - [result](ResultSetExample%20(Java)/result.xlsx?raw=true)

### [Tag regex and unicodes](QuestionnairePlugin/Readme.md)

Tag format can be configured via custom regex. Characters such as checkbox can added through unicode.

[template](QuestionnairePlugin/template/questions.docx?raw=true) - [result](QuestionnairePlugin/result.docx?raw=true)

### [Exploring plugins](LimitPlugins/Readme.md)

Limiting maximum displayed results via plugins.

[template](LimitPlugins/template/Limits.docx?raw=true) - [result](LimitPlugins/result.docx?raw=true)

### [Importing simple documents](DocxImport/Readme.md)

Documents are mostly XML. Templater can import XML as is.

[template](DocxImport/template/Master.docx?raw=true) - [import](DocxImport/template/ToImport.docx?raw=true) - [result](DocxImport/result.docx?raw=true)

### [Excel pictures and charts](ExchangeRates%20(.NET)/Readme.md)

Binding chart to data source populated by Templater.

[template](ExchangeRates%20(.NET)/Templates/ExchangeRate.xlsx?raw=true) - [result](ExchangeRates%20(.NET)/result.xlsx?raw=true)

### [Conditional removal](CollapseRegion/Readme.md)

Parts of document can be removed.

[template](CollapseRegion/template/Collapse.docx?raw=true) - [result](CollapseRegion/result.docx?raw=true)

### [Excel context explained](ExcelContextRules/Readme.md)

Tweaking the result via formulas, named ranges and tables.

[template](ExcelContextRules/template/flattening.xlsx?raw=true) - [result](ExcelContextRules/result.xlsx?raw=true)

### [Charts in Word](ChartExample/Readme.md)

Charts are embedded Excel files.

[template](ChartExample/template/Charts.docx?raw=true) - [result](ChartExample/result.docx?raw=true)

### [Formula rewriting](Formulas/Readme.md)

Templater will rewrite formulas affected by resize actions.

[template](Formulas/template/Formulas.xlsx?raw=true) - [result](Formulas/result.xlsx?raw=true)

### [Importing HTML in Word](HtmlToWord/Readme.md)

HTML can be imported via external library which knows how to do HTML -> DOCX conversion.

[template](HtmlToWord/template/template.docx?raw=true) - [result](HtmlToWord/result.docx?raw=true)

### [Importing HTML in Excel](HtmlToExcel/Readme.md)

HTML can be imported via external library which knows how to do HTML -> OOXML conversion.

[template](HtmlToExcel/template/Document.xlsx?raw=true) - [result](HtmlToExcel/result.xlsx?raw=true)

### [Nesting lists and tables](ListsAndTables/Readme.md)

Deep nesting in practice.

[template](ListsAndTables/template/Nesting.docx?raw=true) - [result](ListsAndTables/result.docx?raw=true)

### [Shared collection](SharedCollection/Readme.md)

Different parts of same collection can be used in different tables.

[template](SharedCollection/template/TwoTables.docx?raw=true) - [result](SharedCollection/result.docx?raw=true)

### [Various ways to populate Word table](WordTables/Readme.md)

By combining various features, complex layouts can be created.

[template](WordTables/template/Tables.docx?raw=true) - [result](WordTables/result.docx?raw=true)

### [Passing JSON to templates](TemplaterJson/Readme.md)

Since Templater is very good at processing dynamic inputs, JSON can be passed in to populate specific templates.
