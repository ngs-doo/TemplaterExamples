## Spreadsheet Grouping

Nested collection example. Use of named range for better control.

Templater will try hard to match collections and its nested collections to appropriate region.
It does that by finding minimum spanning context which contains all required tags.
It then duplicates that context based on number of items in the provided collection.

Named range can be used to define larger region which Templater will use for duplication. 
Alternatively additional tags which will be hidden can be used instead of named range.

### Custom context region - named range

When Templater default behavior - minimum spanning range for detected tags is not good enough, special elements, such as named range, can be used to redefine Templater default context.

During pushdown regions around chosen context are moved around. If named ranges, tables or merge cells are detected, rules take those elements into account so that cells are pushed as a whole and not broken by resized region.

### Nested context

When nested context is resized, outer context will change accordingly:

 * named range will be stretched
 * merge cell will be stretched or moved
 * cells bellow will be moved - rules for outer ranges influence area which will be moved

Resizing nested range in this example causes pushdown of all previously replicated regions. While this is transparent in this example, if elements were placed below special rules could be applied (depending if it's directly below, partly below or bellow to a side) 