package hr.ngs.templater.example;

import hr.ngs.templater.Configuration;
import hr.ngs.templater.ITemplateDocument;

import java.awt.*;
import java.io.*;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.List;

import org.joda.time.LocalDate;

public class ListExample {
    @SuppressWarnings("rawtypes")
    public static void main(final String[] args) throws Exception {
        InputStream templateStream = ListExample.class.getResourceAsStream("/MyList.docx");
        File tmp = File.createTempFile("list", ".docx");
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");

        List horses1 = Arrays.asList(
                new MyHorse("Blizzard", 1.4500134f),
                new MyHorse("Sandstorm", 1.5500134f),
                new MyHorse("Earth", 1.2500134f),
                new MyHorse("Cat", 2.4500134f));
        List horses2 = Arrays.asList(
                new MyHorse("Blizzard", 2.42f),
                new MyHorse("Earth", 1.5500134f),
                new MyHorse("Sandstorm", 1.00134f),
                new MyHorse("Cat", 2.0134f));

        List myList =
                Arrays.asList(
                        new MyBets(
                                "BetSafe",
                                dateFormat.parse("11/05/2012"),
                                new LocalDate("2012-05-12"),
                                horses1),
                        new MyBets(
                                "BetUnsafe",
                                dateFormat.parse("12/04/2014"),
                                new LocalDate("2014-04-12"),
                                horses2));

        try(FileOutputStream fos = new FileOutputStream(tmp);
            ITemplateDocument tpl = Configuration.factory().open(templateStream, "docx", fos)) {
            tpl.process(myList);
        }
        Desktop.getDesktop().open(tmp);
    }
}
