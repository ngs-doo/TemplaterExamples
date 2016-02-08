call mvn compile dependency:copy-dependencies
java -cp target/classes;target/dependency/* hr.ngs.templater.example.DynamicResize
