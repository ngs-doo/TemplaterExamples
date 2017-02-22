## Pictures

Templater has support for images in several ways:

 * it will duplicate existing images on resize
 * it can insert new images in the document

When `replace(tag, Image)` is called, a new image will be inserted in the document at the place where tag was defined.
Combined with plugins we can lazily convert type into an image, eg plugin for String -> BufferedImage conversion which loads up images from a specific place.

Templater will assume 72dpi for picture and will convert it into appropriate Office representation.
