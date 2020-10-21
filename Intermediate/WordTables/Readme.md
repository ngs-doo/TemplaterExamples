## Word and tables

How DataTable/ResultSet can be used in Word. Header metadata.

Two basic ways to use a single DataTable/ResultSet: when column count is unknown and when column count is known.
Templater will respect the width of the table. When column count is know detailed style can be applied to it.

### Dynamic resize

DataTable/ResultSet can be used in dynamic resize way (sending them to low level API). In this case table will be stretched to match rows and columns in provided instance.
To inject column names, **:header** metadata must be used; otherwise only data will be imported.

### Standard processing

Templater has built-in processor for DataTable/ResultSet, which *knows* how to process them. In that case more style formatting can be applied on the document.

### Navigation plugin

Since v5 there is a natural way to deal with data manipulation during navigation via navigation plugin.
Navigation plugin can provide alternative object for further processing.
This can be used for various purposes:

 * returning same collection somewhat changed (limiting, sorting, filtering, ...)
 * returning totally different object/collection
 * calling methods with arguments (unlike only being able to use zero method navigation)
 * various other complex logic
 
Navigation plugin can become very unreadable really fast - so it is suggested to pair it with alias whenever possible.
That way instead of writing something like

`[[groups:sort(usage).products:filter(active).name]]`

alias can be defined like products = groups:sort(usage).products:filter(active)

and tag can look like `[[products.name]]` with all the behavior which was implicitly defined

Here, navigation was used to take top N elements from the result set in an idiomatic way. 

### merge-nulls/span-nulls metadata

Specific internal metadata (meaning it can't be implemented as a simple plugin) are **merge-nulls** and **span-nulls**.
They can be used for merging cells when they contain null value.

### Section support + custom handler for removing sections

Templater uses document structure to infer beginning/end of the replicating context.
Along the table/list/page/whole document as of v2.5 Templater supports sections. When all specified tags are inside a section that range will be used as a context.
Example shows how to display special table when there are no rows (since default behavior is just to remove the template row - and leave the header).
Appropriate section will be removed based on the custom metadata and the appropriate handler.
Handler will iterate through all tags with the same name and either invoke collapse of that region or hide the tag.

### Combining multiple features

For complex documents it's often required to combine multiple features, such as in this case dynamic resize with a static part of the table.

### Fixed metadata

When Templater detectes **fixed** in collection metadata, it will avoid calling the resize on it and will cleanup the remaining tags after it has finished processing the collection.
When collection is larger than the number of rows in the template, the remaining rows will not be replaced.
If **fixed** is used in Excel, a table should be used to differentiate between other tags in ordinary cells, otherwise only first row will be processed.