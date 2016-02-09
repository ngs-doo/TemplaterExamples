## Simple Spreadsheet

Introductory example. 

Passing in anonymous class to Templater which maps it's properties to tags in Excel spreadsheet document.
Templater will use reflection to extract public properties and match it with tags detected in the provided template.

### Tag format

Tags can have one of two formats:

 * [[tag]]
 * {{tag}}

### Reflection rules

Only public properties are analyzed by Templater. Fields, properties or zero argument methods are used for matching tags.

### Spreadsheet types

Specific types are converted into *Excel* format, such as:

 * numbers
 * DateTime

which means cell formatting can be used (instead of string conversions)

### Formatting

Templater will maintain formats such as fonts, styles and color.