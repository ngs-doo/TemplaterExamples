## DOCX import

Templater recognizes Element and Element[] data types.
Instead of replacing tag with a string value, XML is injected into document as-is.

While this works for trivial cases, it doesn't cover wide range of Word features
(picture in the imported document will be filtered out so it doesn't corrupt resulting document).