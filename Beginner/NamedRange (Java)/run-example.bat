@echo off
pushd "%~dp0"

:: uncomment the next line in order to build the example yourself
:: call ant

java -cp build;lib/* hr.ngs.templater.example.NamedRangeExample

popd
