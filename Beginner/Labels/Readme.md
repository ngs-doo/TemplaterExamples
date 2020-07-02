## Lables

Printout logic is mostly in Word. 

By defining multiple columns in a document, you can control the presentation flow.

### Layout formatting

Since Templater is built around idea for document formatting within existing tools, such as Word and Excel, it leverages various *tricks* for laying out complex documents.

Table without borders can be used as region which will be used for duplication.

Multiple columns feature can be used to flow the table multiple times on a single page. Alternative would be to use multiple tags and do more logic in application, such as 

    [[Name1]] [[Name2]] [[Name3]]

or

    [[First.Name]] [[Second.Name]] [[Third.Name]]

but often using built-in Word/Excel features offer for more convenient solution.

### Tag analysis

Built-in type processor for dictionary collection will analyze all elements of the collection to find best context matching tags within the document and keys in dictionaries.

### Barcodes

Fonts can be used in creative ways and one such way is to printing barcodes via custom fonts.
If font is embedded in the document, document will open even on systems which do not have such fonts installed.     