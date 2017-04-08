## Result Set

Demoing several Templater features by using ResultSet:

 * Multiple row context - suppliers table is spread across two rows. This means that when each "row" from ResultSet is processed two rows in sheet needs to be replicated.
 * Dynamic resize with table stretch.
 * Dynamic resize with pre-existing table columns.
 * Table pushdown.

Templater supports combining various data types. In this case object Coffee is passed to process method and public ResultSet fields are mapped to appropriate parts of the workbook.

ResultSet is mapped based on detected columns.
Coffee is mapped using reflection.

### Fast path resize

Templater has fast path for resizing regions in Excel. 
In case when region doesn't have any rows below it (empty defined rows are still considered rows),
doesn't have any complex regions such as named ranges, merge cells or other within the context 
it can be replicated with less checking and copying.

Often, Excels which could be copied with fast-path have some empty rows defined below it, 
in which case it's best to copy paste desired region into new document which will work much faster.

### ResultSet processor

Alongside object procesor, Iterable processor, Map processor, Templater has built-in ResultSet processor which does resizing in chunks.
Iterable processor works by calling single resize call, following by processing of each item.
ResultSet processor works by loading chunks of data in memory, resizing the region, processing loaded items and repeating the process untill all ResultSet is processed.