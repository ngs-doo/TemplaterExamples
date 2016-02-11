## Collapse Example

To be able to create complex document, conditional display should be possible.
Templater way of doing conditional display is using **:collapse** metadata (which is just a built-in plugin).

### Collapse metadata plugin

Collapse plugin checks if provided value is null or empty and in which case it invokes resize(0) on that specific tag.

### Bean standard support

Bean standard is not supported which makes templates little less readable.