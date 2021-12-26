## Creating real world reports

Complex reports often combine various features of Excel.
This report uses several Excel features:

 * merge cells
 * named ranges
 * formulas (formulas in merge cells)
 * tables
 * pivot charts
 * conditional formatting (coloring and data bars)

to create a visually pleasing report which can be skimmed over or drilled into specifics.

Templater understands all of the above features and has some special logic to cope with some advanced modifications which are happening to the document.

### Formula rewriting

Changing the document can affect formulas in several ways:

 * affected regions can be stretched
 * formulas can be moved around
 * affected regions can be moved around
 * special behavior of formulas in merge cells

While most of the time it's sufficient to just define tags and place formulas inside,
sometimes additional help is needed so that Templater can make the correct adjustments.
In this case named range around the Epic part is required so that the formulas which are left of the relevant tag (and thus not included by default in resize)
are changed in appropriate way.

### Sheet duplication

Templater can have various context on which it operates; and can be made to operate on a single sheet as in this example.
This when a collection is sent to such a context it will get duplicated as in this case where there is a sheet per department,
and by renaming the sheet name also usable reports can be created.

### Pivot chart and data analysis

If data sheet was hidden and Summary was the first sheet report would be even easier to consume.

### Anonymous classes

Templater can work with IEnumerable or Collection data sources in which case it will extract the signature from the provided data.
This way anonymous objects can be used for easier development via C# LINQ or Java Streams


### Navigation plugin

This template has alias defined for `department.team.project:sort(name)` as `project`
Since v5 there is a natural way to deal with data manipulation during navigation via navigation plugin.
Navigation plugin can provide alternative object for further processing.
This can be used for various purposes:

 * returning same collection somewhat changed (limiting, sorting, filtering, ...)
 * returning totally different object/collection
 * calling methods with arguments (unlike only being able to use zero method navigation)
 * various other complex logic
 
There are two navigation plugin implementations in the project:

 * sort - using simplistic reflection implementation
 * filter - using expression parsing libraries
