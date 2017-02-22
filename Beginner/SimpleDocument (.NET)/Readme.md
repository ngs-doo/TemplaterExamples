##Simple Document

Introductory example. 

Pass in object to Templater and let it match tag in a Word document.
Templater will use reflection to extract public properties and match it with tags detected in the provided template.

### Tag format

Tags can have one of two formats:

 * [[tag]]
 * {{tag}}

### Reflection rules

Only public properties are analyzed by Templater. Fields, properties or zero argument methods are used for matching tags.

### Formatting

Templater will maintain formats such as fonts, styles and color.