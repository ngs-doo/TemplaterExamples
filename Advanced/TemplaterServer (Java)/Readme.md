## Templater Server

Example of running a templating processes on a small server with a preset templates, as demonstrated [on the demo page](http://templater.info/demo).

Start the server from within IDE or by running

    java -jar templater-server.jar

And open your browser to `localhost:7778`

Templates reside in `resources/templates`.
Each of them has a respectable json example in `resources/examples`.

### Examples

Examples are showing specific features of Templater

#### Beer list

Navigation through fields with `.` operator.

Single row is used for duplicating collection. Specific cell can span multiple rows and have different style within.
Row cells maintain their style, such as font, alignment and various others.

Numbers are converted into string with toString method (as shown in `[[beers.rating]]`).
Numbers can be formatted and localized with **:format(pattern)**. `format(pattern)` is built-in plugin for formatting various data types.

#### Benchmarks

Low level API has `clone` method, which is used to duplicate entire document (in this case a single sheet) and isolate it (each instance of `ITemplater` has it's own set of tags).
`clone` can be used through special metadata, as shown in the example.

Templater will duplicate objects through clone and readjust used formulas to new sheet. In the example, formulas are updated to reflect table/named range duplication.

Graphs are built off populated tables.
Pushdown will move tables to appropriate position.

#### Charts

Excel charts can be created based on data source (either table or range).
Charts in Word are just embedded Excels.

#### Collapse

Regions of text can be removed with :collapse metadata (which just calls built-in plugin).
Default implementation will collapse region of document if null, empty or true value is provided.

In this example, :clone is required, since two elements are being sent for processing and Templater doesn't cope with it otherwise.
While :collapse will remove tags, processor will still continue trying to replace the missing tags, so empty values will end up on the next context.

#### Links

Anchors are also analyzed for tags. This allows custom parts of the link to be populated with Templater.

Pictures in cells are duplicated to each new row.
WordArts are also recognized by Templater.

#### Formulas

Templater will rewrite formulas when cells are duplicated or moved around.

Since Excel doesn't allow defining tag within formula, Templater has an "alternative way" to convert tag into formula.
Tags which start with [[equals]] are converted into formula at the end of processing.

#### Groceries

Dynamic resize works on Object[][] or List<List<Object>> types.

#### Label

Templater is build so that templates can be designed with Word/Excel. 
This means utilizing various their features for layout, such as multiple columns in Word.
Table can be defined without border, so it doesn't look like table, but behaves as one.

#### Dynamic data types

Built-in processors for map/collections allow for working with dynamic types (even without reflection).
It's also possible to combine several processors on a single object.

#### Nesting

Collections can be nested in other collections. This allows usage of Templater for very complex documents.
Lists can be embedded within Tables.

#### Table pushdown

During processing in non trivial Excel documents, cells are often moved around.
Special rules exists for tables, named ranges, merge cells, formulas and various other objects.
Templater will rewrite formulas, ranges for data sources so they are still valid after tables/ranges have been resized.
Depending on the context, objects such as merge cells and ranges can be stretched or moved.

#### Sales order cloning

Row context can span multiple rows/columns.
Since context can be nested, this allows for very complex document layouts.
Text based watermark is supported.
Currently it requires usage of :all metadata, since watermark is repeated multiple times in different document parts.

#### Scorecard

Nested contexts can also be used in Excel. Named range can act as user-defined context.
While tags will be analyzed during resize, values will not. 
In that case processing of document in multiple stages is required.