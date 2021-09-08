## Paragraphs

Templater resize might not work as expected for paragraphs. 

This is due paragraphs not being considered resizable context by Templater. 
Still, resizing of paragraphs is often useful, but luckily it can be easily simulated via resizable contexts such as lists and tables.

### Line Spacing Options

Word supports various indentation options. By default ordinary paragraphs, lists and tables have different defaults.
But by tweaking the values a bit, same visual style can be obtained for all of them

### Table borders

Common "trick" to use resizable context is to have table without borders. While borders of such table are still visible in the editor,
they are not visible in the output or printout.

### No bullet list

Lists can be defined with different bullet styles. 
But bullet style can also be no bullet in which case it's hard to distinguish list items from ordinary paragraphs.
When placing caret in such a list, Word will highlight the list dropdown in the Ribbon. 

### Content controls

Content controls can be used to implement part of paragraph conditionality. If resize(tag inside content control, 0) is invoked, only content control will be removed.
This works even when content control is inside lists or table.
This way sections of the text can be easily removed without using specific text as part of the tag or as value inside a tag.
TextBox has the same behavior as content control when it comes to removal

### Repeating Section Content control

This is a special kind of Content control which allows for easy duplication of document region. Its available since Templater v6.1 and Word 2013+.
