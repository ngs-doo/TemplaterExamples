## Lists and tables

Nesting different contexts.

Templater requires context for resize operation.
Context can be whole document, a page, table rows or list.
Contexts can be nested, meaning you can have list inside table

### List in a table in a list in a table in...

Lists can be defined inside table.
Tables can be defined inside lists (although that doesn't make too much sense).
Tables can be defined in other tables.
Lists can have multiple levels.

Using those simple rules, very complex documents can be created, by nesting collections inside other collections.

### Document tweaking

After table there is small space with a height of 5.
This forces Word to leave some space between tables/rows

### Locking

This document is locked with a password: "templater"
It looks as a read-only document to the user.

### Metadata plugin

Simple "load-image" plugin is registered during startup which loads image based on filename.
Templater "understands" image type and will convert it into a picture (respecting it's DPI settings)

### Tag aliases

This template uses Templater Editor tag alias feature for defining prefix `Jobs.Projects.Tasks` as `task`.
Also, schema has been defined meaning that tag listing is available with error checking.
