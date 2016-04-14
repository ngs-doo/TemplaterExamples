## Excel context rules

Demystifying Excel context rules. 

Excel objects can influence behavior of context during resizing.
Formulas follow special rules if they are referenced within or outside of currently resizing context.

### No special elements

When there are no special elements in resizing context (as in *Simple* sheet) Templater will duplicate regions of the document as if they should be separately processed.
This default works in most cases, but sometimes we need some special rules.
If for example we wanted to display a two dimensional list, so that player name is repeated on each row, we can do it by changing the input model and sending such list.
This is the ideal way to use Templater, since it doesn't require any special consideration.

But to understand better how Templater can be used, let's explore alternatives for repeating player name without changing the model.

### Table within the nested context

If table exists within the nested context, it will always be duplicated. Since tables can't span multiple rows and have various restrictions, they are always duplicated.
In this template table is not even visible, since it doesn't have header, or style, so it behaves as an invisible element.
Table is used to change the nested context, since if it wasn't there, resizing would behave as in *Simple* sheet. 
Since table is there, Templater will change the context to include both formula and [[club]] tag.

### Named range within the nested context

Named range has two distinct behaviors when inside nested context. 
If height of nested range matches the height of outer context, nested context will be stretched instead of duplicated.
Templater doesn't know how context will be used in the future and this case shows when such reasoning can lead to wrong behavior.
To get the same behavior as with table, larger outer named range was defined.
In that case Templater will duplicate named range (instead of resizing it) which is the behavior better suited for this use case.

### Formula rewriting

Templater will rewrite/duplicate formulas when cells are moved around. 
In this case, by using fixed position formula, Templater will reference same cell within the context.


### Auto filter resizing

Last sheet contains an auto-filter which in the Template spans currently defined region of the document.
Templater will adjust it's region during resize operation on the low level API, which makes it include new values in the filter, not just the original one.