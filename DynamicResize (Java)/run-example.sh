#!/bin/sh
mvn compile dependency:copy-dependencies
exec java -cp target/classes:target/dependency/* hr.ngs.templater.example.DynamicResize
