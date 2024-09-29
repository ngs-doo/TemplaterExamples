## Data sources used multiple times

When analyzing documents for tags, Templater will also analyze embedded documents.
Excel can be embedded in PowerPoint and Word files and used as data for charts.

Since it's quite useful to represent the same data source in multiple ways, 
Templater will process tags accordingly and treat them in a special way when they are repeated (even in different embedded documents).

Charts with unknown dimensions can also be created this way, but they require usage of Dynamic Resize or Horizontal resize.
In this case Dynamic Resize was used to define series, while another input for Dynamic Resize was used to populate categories and data.

During processing index based low level API is used to process tags: **replace(tag, index, value)**

## Splitting table across slides

Its common that when table has too many rows that we want to split it across multiple slides. While Word has built-in split table across page
functionality, in PowerPoint we need to do some manual work. It can either be preparing data in such hierarchical way,
or even better to have a plugin which will split the data across slides. When it accepts number of rows per table as an argument, it makes this process
even simpler.

### Implementing footer row

If such split table needs to have special rows, eg only row at the last slide,
this can be implemented by exposing relevant property (if this is the last slide)
and if it's not, removing the tag located in the footer row.

When there is a need to show some aggregated data in the footer row, there are several approaches on how to do it.
While the recommended way is to expose such property in the model directly, when this is not applicable,
custom plugins for summing over values can be implemented.

### Aliases

While this example does not use aliases, but rather raw format: `table:split(20)`
it would be more readable (especially when dealing with deep navigation) to introduce shorter alias
and use that around.