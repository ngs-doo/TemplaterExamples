## List Example

Working with collections.
Multiple levels of collections.

### Tag detection

Templater object processor uses reflection to match fields and zero argument methods to tags in document.
Matching is done on exact names and doesn't support Java bean standard (this means to match getter, exact getter name must be used).
Only public properties are analyzed.

### Context matching

Tags are matched with minimum spanning context, in this case for top level list send to processing, all tags are matched resulting in page duplication.
When horse collection is analyzed, only tags inside a table are matched, resulting in duplication of that portion of the table (single row in this case).

### Data type plugins

Templater has several built-in type processors, such as:

 * object processor
 * iterable processor
 * result set processor
 * map processor
 
when object is provided to high level API, best processor is picked for that data type.
On each navigation, procedure is repeated.

This allows Templater to use same template when list is sent as top level argument (as in this example) 
or just when single object is sent to top level argument, in which case processing will be done immediately object processor,
instead of iterable processor as it is done in this case.

### Iterable processor

Iterable processor works by matching tags with properties and calls low level `resize` API. 
After that each item in the collection will be sent to the most appropriate processor (in this case object processor). 
Replicated context for each item will have it's own identity, which allows Templater to replace multiple tags of same name within the context.

### Footnotes and endnotes

Templater recognizes tags in footnotes and endnotes and will maintain context during replacement.
This means if tag is repeated multiple time, or only within the note, it will behave as expected.