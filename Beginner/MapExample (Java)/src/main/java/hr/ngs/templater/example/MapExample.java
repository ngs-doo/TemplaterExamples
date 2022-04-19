package hr.ngs.templater.example;

import hr.ngs.templater.Configuration;
import hr.ngs.templater.TemplateDocument;

import java.awt.*;
import java.io.*;
import java.util.HashMap;
import java.util.Map;

import org.joda.time.LocalDate;

public class MapExample {
    public static void main(final String[] args) throws Exception {
        InputStream templateStream = MapExample.class.getResourceAsStream("/MyMap.docx");
        File tmp = File.createTempFile("map", ".docx");

        final Map<String, Object> myMap = new HashMap<String, Object>();
        myMap.put("Name", "James Bond");
        myMap.put("Age", 40);
        myMap.put("Gun", new Gun("Revolvers", "Colt", "45"));

        final Map<String, LocalDate> killed = new HashMap<String, LocalDate>();
        killed.put("Dr Evil", new LocalDate("1965-05-05"));
        killed.put("Moneypenny", new LocalDate("1967-05-05"));
        killed.put("Spectre", new LocalDate("1968-05-05"));

        myMap.put("Kills", killed);

        try (FileOutputStream fos = new FileOutputStream(tmp);
             TemplateDocument tpl = Configuration.factory().open(templateStream, "docx", fos)) {
            tpl.process(myMap);
        }
        Desktop.getDesktop().open(tmp);
    }
}
