## Integrating with XML binding 

Templater supports integration with Word XML binding feature, meaning it will resize/replace and bind XML defined in the document.
This example shows how to combine Word custom XML feature which is useful for getting feedback through Word (user is sent a databound document and he only inputs few values in the provided custom controls).
There are several articles about XML binding feature:

 * https://msdn.microsoft.com/en-us/library/bb398244.aspx
 * https://msdn.microsoft.com/en-us/library/bb608618.aspx
 * https://msdn.microsoft.com/en-us/library/bb510135(v=office.12).aspx
 
Older versions of Word don't have built in support for editing XML bindings, so an external tool can be used for such purpose: https://dbe.codeplex.com/

XML files are stored in `customXml` folder in the `docx` zip file.

### Resizing/cloning support

When possible (for few simple scenarios) Templater will map provided resizing tags to XML bindings.
If they have a shared XML element, that element will be duplicated and bindings updated accordingly.

### Replacing bindings 

When low level API `replace` is used, Templater usually replaces just a single tag. 
Since tags for XML bindings are just a cache replacing a single tag will actually replace all tags with the same binding.

### Non bound content control

Content controls can be used without binding with XML in which case they will behave just as any other tag.

### Bound lists

Some Content controls such as Dropdown lists and ComboBoxes support element binding, which allows for easy elements population.