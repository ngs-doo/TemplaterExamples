## HTML -> OOXML conversion

Templater will rewrite expressions inside formulas when their parts are moved or stretched.
This feature also works on horizontal resize.

### Rewriting

Each formula is parsed and analyzed by Templater.
On push, resize and cloning formulas are changed, duplicated and readjusted.
Templater doesn't evaluate formula, it just rewrites its expressions.

### Conversion to formula

On flushing Templater will go though all remaining `[[equals]]` tags and convert them into formulas.
Since Excel doesn't allow [[tag]] or {{tag}} expressions inside formula, this is a workaround for changing text into formula.