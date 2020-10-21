## Custom limits

Templater can be extended in various ways through plugins.
Some of the formatting plugins in Templater call methods with arguments, such as substring.
This is done by extracting argument from metadata and calling appropriate method with it.

### Dynamic resize

Dynamic resize dynamically adjusts table based on provided jagged array/collection.
For this to work collection must be of NxM size.

If custom behavior is required only within the presentation, such as show only top X elements, 
a plugin can be registered which will convert collection to an appropriate one during formatting.
Formatting is done in high level API and formatted object is sent to low level API.
Plugins are called in succession, which means that multiple plugins can apply rules on same starting value.

### Data type plugin override

Templater calls processors in succession until one says it has handled that data type.
That behavior can be hijacked with custom plugin by mutating object in place.

### Navigation plugin

Since v5 there is a natural way to deal with such scenarios by using navigation plugin.
Navigation plugin can provide alternative object for further processing.
This can be used for various purposes:

 * returning same collection somewhat changed (limiting, sorting, filtering, ...)
 * returning totally different object/collection
 * calling methods with arguments (unlike only being able to use zero method navigation)
 * various other complex logic
 
Navigation plugin can become very unreadable really fast - so it is suggested to pair it with alias whenever possible.
That way instead of writing something like

`[[groups:sort(usage).products:filter(active).name]]`

alias can be defined like products = groups:sort(usage).products:filter(active)

and tag can look like `[[products.name]]` with all the behavior which was implicitly defined