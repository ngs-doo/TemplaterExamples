## Handling missing values with dynamic structures

While Templater supports both class structures and dynamic structures, they work differently.

A common example of the difference is when a value is missing from dynamic structures.

While for class structures mapping is done using class definition, in dynamic structures mapping is done though existing values.
So when a value is missing in dynamic structure it's not obvious that it should be null.

### Why tags remain at the end of processing

It's quite common that users mistype a tag definition and for example write [[person.fistName]] instead of [[person.fi**r**stName]].
While an editor with checks would help here, its also often the case that developers rename tag definitions and break the previously good mappings.

Also, it's common to do a multiple step processing in which case tags will be left in the document for next step processing.

Therefore Templater will leave the un-replaced tags in the document as is, instead of removing them.

### Removing tags at the end of processing

Sometimes it's still required to remove the tags.
In that case a simple loop at the end of processing can go through all the remaining tags and remove them.

To leave the typos as is we can remove only tags which have a specific metadata attached to them (such as **missing** metadata in this example).