## Tables in PowerPoint

Simple tag replacement will fulfill basic requirements, but collections and tables are required for anything non-trivial.

Tags placed on a resizable location such as table combined with a collection will result in new rows on a table.

### Standard processing

Templater has built-in processor for typed and dictionary collections/DataTable/ResultSet, which *knows* how to process them. 
In that case more style formatting can be applied on the document since cell styles are preserved during duplication.

### Dynamic resize

Dynamic resize feature is supported in PowerPoint format too (as are many other features).
Table will get additional rows/column as defined by the relevant data type passed in for replacement (collection size/width, result set columns/rows)
It will also respect *merge-nulls* and *span-nulls* metadata for cell merging.