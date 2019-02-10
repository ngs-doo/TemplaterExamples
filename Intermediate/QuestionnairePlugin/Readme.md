## Questionnare Plugin

How to write simple plugins.

Templater 2 added plugin API. This example shows how to use it in two ways:

 * by detecting custom metadata - date in this case
 * by intercepting special data types - Questionnaire in this case; and processing it according to some special rules

### Special characters

Unicode chars can be used for inserting special looking characters into document; in this example Unicode U+2611 and U+2610 were used. One other way this could be solved is if bool metadata was used with such chars as true/false options.

### Plugin based architecture

Templater is architected in plugin oriented way. To be usable out of the box, various plugins are built into the library. 

All what those plugins do is call low level API, which means they can actually be fully replicated outside of the library (although that's non-trivial task).

#### Formatting plugin

Formatting plugin can be used to convert data value just before sending it to low level API. Formatting plugins works by intercepting tag metadata and deciding if they will act on it. Some of built-in plugins are:

 * format(pattern)
 * bool(true/false)
 * hide
 * empty(alternative)
 * substring(n,l)
 * ...

In this case plugin was used to format DateTime into short format.

#### Processor plugin

Various processors are registered, for types such as:

 * object
 * IEnumerable
 * IDictionary
 * DataSet
 * ...

When new data type needs to be registered, or custom processing on specific data type is required plugin can be registered as in this example

#### Custom tag parser

Since v2.7.0 Templater allows for tag regex customization. Default tag regex includes only few special characters so if we want to expand (or restrict) a format of the tag we can provide a new format during setup.
Here a format of char or dot is used.

#### Letter splitting

When each letter needs to be put in a separate cell, for scanning purposes, this can be done by repeating the tag in each cell and using a plugin to take a single letter in each cell