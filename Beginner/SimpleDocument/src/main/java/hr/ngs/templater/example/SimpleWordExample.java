package hr.ngs.templater.example;

import hr.ngs.templater.Configuration;
import hr.ngs.templater.TemplateDocument;

import java.io.*;

public class SimpleWordExample {

    public static class MyClass {
        public String Tag = "an example";
    }

    public static void main(final String[] args) throws Exception {
        InputStream templateStream = SimpleWordExample.class.getResourceAsStream("/MyDocument.docx");
        File tmp = File.createTempFile("simple-word", ".docx");

        MyClass data = new MyClass();

        try (FileOutputStream fos = new FileOutputStream(tmp);
             TemplateDocument tpl = Configuration.factory().open(templateStream, "docx", fos)) {
            tpl.process(data);
        }
        java.awt.Desktop.getDesktop().open(tmp);
    }
}
