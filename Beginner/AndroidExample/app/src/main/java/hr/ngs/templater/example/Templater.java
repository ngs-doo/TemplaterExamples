package hr.ngs.templater.example;

import org.apache.xerces.jaxp.DocumentBuilderFactoryImpl;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import hr.ngs.templater.Configuration;
import hr.ngs.templater.ITemplateDocument;

public abstract class Templater {

    public static void createDocument(InputStream template, String extension, OutputStream result, Object ...data) throws IOException {
        //By default Templater will include Java images in low level plugins.
        //To avoid missing awt dependency disable low level plugins
        //Use custom XML library as Android one does not work for non-trivial stuff
        ITemplateDocument document = Configuration.builder()
                .builtInLowLevelPlugins(false)
                .xmlBuilder(new org.apache.xerces.jaxp.DocumentBuilderFactoryImpl(), false)
                .build().open(template, extension, result);
        for(Object d : data) {
            document.process(d);
        }
        document.flush();
        template.close();
    }
}
