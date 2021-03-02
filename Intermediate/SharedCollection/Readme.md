## Shared collection

Up until version 2.3 Templater only could replace first item in its queue.
In version 2.3 new index based low level API was introduced.

This opens up new scenarios which can be supported by Templater (either out of the box, or through custom plugins).

When Templater opens up document, it will scan every tag and place it in a queue based on the document layout.
**replace(tag, value)** will only work on the first item in that queue.
New **replace(tag, index, value)** work on any item in the queue.

Previously if similar document wanted to be processed, Templater could do it out of the box only if you had two different property names (pointing to the same collection).

*Note*: up until v2.7.0 Templater would behave differently if same tags were used in both tables. Since v2.7.0 Templater supports collections which are repeated in parts of the document out of the box. No need for **:repeat**, additional property or some other workaround.

### Image and DPI

ImageInputStream will be inserted into the document using original file format and DPI info.
Since v3.2.0 `ImageInfo` allows for easier image manpilation by exposing DPI values directly. ImageInputStream is internally converted into ImageInfo.

### Digital signature

Templater supports document signing with a certificate. This can be used to provide authenticity of the document, since any change to the document after the signing will invalidate the signature.
Note: Certificates which are not trusted will be shown as Recoverable certificates. Certificate used in this example is self signed and thus not trusted.