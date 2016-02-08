#!/bin/sh
cd "`dirname "$0"`"

#uncomment the next line in order to build the example yourself
#ant

exec java -cp build:lib/* hr.ngs.templater.example.NamedRangeExample
