## Sales Order MVP

Small WPF desktop application for managing sales orders.

### Excel template

For SalesOrderItem.xlsx several features are shown:

 * cell merging - Templater will adjusted merged cells when their context changes
 * cell styles - fonts, colors, direction, etc are preserved while document is processed
 * nesting - table is nested inside named range

### Word template

For SalesOrderItem.docx several features are shown:

 * cloning - clone metadata (along with hide) is used to invoke cloning the entire document
 * header/footer - tags can be placed in headers/footers (although in this example they are hidden at the end
 * formatting - date/number formatting
 * style - rows in table maintain their style as they are duplicated
 * watermark - document status is displayed as watermark (currently :all metadata is required, since watermark exists in few different document parts)

Both documents are non trivial to design which shows the value in separating template design from data population.
