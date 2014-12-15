package hr.ngs.templater.example;

import hr.ngs.templater.Configuration;
import hr.ngs.templater.ITemplateDocument;

import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import org.joda.time.LocalDate;

public class MapExample {
    public static void main(final String[] args) {
        final String templatePath = "MyMap.docx";
        final String outputPath = "MyMapResult.docx";

        try {
            final InputStream inputTemplateStream = new FileInputStream(templatePath);

            final Map<String, Object> myMap = new HashMap<String, Object>();
            myMap.put("Name", "James Bond");
            myMap.put("Age", 40);
            myMap.put("Gun", new Gun("Revolvers", "Colt", "45"));

            final Map<String, LocalDate> killed = new HashMap<String, LocalDate>();
            killed.put("Dr Evil", new LocalDate("1965-05-05"));
            killed.put("Moneypenny", new LocalDate("1967-05-05"));
            killed.put("Spectre", new LocalDate("1968-05-05"));

            myMap.put("Kills", killed);

            final ByteArrayOutputStream baos = new ByteArrayOutputStream();
            final ITemplateDocument tpl = Configuration.factory().open(
                    inputTemplateStream, "docx", baos);
            tpl.process(myMap);
            tpl.flush();

            final byte[] result = baos.toByteArray();

            final FileOutputStream fos = new FileOutputStream(outputPath);
            fos.write(result);
            fos.close();
        } catch (final FileNotFoundException e) {
            e.printStackTrace();
        } catch (final IOException e) {
            e.printStackTrace();
        }
    }
}
