[documentation]: http://templater.info/

# Reporting for .NET

Within these folders are examples of creating reports from templates in .NET by using the Templater reporting library.

**IsoCountries** is a WinForms application with actions for downloading the CSV web resource and creating a simple spreadsheet document (.xlsx) from parsed values.

*Stuff to learn*:

- Downloading data from the web with WebClient
- Simple threading to keep GUI responsive
- Parsing CSV with a LINQ query
- Simple continuations

**FoodOrder** is a Silverlight 4 application with a web service. The web service creates a spreadsheet with stacked tables, with data being provided by the Silverlight application. This example shows value formatting by using native Excel formatting and formatting with Templater.

*Stuff to learn*:

- RelayCommand for Silverlight
- Presenter as data context (MVP/MVVM pattern)
- Creating and providing a web resource on demand
- LINQ for simple data analysis

**ExchangeRates** is a WinForms application which downloads and displays currency rates. It can create a spreadsheet with the retrieved currency rates presented in three ways; a table, a native Excel graph and a picture exported from the application.

*Stuff to learn*:

- Repository for data access
- Parse XML with LINQ
- ZedGraph library usage
- Simple threading to keep GUI responsive
- Custom user controls (GroupBox with focus)
- Prefetching data (downloading data when idle)
- Global exception handler
- Busy animation example (on slow connections)

**SalesOrderMVP** is a WPF Ribbon application demonstrating a simple CRUD built in Model-view-presenter style. It can produce spreadsheets with table and pivot for analysis. Documents are created from a sales order Word template for selected items.

*Stuff to learn*:

- Repositories to SQLite, XML and JSON
- SQLite batch save
- Persistable repository with set based arguments
- Extension methods for humane interface
- Fluent ribbon shell
- Data modeling DDD style using aggregate roots
- Advanced presenter pattern (with controllers for specific commands)
- Passive views + layout controller
- INotifyPropertyChanged with reflection (refactorable property names)
- Hooking to Routed commands

Additional [documentation] is available from the official webpage.
