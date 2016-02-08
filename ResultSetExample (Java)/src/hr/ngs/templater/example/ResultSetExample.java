package hr.ngs.templater.example;

import hr.ngs.templater.Configuration;
import hr.ngs.templater.ITemplateDocument;

import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

public class ResultSetExample {
    public static void main(final String[] args) {
        final String templatePath = "MyCoffeeTable.xlsx";
        final String outputPath = "MyCoffeeTableResult.xlsx";

        try {
            final InputStream inputTemplateStream = new FileInputStream(templatePath);

            final ByteArrayOutputStream baos = new ByteArrayOutputStream();
            final ITemplateDocument tpl = Configuration.factory().open(
                    inputTemplateStream, "xlsx", baos);

            final Coffee myCoffee = (new CoffeeData()).getResultSet();

            final Long startTime = System.currentTimeMillis();
            System.out.println("Start processing");

            tpl.process(myCoffee);
            final Long endTime = System.currentTimeMillis();
            System.out.println("Finished in " + (endTime - startTime) + "ms");

            tpl.flush();
            final byte[] result = baos.toByteArray();

            final FileOutputStream fos = new FileOutputStream(outputPath);
            fos.write(result);
            fos.close();
        } catch (final FileNotFoundException e) {
            e.printStackTrace();
        } catch (final IOException e) {
            e.printStackTrace();
        } catch (final Exception e) {
            e.printStackTrace();
        }
    }
}
