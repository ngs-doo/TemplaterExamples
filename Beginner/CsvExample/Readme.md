## CSV

Templater supports 3 main formats: docx, xlsx and plain text

With the help of few plugins (for quoting special strings) Templater can be used as a configurable CSV export

While there are numerous libraries for exporting CSV, when CSV export needs to be configurable the pool of available options is much smaller.

### Performance

Templater has decent performance for exporting CSV (txt) files: around few seconds for 500.000 rows.
Since it can consume DataReaders/ResultSets as input data sources and will write to output stream without holding the entire stream in memory it can be used for nontrivial exports.