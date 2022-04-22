package hr.ngs.templater.example;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import hr.ngs.templater.Configuration;
import hr.ngs.templater.TemplateDocument;

public abstract class Templater {

    public static void createDocument(InputStream template, String extension, OutputStream result, Object ...data) throws IOException {
        //By default Templater will include Java images in low level plugins.
        //To avoid missing awt dependency disable low level plugins
        TemplateDocument document = Configuration.builder()
                .builtInLowLevelPlugins(false)
                .build().open(template, extension, result);
        for(Object d : data) {
            document.process(d);
        }
        document.close();
        template.close();
    }
}
