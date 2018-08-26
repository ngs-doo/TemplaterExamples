package hr.ngs.templater.example;

import hr.ngs.templater.*;

import java.awt.*;
import java.io.*;

public class BoolExample {
    static class Bools {
        public boolean game1;
        public boolean game2 = true;
    }

    static class CustomBoolFormatter implements IDocumentFactoryBuilder.IFormatter {

        @Override
        public Object format(Object value, String metadata) {
            if (metadata.startsWith("bool(") && value instanceof Boolean) {
                String[] split = metadata.substring(5, metadata.length() - 1).split("/");
                if ((Boolean) value) {
                    return split[0].replace("\\,", ",");
                } else {
                    return split[split.length - 1].replace("\\,", ",");
                }
            }
            return value;
        }
    }

    public static void main(final String[] args) throws Exception {
        InputStream templateStream = BoolExample.class.getResourceAsStream("/Bools.docx");
        File tmp = File.createTempFile("bool", ".docx");
        FileOutputStream fos = new FileOutputStream(tmp);
        IDocumentFactory factory = Configuration.builder().include(new CustomBoolFormatter()).build();
        ITemplateDocument tpl = factory.open(templateStream, "docx", fos);
        tpl.process(new Bools());
        tpl.flush();
        fos.close();
        Desktop.getDesktop().open(tmp);
    }
}
