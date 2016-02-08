##Pushdown Example

Understanding special rules during resizing.

When context is resized, if there is anything below that context, it needs to be "moved" appropriately to make space for the context above it.

In this example entire table for daily menu is moved based on the new size for special menu. If daily menu table was not below the special menu table, it would not be moved. If only part of the daily menu table (or a named range around it) was below special menu table, entire region would be moved in that case.
