package hr.ngs.templater.example;

import hr.ngs.templater.Configuration;
import hr.ngs.templater.ITemplateDocument;

import java.awt.Desktop;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

public class XmlBindingExample {

    public static void main(final String[] args) throws Exception {
        InputStream templateStream = XmlBindingExample.class.getResourceAsStream("/Binding.docx");
        File tmp = File.createTempFile("bind", ".docx");

        FileOutputStream fos = new FileOutputStream(tmp);
        ITemplateDocument doc = Configuration.factory().open(templateStream, "docx", fos);

        doc.process(Arrays.asList(
                new Item("Templater", "TPL", "Reporting library", 3, "How many"),
                new Item("Computer", "COMP", "Hardware", 1, "Items"),
                new Item("Planets", "PLN", "Big balls", 123567, "Very much"),
                new Item("Stars", "STR", "Glowing things", 66554433, "Very many")));
        doc.process(new Object() {
            public final String selectedValue = "Unknown";
            public final Dropdown[] dropdown = {
                    new Dropdown("Option 1", "1"),
                    new Dropdown("Option 2", "2"),
                    new Dropdown("C value", "C"),
                    new Dropdown("Unknown", "unknown")
            };
        });

        doc.close();
        fos.close();

        String xml = loadXml(tmp);

        //put xml into document for presentation
        doc = Configuration.factory().open(tmp.getAbsolutePath());
        doc.templater().replace("xml", xml);
        doc.close();

        Desktop.getDesktop().open(tmp);
    }

    public static class Item {
        public final String product;
        public final String code;
        public final String description;
        public final int quantity;
        public final String title;

        public Item(String product, String code, String description, int quantity, String title) {
            this.product = product;
            this.code = code;
            this.description = description;
            this.quantity = quantity;
            this.title = title;
        }
    }

    public static class Dropdown {
        public String name;
        public String value;
        public Dropdown(String name, String value) {
            this.name = name;
            this.value = value;
        }
    }

    private static String loadXml(File file) throws Exception {
        ZipFile zip = new ZipFile(file);
        ZipEntry entry = zip.getEntry("customXml/item1.xml");
        InputStream is = zip.getInputStream(entry);
        int size = (int) entry.getSize();
        byte[] buffer = new byte[size];
        int len;
        int position = 0;
        while ((len = is.read(buffer, position, size - position)) > 0) {
            position += len;
        }
        is.close();
        zip.close();
        return new String(buffer, 0, buffer.length, StandardCharsets.UTF_8);
    }
}
