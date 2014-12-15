RESULTSET TEST


This example shows how resultset objects are added in Microsoft Excel by te help of Templater.
Object MyCoffee holds ResultSet properties, that are processed by templater.
In the template resultset properties are specified in cell.

i.e. Resultset coffees hold data from Table COFFEES, that holds property for SUP_ID column, so tag name is coffees.SUP_ID.

Five tables are created from "create-tables" txt file provided in sql folder.
Further, tables are populated using populateTables() method.
Data for tables is saved and retrieved from memory, that is passed to MyCoffee object, that is processed by templater.
