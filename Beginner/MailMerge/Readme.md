## Mail Merge

Creating simple letters containing external pictures.

CSV file contains a name, a date and a file name containing a signature in PNG and GIF format. 
File is read into a List of class instances, which is then processed by Templater. Result is a `docx` containing a letter made with data from each row of the CSV file.

Templater will use entire document as a context during replication, which we leverage by adding page break at the begging of the document.

### Special data types - Image

Templater doesn't have an *AddPicture* method, but adding a picture into the document can be done by providing **Systme.Drawing.Image** data type which will replace tag with a picture in the document. Pictures within the Word are moved around as document is changed, while in Excel, pictures are stationary after they are inserted into the document.

.NET will respect image DPI values, while JVM can use Templater specific `ImageInfo` and provide exact DPI values.

Since image is processed as special data type by low level API, this means it's possible to register a plugin in Templater which will convert some other data type (such as string) to an image. This is useful when data comes directly from database and points to some address, instead of having rich Image type within model.

### Document layout - page breaks

Document layout will be respected during resizing. In practice this means that *header on each page* table feature can be used when appropriate. When resizing entire document, existing page break is used if available, otherwise new page break is added. For resizing only part of the document, page breaks are not injected.  

### Page numbering

Page numbers can be easily implemented by using Word feature for page numbering (insert -> page numbers)

### Low level replace API plugins

Plugins can be registered which will be invoked on every low level Replace call. This can be used to implement custom conversions without the need for custom metadata.
In this case custom type is used to implement picture conversion behavior (without providing Image data type).