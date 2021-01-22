## Pictures

Templater has support for images in several ways:

 * it will duplicate existing images on resize
 * it can insert new images in the document

When `replace(tag, Image)` is called, a new image will be inserted in the document at the place where tag was defined.
Combined with plugins we can lazily convert type into an image, eg plugin for String -> BufferedImage conversion which loads up images from a specific place.

### ImageInfo specific type and conversion

There is Templater specific ImageInfo type for working with images, but by default Templater will detect most image types and convert them into ImageInfo.
Natively supported types are:

 * System.Drawing.Image (.NET)
 * System.Drawing.Icon (.NET)
 * java.awt.image.BufferedImage (JVM)
 * javax.imageio.stream.ImageInputStream (JVM)

By default during startup low-level converters are registered to detect specified types and convert them into ImageInfo.
In Java Templater will try to detect DPI in ImageInputStream, but will assume 96dpi BufferedImage.
When working in Android, builtin converters need to be disabled since such types are not available on Android.

While sometimes ImageInputStream could be used to inject images with extra metadata information, the recommended way to deal with images is to pass them through the internal `ImageInfo` type.

If Java image types are used, to preserve image format and DPI info (and various other metadata) ImageInputStream can be used instead of BufferedImage.
Java can have some issues when ImageInputStream is created from input stream directly, so sometimes it's better to create it from file directly (or first save it to file with appropriate extension first).

It's convenient to use external tools to extract such metadata and then keep them as external attributes along the image. Then they can just be passed via ImageInfo type.

### SVG images

Microsoft Office 2016 introduces SVG image support. Since 4.2.0 Templater supports SVG images when passed as XML document with svg name.
By default Templater will only inject SVG image into the document, but if a fallback image is required this can be converted via external plugin registered during Templater configuration.
Previous Office version will fallback to image format so documents will look similar on both old and new MS Office versions.

### Existing images

Since v4.5 existing images can be used for replacement. In that case Templater will retain its configuration such as effects, size and other image properties.
This allows more configuration during image manipulation and allows the use of images in PowerPoint

### QR code

Since Templater supports external plugins, its rather easy to introduce QR code generator in the process.
In this example `qr` metadata is used to match the need for conversion of text into QR code image.