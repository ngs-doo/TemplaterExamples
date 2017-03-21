## Shared collection

Up until version 2.3 Templater only could replace first item in its queue.
In version 2.3 new index based low level API was introduced.

This opens up new scenarios which can be supported by Templater (either out of the box, or through custom plugins).

When Templater opens up document, it will scan every tag and place it in a queue based on the document layout.
**replace(tag, value)** will only work on the first item in that queue.
New **replace(tag, index, value)** work on any item in the queue.

Previously if similar document wanted to be processed, Templater could do it out of the box only if you had two different property names (pointing to the same collection).

*Note*: this works since tables have different tags. If both tables had the same tags, Templater would behave differently.
It would replace/resize only the first table. If both tables need to be replaced, this can be done with a workaround,
by adding **:repeat** metadata to one of the tags.

### Image and DPI

ImageInputStream will be inserted into the document using original file format and DPI info