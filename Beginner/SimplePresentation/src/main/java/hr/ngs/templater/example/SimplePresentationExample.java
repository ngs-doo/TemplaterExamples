package hr.ngs.templater.example;

import hr.ngs.templater.Configuration;
import hr.ngs.templater.ITemplateDocument;

import java.io.*;

public class SimplePresentationExample {

    public static class Model {
        public String title = "Important presentation";
        public String subtitle = "Powered by Templater";
    }

    public static void main(final String[] args) throws Exception {
        InputStream templateStream = SimplePresentationExample.class.getResourceAsStream("/Presentation.pptx");
        File tmp = File.createTempFile("simple-presentation", ".pptx");

        Model data = new Model();

        try(FileOutputStream fos = new FileOutputStream(tmp);
            ITemplateDocument tpl = Configuration.factory().open(templateStream, "pptx", fos)) {
            tpl.process(data);
        }
        java.awt.Desktop.getDesktop().open(tmp);
    }

}
