## Combining Excel features with Templater 

To get most of Templater knowledge of Excel/Word should be leveraged.
This example shows how to combine few Excel features with Templater features to get a useful and pretty report:

 * hidden sheets - when sheets are marked as hidden user will not be immediately aware of them and thus they can be used as data source without displaying them in the actual report.
 * pivots - when pivots are set to refresh on load they will display the data populated by Templater.
 * tag in sheet - as of 2.6.0 Templater supports detecting and replacing tags in sheet names. This allows for user friendly sheet names. Previously sheet duplication could be done only with sheet metadata or cloning. 
 * charts - as part of sheet duplication charts (and tables) will be duplicated. Since they will reference only local data each sheet can have it's own result.

### Sheet resizing

Sheet duplication can be done in two ways; by using clone (which will duplicate all sheets) or by using resize which will duplicate only the appropriate sheet.
Sheet will be duplicate at appropriate index (meaning for sheet resize there can be other sheets after it).
If sheet tag is not replaced sheet will have a generic name.

### Utilizing Excel features 

While table on specific sheet is not hidden, it could be put in columns without width so it would look like it's not there.
Other tricks could also be used to make more user friendly report.