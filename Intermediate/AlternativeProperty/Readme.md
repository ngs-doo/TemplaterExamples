## Extending plugins via custom code

Sometimes plugin API doesn't support some use cases.
An example of useful use case is that in case of specific value, another tag/field should be used to display the appropriate value.

To implement this in a generic way, access to root object needs to be provided, but Templater does not provide such value.

This examples shows how to work around such problem.