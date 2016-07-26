## Word and DataTable

How DataTable can be used in Word. Header metadata.

Two basic ways to use a single DataTable. When column count is unknown and when column count is known.
Templater will respect the width of the table. When column count is know detailed style can be applied to it.

### Dynamic resize

DataTable can be used in dynamic resize way (sending DataTable to low level API). In this case table will be stretched to match rows and columns in provided DataTable.
To inject column names from DataTable, **:header** metadata must be used; otherwise only data will be imported.

### Standard processing

Templater has built-in processor for DataTable, which *knows* how to process DataTable. In that case more style formatting can be applied on the document.

### merge-nulls metadata

One of the internal metadata (meaning it can't be implemented as a simple plugin) is **merge-nulls**.
It can be used for merging cells when they contain null value.