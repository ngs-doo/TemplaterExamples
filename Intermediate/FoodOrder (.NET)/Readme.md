## Food Order

Simple application combining various Templater features.

Templater is useful when you need to create pretty documents since it will allow you to prepare template in Word and Excel.
This way nice looking documents is not programmed, but only populated with data.

In Excel, tables are combined to produce a non-trivial result. Newer version of Templater would work with such template even in tables were not used, but just plain cells.

In Word, ordered list is used to present information in visually good looking way. Also, built-in keyword join is used to concatenate collection of strings into a single row. With Templater 2 custom keywords can be added too (or default ones can be overridden).

### Lists

Word lists are recognized as repeatable elements. Nested list maps very well to nested collections. In some cases even recursion can be used to build really complex lists.

### Primitive collections

Templater requires objects for processing collection (in a sense that using string list or image list will not produce expected behavior). Some plugins (such as join) work on collections and convert them into more appropriate representation.

### Excel formatting

Dates after 1.1.1970 are sent to Excel via native format (double value). Dates before are sent as string values. Native formats are appropriate for formatting within Excel.

### Pushdown

When region of the document is resized, cells/objects bellow it must be changed appropriately. Usually this involves moving cells down, but in some cases has more complex behavior.