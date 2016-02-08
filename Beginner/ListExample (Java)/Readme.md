##ListExample

Working with collections.

When collection is provided to Templater, it will try to match appropriate region and duplicate it.
For example if row in a table is matched as a region, Templater will then replicate that row and replace duplicated items with provided collection.

Region can also span several rows, can be a list or Templater can just decide to replicate entire document.
Reflection is used to extract public fields and methods from the class which are then matched agains the document to create appropriate mapping.
