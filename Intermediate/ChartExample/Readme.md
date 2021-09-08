## Charts in Word

Charts in Word are actually spreadsheet files embedded within the zip.

During analysis Templater will drill down into embedded xlsx file for tags. 
They will be available through low level API as if they were defined in Word.

### Repeating collections

Templater will process multiple collections with same tags.
Since there is a single [[tag]] in the top level of the document this will invoke the resize page rules of the Templater and thus on processing the first collection it will copy all the elements,
while the second resizes will not pass along the [[tag]] element which will invoke just the resize of the objects.

### Charts with Dynamic Resize

When charts have unknown number of series, they can be populated via Dynamic Resize.
This can be done via 2 or 3 tags (as same tag can be used for categories and values).
