#!/bin/sh
ant
exec java -cp build:lib/* hr.ngs.templater.example.ResultSetExample
