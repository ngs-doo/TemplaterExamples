#!/bin/sh
cd "`dirname "$0"`"

#uncomment the next line in order to build the standalone server yourself
#mvn clean package

exec java -Dfile.encoding=UTF-8 -jar target/templater-server.jar
