## Streaming of large documents

Streaming in Templater is supported out of the box if streaming type is used (ResultSet/Iterator/Enumerator).
Alternatively streaming can be simulated manually by multiple calls to process API.

Both methods allows Templater to flush the content of populated stream and reuse memory in next call to process API.

Streaming can be done only up to row without tags. This means that first non-streaming tags should be processed (if there are any)
and then streaming tags can be processed which will perform flushing.