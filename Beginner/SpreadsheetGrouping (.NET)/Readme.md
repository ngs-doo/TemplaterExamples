##Spreadsheet Grouping

Nested collection example. Use of named range for better control.

Templater will try it best to match collections and it's nested collections to appropriate region.
It does that by finding minimum spanning context which contains all required tags.
It then duplicates that context based on number of items in the provided collection.

Named range can be used to define larger region which Templater will use for duplication. 
Alternatively additional tags which will be hidden can be used instead of named range.
