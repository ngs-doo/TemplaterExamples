## HTML Plugin

Inserting HTML into docx.

Using external library for converting HTML into DOCX format.

Using *XElement* to paste raw XML into Templater.

### Special data type - XElement

Templater supports XElement and collection of XElements as raw input for Word. This means it will be injected into Word as-is instead of first translated into string value (or some special value such as Image).
This allows customization such as dynamically specifying color of text element, inserting list or various other ones supported as simple XML insert.

### Plugin example

String is usually pasted as-is into the document (except in case when it contains newlines, in which case it must be slightly modified during insert). This example shows how metadata can be used to specify string -> XElement conversion. For this external HTML -> DOCX library is used.

Templater doesn't have built-in HTML -> DOCX conversion, but this example shows off how this can be done with external library and custom plugins.
