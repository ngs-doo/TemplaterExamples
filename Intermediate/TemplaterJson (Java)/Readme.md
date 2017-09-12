## Templater JSON

Command line tool for feeding JSON to Templater.

This example shows how to process JSON data with Templater, also how you could use it in a stand-alone application. 
This Java application accepts 3 arguments, path to the template, path to the JSON and the output path.
If only 1 argument is specified it will assume console input and output to support piping.

Example usage:
java -jar templater-json.jar benchmark-template.xlsx < benchmark-data.json > benchmark-output.xlsx
java -jar templater-json.jar beers-template.docx beers-data.json beers-output.docx
