package hr.ngs.templater.example

import java.io.{FileOutputStream, ByteArrayOutputStream, FileInputStream}

import hr.ngs.templater.Configuration

case class Report(user: User, beers: Seq[Beer])
case class User(name: String, age: Int)

case class Beer(
  name: String,
  brewery: String,
  `type`: String,
  rating: Double,
  abv: Double
)

object BeerList extends App {
  val beers = Seq(
    Beer("Rare Bourbon County Brand Stout", "Goose Island Beer Co.",   "Stout",             4.5, .130),
    Beer("Ožujsko",                         "Zagrebačka Pivovara",     "Euro Lager",        1.5, .050),
    Beer("Vukovarsko",                      "Vukovarska pivovara",     "Pale Lager",        2.5, .045),
    Beer("Pale Ale",                        "Zmajska Pivovara d.o.o.", "American Pale Ale", 3.5, .053),
    Beer("Porter",                          "Zmajska Pivovara d.o.o.", "Porter",            3.5, .065),
    Beer("APA",                             "Nova Runda",              "American Pale Ale", 3.0, .053),
    Beer("Brale",                           "Nova Runda",              "American Pale Ale", 3.5, .049),
    Beer("Double Barrel Hunahpu's",         "Cigar City Brewing",      "American imperial", 4.5, .115),
    Beer("Karlovačko Pivo",                 "Karlovačka Pivovara",     "Pale Lager",        2.0, .050)
  )

  val report = Report(
    user = User("Bob Barley", 42),
    beers = beers.sortBy(b => (b.brewery, b.name)) // sort by brewery name, then by beer name
  )

  val templatePath = "BeerList.docx"
  val outputPath = "BeerListResult.docx"

  val inputTemplateStream = new FileInputStream(templatePath)
  val outputDocumentStream = new FileOutputStream(outputPath)

  try {
    val tpl = Configuration.factory().open(inputTemplateStream, "docx", outputDocumentStream)
    tpl.process(report)
    tpl.flush()
  }
  finally {
    inputTemplateStream.close()
    outputDocumentStream.close()
  }
}
