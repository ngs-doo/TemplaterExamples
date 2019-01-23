## Streaming of large CSV documents

Streaming in Templater is done by multiple calls to process API.
This allows to Templater to flush the content of populated stream and reuse memory in next call to process API.

Streaming can be done only up to row without tags. This means that first non-streaming tags should be processed (if there are any)
and then streaming tags can be processed which will perform flushing.