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

Also as of v.2.5.2 ImageInputStream can be used to inject images.
When Image is sent to Templater it will be saved as PNG into resulting document (and will be missing some metadata since it is not preserved in Image type).
To preserve image format and DPI info (and various other metadata) ImageInputStream can be used instead of Image.
Java can have some issues when ImageInputStream is created from input stream directly, so sometimes it's better to create it from file directly (or first save it to file with approprate extension first).