## Formula rewriting

Templater will rewrite expressions inside formulas when their parts are moved or stretched.
This feature also works on horizontal resize.

### Rewriting

Each formula is parsed and analyzed by Templater.
On push, resize and cloning formulas are changed, duplicated and readjusted.
Templater doesn't evaluate formula, it just rewrites its expressions.

### Conversion to formula

On flushing Templater will go though all remaining `[[equals]]` tags and convert them into formulas.
Since Excel doesn't allow `[[tag]]`, `{{tag}}` or `<<tag>>` expressions inside formula, this is a workaround for changing text into formula.

### Merge cell stretching

Merge cell require at least two cells to be defined. 
Therefore template contains tag `[[groups.description]]` across two cells so that it's not duplicated on resize, but rather stretched.

### References to "removed" sheet

Sheet can be removed with a resize(tags, 0) when tag is located within a sheet tab or it has special :sheet or :page metadata.
Still, formulas referencing that sheet will continue working, as sheet is not really removed, just special very hidden visibility is set on it.