package hr.ngs.templater.example;

import hr.ngs.templater.*;

import javax.imageio.*;
import javax.imageio.metadata.IIOMetadata;
import javax.imageio.metadata.IIOMetadataNode;
import javax.imageio.stream.ImageInputStream;
import javax.imageio.stream.ImageOutputStream;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.security.KeyStore;
import java.security.PrivateKey;
import java.security.cert.X509Certificate;
import java.util.*;
import java.util.List;

public class SharedCollectionExample {

    static class Patient {
        public final String name;
        public final List<History> history;
        public final List<Medicine> medicine;

        Patient(String name, List<History> history, List<Medicine> medicine) {
            this.name = name;
            this.history = history;
            this.medicine = medicine;
        }
    }

    static class History {
        public final String description;
        public final int hospitalization;

        History(String description, int hospitalization) {
            this.description = description;
            this.hospitalization = hospitalization;
        }
    }

    static class Medicine {
        public final String name;
        public final int cost;
        public final int interval;
        public final int duration;

        Medicine(String name, int cost, int interval, int duration) {
            this.name = name;
            this.cost = cost;
            this.interval = interval;
            this.duration = duration;
        }
    }

    static class ImageWithDPI implements IDocumentFactoryBuilder.IFormatter {

        @Override
        public Object format(Object value, String md) {
            if (md.startsWith("dpi(") && value instanceof String) {
                try {
                    int dpi = Integer.parseInt(md.substring("dpi(".length(), md.length() - 1));
                    String resource = (String) value;
                    InputStream is = ImageWithDPI.class.getResourceAsStream(resource);
                    String ext = resource.substring(resource.lastIndexOf('.'));
                    File file = File.createTempFile("picture", ext);
                    FileOutputStream fos = new FileOutputStream(file);
                    byte[] buf = new byte[4096];
                    int read;
                    while ((read = is.read(buf)) != -1) {
                        fos.write(buf, 0, read);
                    }
                    fos.close();
                    BufferedImage bufImg = ImageIO.read(file);
                    ImageInputStream iis = ImageIO.createImageInputStream(file);
                    for (Iterator<ImageReader> ir = ImageIO.getImageReaders(iis); ir.hasNext(); ) {
                        ImageWriter writer = ImageIO.getImageWriter(ir.next());
                        ImageWriteParam writeParam = writer.getDefaultWriteParam();
                        ImageTypeSpecifier typeSpecifier = ImageTypeSpecifier.createFromBufferedImageType(BufferedImage.TYPE_INT_RGB);
                        IIOMetadata metadata = writer.getDefaultImageMetadata(typeSpecifier, writeParam);
                        if (metadata.isReadOnly() || !metadata.isStandardMetadataFormatSupported()) {
                            continue;
                        }

                        double dotsPerMilli = 1.0 * dpi / 10 / 2.54;
                        IIOMetadataNode horiz = new IIOMetadataNode("HorizontalPixelSize");
                        horiz.setAttribute("value", Double.toString(dotsPerMilli));
                        IIOMetadataNode vert = new IIOMetadataNode("VerticalPixelSize");
                        vert.setAttribute("value", Double.toString(dotsPerMilli));

                        IIOMetadataNode dim = new IIOMetadataNode("Dimension");
                        dim.appendChild(horiz);
                        dim.appendChild(vert);

                        IIOMetadataNode root = new IIOMetadataNode("javax_imageio_1.0");
                        root.appendChild(dim);

                        metadata.mergeTree("javax_imageio_1.0", root);

                        final ImageOutputStream stream = ImageIO.createImageOutputStream(file);
                        writer.setOutput(stream);
                        writer.write(metadata, new IIOImage(bufImg, null, metadata), writeParam);
                        stream.close();
                        break;
                    }
                    return ImageIO.createImageInputStream(file);
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }
            return value;
        }
    }

    public static void main(final String[] args) throws Exception {
        InputStream templateStream = SharedCollectionExample.class.getResourceAsStream("/TwoTables.docx");
        File tmp = File.createTempFile("sharing", ".docx");
        FileOutputStream fos = new FileOutputStream(tmp);
        InputStream certStream = SharedCollectionExample.class.getResourceAsStream("/templater.pfx");
        KeyStore keyStore = KeyStore.getInstance("PKCS12");
        keyStore.load(certStream, "templater".toCharArray());
        X509Certificate certificate = (X509Certificate)keyStore.getCertificate("templater.info");
        PrivateKey privateKey = (PrivateKey)keyStore.getKey("templater.info", "templater".toCharArray());
        IDocumentFactory factory = Configuration.builder().include(new ImageWithDPI()).sign(certificate, privateKey).build();
        ITemplateDocument tpl = factory.open(templateStream, "docx", fos);
        HashMap<String, Object> data = new HashMap<String, Object>();
        data.put("analysis", "Patient info");
        List<Patient> patients = new ArrayList<Patient>();
        data.put("patients", patients);
        patients.add(new Patient("Kill Bill",
                Arrays.asList(new History("Sword cut", 13), new History("Knife stab", 6)),
                Arrays.asList(new Medicine("Prozac", 100, 6, 365), new Medicine("Zoloft", 120, 12, 200))));
        patients.add(new Patient("Miracle man",
                Collections.singletonList(new History("Gunshot", 0)),
                new ArrayList<Medicine>()));
        patients.add(new Patient("Bruce Lee",
                Arrays.asList(new History("Claw cut", 1), new History("Bruising", 0)),
                Arrays.asList(new Medicine("Vitamins", 4, 8, 365), new Medicine("Fiber", 6, 8, 365))));

        data.put("imageWithDPI", "/java.png");

        tpl.process(data);
        tpl.flush();
        fos.close();
        Desktop.getDesktop().open(tmp);
    }
}
