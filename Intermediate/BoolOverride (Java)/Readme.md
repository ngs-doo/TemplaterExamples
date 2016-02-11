## Bool Override

Built-in plugins can often be overridden with custom ones.
Templater has built-in plugin for bool(yes/no), but in case you need more complex use case (text involving separator) it won't work out of the box.

Fortunately by registering custom plugin we can change the behavior of bool plugin, since custom plugin will be evaluated before built-in one.
