package hr.ngs.templater.example;

import hr.ngs.templater.Configuration;
import hr.ngs.templater.IDocumentFactoryBuilder;
import hr.ngs.templater.ITemplateDocument;

import javax.imageio.ImageIO;
import java.awt.Desktop;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.ArrayList;
import java.util.List;

public class MailMergeExample {

    public static class CSV {
        public final String Name;
        public final String date;
        public final BufferedImage signature;
        public final ImageReference customSignature;
        public CSV(String line) throws IOException {
            String[] parts = line.split(",");
            Name = parts[0];
            date = parts[1];
            InputStream is = MailMergeExample.class.getResourceAsStream("/" + parts[2]);
            signature = is != null ? ImageIO.read(is) : null;
            customSignature = new ImageReference(parts[2]);
        }
    }

    static class ImageReference {
        public final String value;
        public ImageReference(String value) {
            this.value = value;
        }
    }

    static class ImageReferenceReplacer implements IDocumentFactoryBuilder.LowLevelReplacer {
        @Override
        public Object replace(Object value, String tag, String[] metadata) {
            if (value instanceof ImageReference) {
                ImageReference ir = (ImageReference) value;
                InputStream is = MailMergeExample.class.getResourceAsStream("/" + ir.value);
                try {
                    return is != null ? ImageIO.read(is) : null;
                } catch (IOException ex) {
                    throw new RuntimeException(ex);
                }
            }
            return value;
        }
    }

    public static void main(final String[] args) throws Exception {
        InputStream templateStream = MailMergeExample.class.getResourceAsStream("/letter.docx");
        InputStream csvStream = MailMergeExample.class.getResourceAsStream("/data.csv");
        File tmp = File.createTempFile("merge", ".docx");

        List<CSV> data = new ArrayList<CSV>();

        String line;
        BufferedReader br = new BufferedReader(new InputStreamReader(csvStream));
        br.readLine();
        while ((line = br.readLine()) != null) {
            data.add(new CSV(line));
        }
        br.close();

        try(FileOutputStream fos = new FileOutputStream(tmp);
            ITemplateDocument tpl = Configuration.builder().include(new ImageReferenceReplacer()).build().open(templateStream, "docx", fos)) {
            tpl.process(data);
        }
        Desktop.getDesktop().open(tmp);
    }
}
