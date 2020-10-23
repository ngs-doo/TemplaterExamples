## Collapse Example

To be able to create complex document, conditional display should be possible.
Templater way of doing conditional display is using **:collapse** metadata (which is just a built-in plugin).

### Collapse metadata plugin

Collapse plugin checks if provided value is null or empty and in which case it invokes resize(0) on that specific tag.

### Bean standard support

Since v3 bean standard is supported and enabled by default. Both bean name and actual names can be used.

### Custom collapse plugin

Builtin collapse is just a plugin which can be registered from the outside.
Here a plugin collapseIf(Value) is shown which will do the collapse only if the property has specific value.

### Section support + custom handler for removing sections

Templater uses document structure to infer beginning/end of the replicating context.
Along the table/list/page/whole document as of v2.5 Templater supports sections. When all specified tags are inside a section that range will be used as a context.
Example shows how to display special table when there are no rows (since default behavior is just to remove the template row - and leave the header).
Appropriate section will be removed based on the custom metadata and the appropriate handler.
Handler will iterate through all tags with the same name and either invoke collapse of that region or hide the tag.

### Content controls as removable region

Content controls can be used as an alternative way for conditional removal.
They can be utilized in various other ways, as they can be nested,
can contain other tables and lists, or can be used to remove part of table cell, paragraph or list item.

### Coloring

Templater doesn't have coloring API, but to implement coloring you can drop down to XML format and send in appropriate XML.
In this case to specify background color for a cell, Word uses properties such as:

    <w:tc>
      <w:tcPr>
        <w:shd w:val="clear" w:color="auto" w:fill="COLOR" />
      </w:tcPr>
    </w:tc>

As of v2.5 Templater can use merge-xml metadata as instruction to merge provided XML to the surrounding context. This way we can "append" color to the appropriate place.

### Verbalizing numbers

A common use case is for providing number expressed as words.
This feature can be easily implemented via external plugin which does tha appropriate conversion.

### Whole page removal

resize(tags, 0) will invoke removal of document content between sections, so when paired with section page break, 
it can be used to conditionally remove several pages of document.
Templater will skip over ordinary page break, but section page break will be used as starting or ending location.

### Collapse best practice

While collapse can be used in various scenarios,
if it can be avoided it should be avoided in favor of better data structure.
Templater will by default collapse empty collections and similar types,
which is a more natural way to model template -> it will lead to simpler templates
without "magic" tags for the purpose of conditional removal.