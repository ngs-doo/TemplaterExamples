package hr.ngs.templater.example;

import hr.ngs.templater.Configuration;
import hr.ngs.templater.ITemplateDocument;

import java.awt.Desktop;
import java.io.*;
import java.util.ArrayList;
import java.util.List;

public class LabelsExample {

    public static class Address {
        public String FirstName;
        public String LastName;
        public String Line;
        public String PostCode;
    }

    public static void main(final String[] args) throws Exception {
        InputStream templateStream = LabelsExample.class.getResourceAsStream("/label.docx");
        File tmp = File.createTempFile("label", ".docx");

        List<Address> addresses = new ArrayList<Address>();
        for (int i = 0; i < 100; i++) {
            Address address = new Address();
            address.FirstName = "name " + i;
            address.LastName = "surname " + i;
            address.Line = "line " + i;
            address.PostCode = "post " + i;
            addresses.add(address);
        }
        try(FileOutputStream fos = new FileOutputStream(tmp);
            ITemplateDocument tpl = Configuration.factory().open(templateStream, "docx", fos)) {
            tpl.process(addresses);
        }
        Desktop.getDesktop().open(tmp);
    }
}
