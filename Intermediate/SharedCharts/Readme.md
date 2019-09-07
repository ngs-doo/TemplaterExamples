## Data sources used multiple times

When analyzing documents for tags, Templater will also analyze embedded documents.
Excel can be embedded in PowerPoint and Word files and used as data for charts.

Since it's quite useful to represent the same data source in multiple ways, 
Templater will process tags accordingly and treat them in a special way when they are repeated (even in different embedded documents).

During processing index based low level API is used to process tags: **replace(tag, index, value)**
