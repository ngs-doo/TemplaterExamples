## Processing HTML

To process HTML one must first convert it into valid XML which can be processed by Templater.

There are many libraries which are able to parse HTML, such as:

  * [Jsoup](https://jsoup.org/)
  * [HAP](https://html-agility-pack.net/)

The input example is not a valid XML, but after parsing it as HTML it can be saved as XML via this 3rd party libraries.

### Why?

There are many libraries which deal with HTML generation which are better suited for this use cases than Templater.
The main reason why it would be beneficial to generate HTML this way is when system already supports all kind of 
Templater based reporting and sometimes there is relatively simple HTML use case which does not involve developer 
setting up the output, but wants to allow customer to be in control.
