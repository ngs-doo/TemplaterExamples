package hr.ngs.templater.example;

import hr.ngs.templater.Configuration;
import hr.ngs.templater.ITemplateDocument;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.awt.Desktop;
import java.io.*;
import java.util.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;
import java.util.zip.ZipInputStream;

public class XmlBindingExample {

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
        return new String(buffer, 0, buffer.length, "UTF-8");
    }

    public static void main(final String[] args) throws Exception {
        InputStream templateStream = XmlBindingExample.class.getResourceAsStream("/Binding.docx");
        File tmp = File.createTempFile("bind", ".docx");

        FileOutputStream fos = new FileOutputStream(tmp);
        ITemplateDocument tpl = Configuration.factory().open(templateStream, "docx", fos);

        List<Item> items = new ArrayList<Item>();
        items.add(new Item("Templater", "TPL", "Reporting library", 3, "How many"));
        items.add(new Item("Computer", "COMP", "Hardware", 1, "Items"));
        items.add(new Item("Planets", "PLN", "Big balls", 123567, "Very much"));
        items.add(new Item("Stars", "STR", "Glowing things", 66554433, "Very many"));

        tpl.process(items);

        tpl.flush();
        fos.close();

        String xml = loadXml(tmp);

        //put xml into document for presentation
        tpl = Configuration.factory().open(tmp.getAbsolutePath());
        tpl.templater().replace("xml", xml);
        tpl.flush();

        Desktop.getDesktop().open(tmp);
    }

    static class Item {
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
}
