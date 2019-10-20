## Pictures

Templater has support for images in several ways:

 * it will duplicate existing images on resize
 * it can insert new images in the document

When `replace(tag, Image)` is called, a new image will be inserted in the document at the place where tag was defined.
Combined with plugins we can lazily convert type into an image, eg plugin for String -> BufferedImage conversion which loads up images from a specific place.

Templater will assume 96dpi for picture and will save it as PNG inside docx stream and convert it into appropriate Office representation.

Since v2.5.2 Templater has changed default DPI from 72 to 96 since this is the default on Windows.
This can be controlled through System.getProperties with 'templater:dpi' setting. Eg:

    System.getProperties.setProperty("templater:dpi", "72")

will use the old behavior.

### Java internal image type

Since v3.2.0 Templater exposes image type: `ImageInfo` for direct image manipulation.
By default during startup low-level converters are registered to detect BufferedImage and ImageInputStream and convert them into ImageInfo.
DPI setting is no longer applicable and instead such setting can be set directly on the `ImageInfo`.

Previously ImageInputStream could be used to inject images with extra metadata information, but the recommended way to deal with images is to pass them through the internal `ImageInfo` type.
If Java image types are used, to preserve image format and DPI info (and various other metadata) ImageInputStream can be used instead of BufferedImage.
Java can have some issues when ImageInputStream is created from input stream directly, so sometimes it's better to create it from file directly (or first save it to file with appropriate extension first).
