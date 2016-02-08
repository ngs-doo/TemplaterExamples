Dynamic table expanding feature

The following example for templater in Java shows how dynamic tables are added.
Dynamic table addition works by defining an empty template that contains a table and a tag.

That tag is later replaced by a Java array, in this case a 2d String array.
Template also contains the keyword expand, which is a templater keyword for expanding table cells.

When templater processes the tag or replaces the tag with a java object,
it can be stored in a byte array, and later written in a docx document.
