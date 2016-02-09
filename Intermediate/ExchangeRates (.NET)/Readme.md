## Exchange Rate

Simple application demoing charts and images in Excel.

Templater can be used to populate Excel table. 
This table can be used as source for charts, pivots and various other Excel features.
Refresh on load Excel feature is useful to update the document when it's opened.

If Image data type is passed into Templater, it will insert a picture into Excel.

### Data sources

Standard use of Templater is for populating data source and using that data source as input for some other more complex feature, such as pivot table, charts, ...

This can be very useful for reports which require multiple sheets from same design but different data.

### Excel images

Images can be inserted in place of tags by providing special data type recognized by Templater: **System.Drawing.Image**

 