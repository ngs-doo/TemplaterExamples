## Map Example

Using more dynamic data types. Navigating through Java method calls.

### Data type processor - for Map

Templater recognizes Map as a special type, with it's own set of rules. 
Collection of Map has its own processor which is different from Iterable processor.
While object processor uses reflection to read properties, Map processor uses keys and values.

### Method navigation

Since Map can be viewed as a collection, by navigating through entrySet method collection behavior can be invoked - context duplication.
While Templater doesn't recognize Joda Time, it does Date, so often Joda Time method for toDate conversion can be used.
Most of the time, simple toString on Joda Time object provides expected behavior.
Since bean standard is not supported, only `getKey` method can be used to access key value of the pair.

### Specifying license

License can be specified by entering customer name/license key, specifying path to file or embedding license within the project (as done in this example).
