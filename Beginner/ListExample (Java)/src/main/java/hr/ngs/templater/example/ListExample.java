package hr.ngs.templater.example;

import hr.ngs.templater.Configuration;
import hr.ngs.templater.ITemplateDocument;

import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.List;

import org.joda.time.LocalDate;

public class ListExample {
    @SuppressWarnings("rawtypes")
    public static void main(final String[] args) {
        final String templatePath = "MyList.docx";
        final String outputPath = "MyListResult.docx";

        try {
            final InputStream inputTemplateStream = new FileInputStream(templatePath);
            final SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");

            final List horses = Arrays.asList(
                    new MyHorse("Blizzard", 1.4500134f),
                    new MyHorse("Sandstorm", 1.5500134f),
                    new MyHorse("Earth", 1.2500134f),
                    new MyHorse("Cat", 2.4500134f));

            final List myList = Arrays.asList(new MyBets(
                    "Mirko",
                    dateFormat.parse("11/05/2012"),
                    new LocalDate("2012-05-12"),
                    horses));

            final ByteArrayOutputStream baos = new ByteArrayOutputStream();
            final ITemplateDocument tpl = Configuration.factory().open(
                    inputTemplateStream, "docx", baos);
            tpl.process(myList);
            tpl.flush();

            final byte[] result = baos.toByteArray();

            final FileOutputStream fos = new FileOutputStream(outputPath);
            fos.write(result);
            fos.close();
        } catch (final FileNotFoundException e) {
            e.printStackTrace();
        } catch (final IOException e) {
            e.printStackTrace();
        } catch (final ParseException e) {
            e.printStackTrace();
        }
    }
}
