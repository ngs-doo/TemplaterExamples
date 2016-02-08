@echo off
pushd "%~dp0"

:: uncomment the next line in order to build the standalone templater-json.jar application yourself
:: call mvn clean package

:: this example uses filenames as parameters
echo Running beers example -^> beers-output.docx ...
java -jar target\templater-json.jar beers-template.docx beers-data.json beers-output.docx

:: this example uses stdin and stout to pipe input and output to the TemplaterJson Java process
echo Running benchmark example -^> benchmark-output.xlsx ...
java -jar target\templater-json.jar benchmark-template.xlsx < benchmark-data.json > benchmark-output.xlsx

popd
