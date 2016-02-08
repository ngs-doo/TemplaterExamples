@echo off
pushd "%~dp0"

:: uncomment the next line in order to build the example yourself
:: call mvn compile dependency:copy-dependencies

java -cp target/classes;target/dependency/* hr.ngs.templater.example.ListExample

popd
