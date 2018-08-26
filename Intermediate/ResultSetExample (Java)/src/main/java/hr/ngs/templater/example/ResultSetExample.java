package hr.ngs.templater.example;

import hr.ngs.templater.Configuration;
import hr.ngs.templater.ITemplateDocument;

import java.awt.*;
import java.io.*;

public class ResultSetExample {
    public static void main(final String[] args) throws Exception {
        InputStream templateStream = ResultSetExample.class.getResourceAsStream("/MyCoffeeTable.xlsx");
        File tmp = File.createTempFile("table", ".xlsx");

        Coffee coffee = (new CoffeeData()).getResultSet();

        FileOutputStream fos = new FileOutputStream(tmp);
        ITemplateDocument tpl = Configuration.factory().open(templateStream, "xlsx", fos);

        final Long startTime = System.currentTimeMillis();
        System.out.println("Start processing");

        tpl.process(coffee);

        final Long endTime = System.currentTimeMillis();
        System.out.println("Finished in " + (endTime - startTime) + "ms");

        tpl.flush();
        fos.close();
        Desktop.getDesktop().open(tmp);
    }
}
