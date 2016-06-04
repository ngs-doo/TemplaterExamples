## HTML -> OOXML conversion

Inserting HTML into Excel.

Using external library for HTML -> OOXML conversion (and fixing resulting XML so it's appropriate for Excel)

Using *Element* to paste raw XML into Templater.

### Special data type - Element

Templater supports Element and array of Elements as raw input. This means it will be injected into Excel as-is instead of first translated into string value (or some special value such as Image).
This allows customization such as dynamically specifying color of text element or various other supported as simple XML insert.

### Plugin example

String is usually pasted as-is into the document (except in case when it contains newlines, in which case it must be slightly modified during insert). This example shows how metadata can be used to specify string -> Element conversion. For this external HTML -> DOCX library is used.

Templater doesn't have built-in HTML -> XLSX conversion, but this example shows off how this can be done with external library and custom plugins.

### Conditional formatting resizing

Templater will adjust range for conditional formating during resize operation.