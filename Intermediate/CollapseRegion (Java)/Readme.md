## Collapse Example

To be able to create complex document, conditional display should be possible.
Templater way of doing conditional display is using **:collapse** metadata (which is just a built-in plugin).

### Collapse metadata plugin

Collapse plugin checks if provided value is null or empty and in which case it invokes resize(0) on that specific tag.

### Bean standard support

Bean standard is not supported which makes templates little less readable.

### Custom collapse plugin

Builtin collapse is just a plugin which can be registered from the outside.
Here a plugin collapseIf(Value) is shown which will do the collapse only if the property has specific value.