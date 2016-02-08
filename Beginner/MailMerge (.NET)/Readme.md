##MailMerge

Creating simple letters containing external pictures.

CSV file contains a name, a date and a file name containing a signature in PNG and GIF format. 
File is read into a List of class instances, which is then processed by Templater. Result is a `docx` containing a letter made with data from each row of the CSV file.

Templater will use entire document as a context during replication, which we leverage by adding page break at the begging of the document.