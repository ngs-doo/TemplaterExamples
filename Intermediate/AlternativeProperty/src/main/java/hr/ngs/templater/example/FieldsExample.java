package hr.ngs.templater.example;

import hr.ngs.templater.*;

import java.awt.*;
import java.io.*;
import java.lang.reflect.Field;
import java.util.concurrent.Callable;

public class FieldsExample {
    static class MyObjectA {
        public String fieldA = null;
    }

    static class MyObjectB {
        public String fieldB = "alternative value";
    }

    static class MyObject {
        public MyObjectA objectA = new MyObjectA();
        public MyObjectB objectB = new MyObjectB();
    }

    static class MissingFormatter implements DocumentFactoryBuilder.Formatter {
        //to be able to navigate over non processed object, lets keep reference to entry point
        private Object currentRootObject;

        public void setRoot(Object root) {
            this.currentRootObject = root;
        }

        @Override
        public Object format(Object value, String metadata) {
            if (metadata.startsWith("missing(") && value == null) {
                try {
                    //path to appropriate field
                    String[] path = metadata.substring(8, metadata.length() - 1).split("\\.");
                    Object current = currentRootObject;
                    for (String p : path) {
                        Field f = current.getClass().getField(p);
                        current = f.get(current);
                    }
                    return current;
                } catch (Exception ignore) {
                }
            }
            return value;
        }
    }

    public static void main(final String[] args) throws Exception {
        InputStream templateStream = FieldsExample.class.getResourceAsStream("/Fields.docx");
        File tmp = File.createTempFile("fields", ".docx");
        FileOutputStream fos = new FileOutputStream(tmp);
        MissingFormatter formatter = new MissingFormatter();
        DocumentFactory factory = Configuration.builder().include(formatter).build();
        try (TemplateDocument tpl = factory.open(templateStream, "docx", fos)) {
            process(formatter, tpl, new MyObject());
        }
        fos.close();
        Desktop.getDesktop().open(tmp);
    }

    private static void process(MissingFormatter formatter, TemplateDocument doc, Object value) {
        try {
            formatter.setRoot(value); // we can keep track of root object in a formatter plugin
            doc.process(value);
        } finally {
            formatter.setRoot(null);
        }
    }
}
