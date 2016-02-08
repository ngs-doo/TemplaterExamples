##Dynamic table expanding feature

Shows how to add a dynamic table. Special type: String[][] is used

Dynamic table addition works by defining an empty template that contains a table and a tag.

That tag is later replaced by a Java array, in this case a 2D String array.
Previous versions of Templater required the expand keyword, now it can be removed and it will just work as expected.

Streams can be used for input/output. In this example output is first stored in byte array stream and later saved to docx document.
