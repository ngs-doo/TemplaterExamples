package hr.ngs.templater.example;

import hr.ngs.templater.*;
import org.w3c.dom.NodeList;

import javax.imageio.*;
import javax.imageio.metadata.IIOMetadata;
import javax.imageio.metadata.IIOMetadataNode;
import javax.imageio.stream.ImageInputStream;
import javax.imageio.stream.ImageOutputStream;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.nio.file.Files;
import java.util.*;
import java.util.List;

public class PicturesExample {
    static class Car {
        public final String name;
        public final BufferedImage image;

        Car(String name, String image) throws IOException {
            this.name = name;
            this.image = ImageIO.read(Car.class.getResourceAsStream(image));
        }
    }

    static class Boat {
        public String name;
        public String picture;

        Boat(String name, String picture) {
            this.name = name;
            this.picture = picture;
        }
    }

    static class MaxSizeBufferedImage implements IDocumentFactoryBuilder.IFormatter {

        @Override
        public Object format(Object value, String metadata) {
            if (metadata.startsWith("maxSize(") && value instanceof BufferedImage) {
                //http://www.asknumbers.com/CentimetersToPointsConversion.aspx
                String[] parts = metadata.substring("maxSize(".length(), metadata.length() - 1).split(",");
                int maxWidth = Integer.parseInt(parts[0].trim()) * 28;
                int maxHeight = Integer.parseInt(parts[parts.length - 1].trim()) * 28;
                BufferedImage image = (BufferedImage) value;
                int width = image.getWidth();
                int height = image.getHeight();
                if (width > 0 && maxWidth > 0 && width > maxWidth || height > 0 && maxHeight > 0 && height > maxHeight) {
                    double widthScale = 1.0 * width / maxWidth;
                    double heightScale = 1.0 * height / maxHeight;
                    double scale = Math.max(widthScale, heightScale);
                    int scaledHeight = (int)(image.getHeight() / scale);
                    int scaledWidth = (int)(image.getWidth() / scale);
                    BufferedImage scaledBI = new BufferedImage(scaledWidth, scaledHeight, BufferedImage.TYPE_INT_ARGB);
                    Graphics2D g = scaledBI.createGraphics();
                    g.setComposite(AlphaComposite.Src);
                    Image smoothImage = image.getScaledInstance(scaledWidth, scaledHeight, Image.SCALE_SMOOTH);
                    g.drawImage(smoothImage, 0, 0, scaledWidth, scaledHeight, null);
                    g.dispose();
                    return scaledBI;
                }
            }
            return value;
        }
    }

    static class MaxSizeImageStream implements IDocumentFactoryBuilder.IFormatter {

        private double getPixelSizeMM(IIOMetadataNode dimension, String elementName) {
            NodeList pixelSizes = dimension.getElementsByTagName(elementName);
            if (pixelSizes.getLength() > 0) {
                IIOMetadataNode pixelSize = (IIOMetadataNode) pixelSizes.item(0);
                return 25.4 / Double.parseDouble(pixelSize.getAttribute("value"));
            } else {
                return 96;
            }
        }

