## Power Query/Get & Transform 

[Power Query](https://support.office.com/en-us/article/Introduction-to-Microsoft-Power-Query-for-Excel-6E92E2F4-2079-4E1F-BAD5-89F6269CD605) is a relatively new addition to Excel family.
It's advanced way to manipulate data in Excel and fixes some limits, such as 1 million rows per sheet.

Templater can be used to prepare the data, while Power Query can manipulate such prepared data in various ways.

Power Query can work on CSV files, in which case it's much faster than using data from Excel sheets.
This makes it convenient integration point where Templater populates the CSV files which Power Query consumes.
Since v4.4 embedded CSV files are processed automatically when embedded within xlsx. 
This makes it very convenient to embed them and use PowerQuery on them. 

### Bundling it all in a single xlsx

Power Query has some limitations, such as:

 * requiring absolute paths when opening up files
 * not knowing how to open zip files

which are worked around in this example. Namely:

 * instead of hard-coding file names - current Excel filename is read by using formulas
 * UnzipFile function is used - which knows how to process certain zip files
 
Combining these we can put CSV files within the xlsx document (and they will remain there due to relationship referencing them).
This makes it very convenient to prepare the xlsx file in a generic way through Templater and ship it along as a single file which works out-of-the box on another machine.
While this example only has a single CSV file embedded in the zip, there could be many more CSV files which would allow for very complex report to be created.

### Dynamic filename for CSV import 

Before the xlsx file is usable on another machine exact xlsx name must be known.
This can be done via Excel `=filename` feature.
Detailed instructions can be found on [blog post](https://www.excelguru.ca/blog/2014/11/26/building-a-parameter-table-for-power-query/).

### CSV file within Excel

For the purpose of this example we could have just added the CSV files in the Excel, which would get removed after the file is saved by Excel.
But if we want CSV files to remain in the Excel we need to slighly modify the xlsx as it was done in this example:

 1) add CSV mime type in `[Content_Types].xml`, eg: `<Default ContentType="text/csv" Extension="csv"/>`
 2) add CSV file in the xlsx zip, eg: `xl/embeddings/data.csv`
 3) add relationship to CSV file, eg: in `xl/_rels/workbook.xml.rels` add `<Relationship Target="embeddings/data.csv" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/csv" Id="rId11"/>`

These steps will prevent Excel from removing the CSV file on further saves.

### Consuming CSV from PowerQuery

To load CSV into PowerQuery two more pieces are required:

 * function for loading current xlsx name (from parameters table) - `LoadParam`
 * function for loading csv from zip (current xlsx is read as a zip file) - `UnzipFile`

`UnzipFile` function only works on non streaming zip files (size and compressed size are known before the deflate stream is written).
With those two functions we can combine loading of CSV with some Power Query code:

    let
      fn = LoadParam("FileName"),
      fp = LoadParam("FilePath"),
    
      Source = File.Contents(fp & fn), 
      Files = UnzipFile(Source),
    
      EmbeddedFiles = Table.SelectRows(Files, each Text.StartsWith([FileName], "xl/embeddings")),
      CsvFiles = Table.SelectRows(EmbeddedFiles, each Text.EndsWith([FileName], ".csv")),
    
      CsvContent = CsvFiles{0}[Content],
      ImportedCsv = Csv.Document(CsvContent,[Delimiter=";", Columns=17, Encoding=65001, QuoteStyle=QuoteStyle.None]),
      Headers = Table.PromoteHeaders(ImportedCsv, [PromoteAllScalars=true]),
      Types = Table.TransformColumnTypes(Headers,{
        {"Date", type date},
        {"Week", type text},
        {"Month", type text},
        {"Quarter", type text},
        {"Year", Int32.Type},
        {"Payment date", type date},
        {"Original principal", Int32.Type},
        {"Person id", type text},
        {"Operator", type text},
        {"Invoice number", type text},
        {"Due date", type date},
        {"Invoice date", type date},
        {"Collection date", type date},
        {"Invoice fee", type number},
        {"Interest", type number},
        {"Reminder fee", type number},
        {"Current amount", type number}}, "en-US")
    in
      Types

This function will take the first found CSV file and project it via specified columns.
It will use `en-US` culture to process the CSV so that decimal numbers are imported correctly (dot represents the decimal separator).

### Running the example

Due to some Power Query limitations, running the example without the proper Templater license will "corrupt the document".

Non Power Query sheets are hidden in the template, but can be shown to understand the template better.
