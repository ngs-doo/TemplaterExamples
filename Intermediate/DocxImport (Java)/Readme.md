## DOCX import

Templater recognizes Element and Element[] data types.
Instead of replacing tag with a string value, XML is injected into document as-is.

While this works for trivial cases, it doesn't cover wide range of Word features
(picture in the imported document will be filtered out so it doesn't corrupt resulting document).

By default Templater will inject Element after the specified tag into a new paragraph (or other appropriate level).
This will leave old paragraph empty, which might lead to whitespace bloat. To deal with those scenario, Templater has few builtin metadata keywords:

 * remove-old-xml - which will remove previous paragraph after XML is inserted
 * replace-xml - which will insert XML at the place of the paragraph (instead of after it)
 * merge-xml - which will merge provided XML into the found structure
