## DataSet

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

As of v2.5.2 multi-level relationships are supported (eg. master-detail-child) and resizing support has been improved (better context detection).

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

### Coloring

Templater doesn't have coloring API, but to implement coloring you can drop down to XML format and send in appropriate XML.
In this case to specify background color for a cell, Word uses properties such as:

    <w:tc>
      <w:tcPr>
        <w:shd w:val="clear" w:color="auto" w:fill="COLOR" />
      </w:tcPr>
    </w:tc>

As of v2.5 Templater can use merge-xml metadata as instruction to merge provided XML to the surrounding context. This way we can "append" color to the appropriate place.

As of v7 this merge-xml can be passed directly through XML so there is no need for it in tag metadata. In that case XML would look like:

    <w:tc templater-xml="merge-xml">
      <w:tcPr>
        <w:shd w:val="clear" w:color="auto" w:fill="COLOR" />
      </w:tcPr>
    </w:tc>
