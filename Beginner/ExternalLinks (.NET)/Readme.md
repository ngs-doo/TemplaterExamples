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