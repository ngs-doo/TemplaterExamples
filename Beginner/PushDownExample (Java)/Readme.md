## Pushdown Example

Understanding special rules during resizing.

When context is resized, if there is anything below that context, it needs to be "moved" appropriately to make space for the context above it.

In this example entire table for daily menu is moved based on the new size for special menu. 
If daily menu table was not below the special menu table, it would not be moved. 
If only part of the daily menu table (or a named range around it) was below special menu table, entire region would be moved in that case.

### Formula rewriting

Pushdown/resizing causes Templater to rewrite formulas.
Templater doesn't evaluate formulas, but it will adjust the expression to acomodate for document changes.

### Conditional formatting

Conditional formatting can be used to highlight cell value based on it's contents.
Templater will adjust conditional formatting (move it around, duplicate or resize it) as tags are resized, moved or cloned.

### Password protection

Sheet1 is password protected with: "templater"

### Excel view mode

This excel is running in view formulas mode (to show that formula expressions are rewritten).
In this mode dates are formatted as numbers (although they are properly formatted when clicked on).