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
