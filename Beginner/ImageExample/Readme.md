## Image Example

The most simple way to insert an image into the document.

### Custom type detection

Templater handles specific types in a special way. One of such types is a BufferedImage (Java) and Image (.NET).
When buffered image is detected tag will be replaced with an appropriate image.

### Java internal image type

Since v3.2.0 Templater exposes image type: `ImageInfo` for direct image manipulation.
By default during startup low-level converters are registered to detect BufferedImage and ImageInputStream and convert them into ImageInfo.