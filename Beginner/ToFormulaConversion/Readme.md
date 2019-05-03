## Conversion to formula

Excel doesn't allow usage of `{{tag}}`, `<<tag>>` or `[[tag]]` inside formulas.

Therefore tag expressions can only be defined as standard text values.
But Templater recognizes special tag `[[equals]]` which causes conversion of the text field into formula.

Be careful to have all tags evaluated, otherwise Excel will complain about corrupted document.