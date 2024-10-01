## DOCX import

### XML type support

Templater recognizes Element and Element[] data types.
Instead of replacing tag with a string value, XML is injected into document as-is.

While this works for trivial cases, it doesn't cover wide range of Word features
(picture in the imported document will be filtered out so it doesn't corrupt resulting document).

By default Templater will inject Element after the specified tag into a new paragraph (or other appropriate level).
This will leave old paragraph empty, which might lead to whitespace bloat. To deal with those scenario, Templater has few builtin metadata keywords:

 * remove-old-xml - which will remove previous paragraph after XML is inserted
 * replace-xml - which will insert XML at the place of the paragraph (instead of after it)
 * merge-xml - which will merge provided XML into the found structure

### AltChunk support

With version 6.1 Templater also supports document embedding in Word. This can be used for document merging, HTML/RTF import and similar purposes.
To import embedded document, special type must be used:

  * **System.IO.FileInfo** in C#
  * **java.io.File** in Java

This works for non-trivial cases, as images, tables and other objects can be imported this way.
When replacing such tag, Templater will check if previous tag location would leave paragraph empty.
In that case it will remove old paragraph to not leave whitespace around.

Templater will recognize tags inside embedded documents, so this will work seamlessly in various use cases.

#### Special support for HTML extensions

By default embedding is added as a new paragraph after the tag location. In cases when HTML is embedded, Templater will try to add it at the tag location,
which enables its uses as tag inside a table and regular resize behavior.