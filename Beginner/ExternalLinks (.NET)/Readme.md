## Links

Using Word hyperlinks. WordArt as tags.

Pictures will be replicated as rows are replicated. 
Using collection of dynamic (Dictionary) structure.

### Element duplication

Elements within duplicated context are copied along with tags. In this case example small pictures embedded in rows are duplicated also.

### Anchor support

Except regular text, Templater also analyzes some other document elements, such as anchors. This allows for tag usage inside such elements which behave as in they were written within text. Anchor links are URI escaped which causes original [ and { tags being replaced with %5B and %7B

### Dynamic data structures

Built-in support for IDictionary data type allows usage of dynamic objects. Combining IEnumerable and IDictionary data types is also possible, as shown in this example.

### WordArt support

WordArt can be used for tag definition. It will be replaced as any other regular tag.

### Footnotes and endnotes

Footnote and endnotes are supported since v2.4.0
Templater can replace multiple tags even when they are on seemingly different places such as footnotes since their definition is within the duplicating context.

### Simple links

System.Uri will be converted to a link (with same text) from v2.9.1. Before it could be done in a way similar to hyperlink plugin in this example, which also can have different link text representation.