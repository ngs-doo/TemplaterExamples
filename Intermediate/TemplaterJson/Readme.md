## Templater JSON

Command line tool for feeding JSON to Templater.

This example shows how to process JSON data with Templater, also how you could use it in a stand-alone application. 
This Java application accepts 3 arguments, path to the template, path to the JSON and the output path.
If only 1 argument is specified it will assume console input and output to support piping.

Images can be used if base64 encoded value is provided in JSON and matching tag has `:image` metadata which will attempt the conversion.

### Example usage .NET:
 * TemplaterJson.exe benchmark-template.xlsx < benchmark-data.json > benchmark-output.xlsx
 * TemplaterJson.exe beers-template.docx beers-data.json beers-output.docx

### Example usage Java:
 * java -jar templater-json.jar benchmark-template.xlsx < benchmark-data.json > benchmark-output.xlsx
 * java -jar templater-json.jar beers-template.docx beers-data.json beers-output.docx


### DotNet AOT compilation

Project support self contained exe output without .NET dependency and without usage of reflection
