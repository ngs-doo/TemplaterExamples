## Named Range

Precise boundary can be specified using Excel named range feature.

Templater will find minimum spanning range, but this can be changed by specifying custom range which it will use instead.

### Resize API

In Excel Table is recognized as special element and it has some custom rules associated with it:

 * when region is duplicated which contains a table, that table must also be duplicated
 * resize(0) on a table will not remove that table, but just empty the first row. 
Unlike Word where table would be reduced to header only, in Excel table must have at least one row. 
Therefore table is not removed when Templater is asked to reduce it's size to 0.
Table can be removed if outside region is removed, for example if named range containing table is resized with 0 size.
 * column names can be used for formulas without Templater rewriting those formulas
 * resizing in Excel usually involves pushdown - elements bellow the resized object/range needs to be moved further down
 * objects which are created during resize are analyzed for tags; while leaf values are just replaced without further analysis (even if they are in the [[tag]] format)