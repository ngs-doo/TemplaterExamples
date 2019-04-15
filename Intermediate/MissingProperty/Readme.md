## Handling missing values with dynamic structures

While Templater supports both class structures and dynamic structures, they work differently.

A common example of the difference is when a value is missing from dynamic structures.

While for class structures mapping is done using class definition, in dynamic structures mapping is done though existing values.
So when a value is missing in dynamic structure it's not obvious that it should be null.

### Configuring unprocessed tags behavior

It's quite common that users mistype a tag definition and for example write [[person.fistName]] instead of [[person.fi**r**stName]].
While an editor with checks would help here, its also often the case that developers rename tag definitions and break the previously good mappings.

Also, it's common to do a multiple step processing in which case tags will be left in the document for next step processing.

Therefore by default since v3 Templater will leave the un-replaced tags in the document as is (with extra :unprocessed metadata in certain cases), instead of removing them.
Before v3 Templater was leaving tags in the document as is in most cases, which sometimes caused issues with nested context behavior.

### Removing tags by customizing plugin

Sometimes it's still required to remove the tags.
By default this can be done at the end of processing by going through all remaining tags and removing them.

If tags should be replaced with a specific value when they are missing, additional metadata can be introduced to tags
and used during handling of unprocessed tags by replacing them with a specific value.
In this case handler will inspect tag for **missing** metadata and replace it accordingly.

### Document validation

In enterprise solutions its common to validate document on upload and match them against available tags.
This way during validations `OnUnprocessed` behavior should leave tags in the document and warn the user about typos.