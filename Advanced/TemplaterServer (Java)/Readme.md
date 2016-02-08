##Templater Server

Example of running a templating processes on a small server with a preset templates, as demonstrated [on the demo page](/demo).

to run call

    run-example.{sh|bat}

And open your browser to `localhost:7778`

Templates reside in `resources/templates`.
Each of them has a respectable json example in `resources/examples`.

`curl` from a command line for an example with

    curl -X POST -d @resources/examples/BenchTemplate.xlsx.json http://localhost:7778/process?template=BenchTemplate.xlsx --header "Content-Type:application/json"

Or replace `BenchTemplate.xlsx` with some other template
