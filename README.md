[documentation]: http://templater.info/

# Reporting for .NET

Within these folders are examples of creating reports from templates in .NET by using the Templater reporting library.

**IsoCountries** - WinForms application with actions for downloading the CSV web resource. Creating simple spreadsheet document (.xlsx) from parsed values. 

*Stuff to learn*: 

- Downloading data from the web with WebClient
- Simple threading to keep GUI responsive
- Parsing CSV with linq query
- Simple continuations

**FoodOrder** - Silverlight 4 application with web service. Creating spreadsheet with stacked tables. Data is provided from Silverlight application. Value formatting using Templater keyword and Excel. 

*Stuff to learn*:

- RelayCommand for Silverlight
- Presenter as data context (MVP pattern)
- Creating and providing temporary web resource on demand
- Linq for simple data analysis

**ExchangeRates** - WinForms application for displaying currency rates for last 90 days. USD, CHF and GBP vs EUR. Spreadsheet with table and two charts (one native in Excel from table and other as picture from application).

*Stuff to learn*:

- Repository for data access
- Parse XML with linq
- ZedGraph library usage
- Simple threading to keep GUI responsive
- Custom user controls (GroupBox with focus)
- Prefetching data (downloading data when idle)
- Global exception handler
- Please wait animation example (on slow connections)

**SalesOrderMVP** - WPF Ribbon application with advanced templating features. Simple CRUD application built in Model-view-presenter style. Spreadsheet with table and pivot for analysis. Sales order Word document for selected items with header and line items. Property navigation using Templater.

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
