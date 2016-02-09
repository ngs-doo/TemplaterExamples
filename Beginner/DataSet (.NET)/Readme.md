##DataSet

Working with C# DataTables, DataSets, DataRelations.

Master-detail can be reproduced by adding relationships between tables.

### Relationships

While Templater can work with navigation an collection properties for master-detail relationships, when DataSet is used tables will also be analyzed by their relationships.

Difference is that for *standard* example where tags such as

    Name: [[Name]]

    | Description            |
    |------------------------|
    | [[Items.Description]]  |

on class such as 

    class Model {
      public string Name;
      public List<Item> Items;
    }

navigation is used, while with relationship top level names are used (as in this example)

### Tag repeating

Templater has several rules for repeating tags:

 * within same repeatable element tag can be used multiple times and will be replaced with same value
 * tag can be repeated multiple times when not used within repeatable element (such as table/list). When tag is used in different repeatable elements and all tags should be replaced with same value **:all** metadata can be used. Sometimes cloning is required to isolate that specific part of the document

In this example **[[ContactName]]** is repeated multiple times

### Formatting

Builtin plugin **:format(pattern)** is used for invoking special .ToString(pattern) method on DateTime.

### Zero element collections

Since .NET supports type reification, empty collection can be analyzed and changed accordingly without additional metadata. In this example relationship with 0 elements causes tables to be reduced to 0 rows.

Sometimes the requirements ask for complete removal of table in that case - which can be done using **:collapse** metadata.
 