@echo off
pushd "%~dp0"

:: uncomment the next line in order to build the example yourself
:: call mvn clean package

java -Dfile.encoding=UTF-8 -jar target\templater-server.jar

popd
