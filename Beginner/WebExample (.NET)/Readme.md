## ASP.NET example

Use of Templater in ASP.NET application. Embedding license as a resource.

Good practice is to initialize Templater factory in a shared static field as done in Global.

*templater.lic* is added as embedded resource in web project. 
This will allow Templater to pick it up later from assembly instead of providing it with explicit license registration or path to license file.

Templater can work directly with streams as shown in WebService example where it directly pipes template result to Context.Response.OutputStream.

### Specifying license

License can be specified by entering customer name/license key, specifying path to file or embedding license within the project (as done in this example).

### Thread safety

*ITemplaterDocument* instances are not thread safe, but *ITemplaterFactory* is thread safe. Since *ITemplaterDocument* should be used within **try/finally** block it usage is appropriate for a single thread call.

Internally Templater will share globally some cache structures (such as reflection information), but those are accessed in a thread safe manner.

### Streaming

Internal in-memory stream will be used during processing, but this is only a minor issue, since most memory usage will come from interaction with .NET XML API. 

Templater can accept stream as input (in which case document type must be explicitly specified) and can save result to an output stream (by copying it from internal in-memory stream).

Some complex documents require several processing steps, in which case output of a previous Templater processing can be input for next Templater processing.