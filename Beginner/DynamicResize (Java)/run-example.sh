#!/bin/sh
cd "`dirname "$0"`"

#uncomment the next line in order to build the example yourself
#mvn compile dependency:copy-dependencies

exec java -cp target/classes:target/dependency/* hr.ngs.templater.example.DynamicResize