        @Override
        public Object format(Object value, String metadata) {
            if (metadata.startsWith("maxSize(") && value instanceof File) {
                String[] parts = metadata.substring("maxSize(".length(), metadata.length() - 1).split(",");
                int maxWidthCm = Integer.parseInt(parts[0].trim());
                int maxHeightCm = Integer.parseInt(parts[parts.length - 1].trim());
                File file = (File) value;
                try {
                    ImageInputStream image = ImageIO.createImageInputStream(file);
                    Iterator<ImageReader> readers = ImageIO.getImageReaders(image);
                    if (readers.hasNext()) {
                        ImageReader reader = readers.next();
                        reader.setInput(image);
                        int width = reader.getWidth(reader.getMinIndex());
                        int height = reader.getHeight(reader.getMinIndex());
                        IIOMetadata readMetadata = reader.getImageMetadata(0);
                        IIOMetadataNode stdTree = (IIOMetadataNode) readMetadata.getAsTree("javax_imageio_1.0");
                        IIOMetadataNode dimension = (IIOMetadataNode) stdTree.getElementsByTagName("Dimension").item(0);
                        double horDpi = getPixelSizeMM(dimension, "HorizontalPixelSize");
                        double verDpi = getPixelSizeMM(dimension, "VerticalPixelSize");
                        double actualWidth = width / horDpi * 2.54;
                        double actualHeight = height / verDpi * 2.54;
                        if (width > 0 && maxWidthCm > 0 && actualWidth > maxWidthCm || height > 0 && maxHeightCm > 0 && actualHeight > maxHeightCm) {
                            double widthScale = 1.0 * actualWidth / maxWidthCm;
                            double heightScale = 1.0 * actualHeight / maxHeightCm;
                            double scale = Math.max(widthScale, heightScale);
                            //let's change the DPI so image fits
                            byte[] bytes = Files.readAllBytes(file.toPath());
                            return new ImageInfo(bytes, file.getName().substring(file.getName().lastIndexOf('.') + 1), width, horDpi * scale, height, verDpi * scale);
                            /* this was required before v3.2.0
                            ImageWriter writer = ImageIO.getImageWriter(reader);
                            BufferedImage bufImg = ImageIO.read(file);
                            ImageWriteParam writeParam = writer.getDefaultWriteParam();
                            ImageTypeSpecifier typeSpecifier = ImageTypeSpecifier.createFromBufferedImageType(BufferedImage.TYPE_INT_RGB);
                            IIOMetadata writeMetadata = writer.getDefaultImageMetadata(typeSpecifier, writeParam);
                            IIOMetadataNode horiz = new IIOMetadataNode("HorizontalPixelSize");
                            horiz.setAttribute("value", Double.toString(horDpi / 25.4 * scale ));
                            IIOMetadataNode vert = new IIOMetadataNode("VerticalPixelSize");
                            vert.setAttribute("value", Double.toString(verDpi / 25.4 * scale ));
                            IIOMetadataNode dim = new IIOMetadataNode("Dimension");
                            dim.appendChild(horiz);
                            dim.appendChild(vert);
                            IIOMetadataNode root = new IIOMetadataNode("javax_imageio_1.0");
                            root.appendChild(dim);
                            writeMetadata.mergeTree("javax_imageio_1.0", root);

                            final ImageOutputStream stream = ImageIO.createImageOutputStream(file);
                            writer.setOutput(stream);
                            writer.write(writeMetadata, new IIOImage(bufImg, null, writeMetadata), writeParam);
                            stream.close();*/
                        }
                    }
                    return ImageIO.createImageInputStream(file);
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            }
            return value;
        }
    }

    static class ImageLoader implements IDocumentFactoryBuilder.IFormatter {

        @Override
        public Object format(Object value, String metadata) {
            if (metadata.equals("from-resource") && value instanceof String) {
                try {
                    String resource = (String) value;
                    InputStream is = ImageLoader.class.getResourceAsStream(resource);
                    String ext = resource.substring(resource.lastIndexOf('.'));
                    //instead of creating a file, we could return ImageInfo directly
                    File tmpPath = File.createTempFile("picture", ext);
                    FileOutputStream fos = new FileOutputStream(tmpPath);
                    byte[] buf = new byte[4096];
                    int read;
                    while ((read = is.read(buf)) != -1) {
                        fos.write(buf, 0, read);
                    }
                    fos.close();
                    //while it would be nicer to use ImageInputStream directly PNG has issues with reseting the stream
                    //so let's use file directly - maxWidth will convert it to appropriate type anyway
                    //return ImageIO.createImageInputStream(tmpPath);
                    return tmpPath;
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }
            return value;
        }
    }

    public static void main(final String[] args) throws Exception {
        InputStream templateStream = PicturesExample.class.getResourceAsStream("/Pictures.docx");
        File tmp = File.createTempFile("picture", ".docx");
        FileOutputStream fos = new FileOutputStream(tmp);
        IDocumentFactory factory = Configuration
                .builder()
                .include(new ImageLoader())
                .include(new MaxSizeBufferedImage())
                .include(new MaxSizeImageStream())
                .build();
        ITemplateDocument tpl = factory.open(templateStream, "docx", fos);
        Map<String, List> data = new HashMap<String, List>();
        data.put("cars", Arrays.asList(
                new Car("Really fast car", "/car1.jpg"),
                new Car("Ford Focus", "/car2.jpg"),
                new Car("Regular car", "/car3.png")
        ));
        data.put("boats", Arrays.asList(
                new Boat("Speadboat", "/boat1.jpg"),
                //current DPI change implementation in MaxSizeImageStream only works correctly on PNG
                new Boat("Slowboat", "/boat2.png"),
                new Boat("Cruiser", "/boat3.jpg")
        ));
        tpl.process(data);
        tpl.flush();
        fos.close();
        Desktop.getDesktop().open(tmp);
    }
}
