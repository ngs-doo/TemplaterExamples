## Dynamic resize feature

While most usage of Templater involves table with predefined columns, so that only rows are created,
sometimes for unknown number of columns, it's useful to expand table both horizontally and vertically.

While styling will be more limited in that case, table style will still be respected.

### Special type - String[][]

Dynamic resize works on low level API by detecting special data type: String[][] and first resizing table to appropriate size
and then populating cell contents with provided data.

### Streaming

Streams can be used for input/output. 
Output stream will be populated on `ITemplaterDocument.flush()` method.
