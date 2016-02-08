##ResultSet

Demoing several Templater features by using ResultSet.

1) Multiple row context - suppliers table is spread across two rows. This means that when each "row" from ResultSet is processed two rows in sheet needs to be replicated.
2) Dynamic resize with table stretch.
3) Dynamic resize with pre-existing table columns.
4) Table pushdown.

Templater supports combining various data types. In this case object Coffee is passed to process method and public ResultSet fields are mapped to appropriate parts of the workbook.

ResultSet is mapped based on detected columns.
Coffe is mapped using reflection.
