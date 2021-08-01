package hr.ngs.templater.example;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import hr.ngs.templater.*;
import org.apache.batik.anim.dom.SAXSVGDocumentFactory;
import org.apache.batik.anim.dom.SVGDOMImplementation;
import org.apache.batik.dom.GenericComment;
import org.apache.batik.transcoder.TranscoderInput;
import org.apache.batik.transcoder.TranscoderOutput;
import org.apache.batik.transcoder.image.PNGTranscoder;
import org.apache.batik.util.XMLResourceDescriptor;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javax.imageio.*;
import javax.imageio.metadata.IIOMetadata;
import javax.imageio.metadata.IIOMetadataNode;
import javax.imageio.stream.ImageInputStream;
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

    static class Svg {
        public String name;
        public String description;
        public Document document;

        Svg(String name, String description, Document document) {
            this.name = name;
            this.description = description;
            this.document = document;
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

        private float getPixelSizeMM(IIOMetadataNode dimension, String elementName) {
            NodeList pixelSizes = dimension.getElementsByTagName(elementName);
            if (pixelSizes.getLength() > 0) {
                IIOMetadataNode pixelSize = (IIOMetadataNode) pixelSizes.item(0);
                return 25.4f / Float.parseFloat(pixelSize.getAttribute("value"));
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
                        float horDpi = getPixelSizeMM(dimension, "HorizontalPixelSize");
                        float verDpi = getPixelSizeMM(dimension, "VerticalPixelSize");
                        float actualWidth = width / horDpi * 2.54f;
                        float actualHeight = height / verDpi * 2.54f;
                        if (width > 0 && maxWidthCm > 0 && actualWidth > maxWidthCm || height > 0 && maxHeightCm > 0 && actualHeight > maxHeightCm) {
                            float widthScale = actualWidth / maxWidthCm;
                            float heightScale = actualHeight / maxHeightCm;
                            float scale = Math.max(widthScale, heightScale);
                            //let's change the DPI so image fits
                            byte[] bytes = Files.readAllBytes(file.toPath());
                            return new ImageInfo(bytes, file.getName().substring(file.getName().lastIndexOf('.') + 1), width, horDpi * scale, height, verDpi * scale);
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

    static class ExampleTranscoderWithSize extends PNGTranscoder {
        public int getWidth() { return (int)super.width; }
        public int getHeight() { return (int)super.height; }
    }

    static class BatikSvgConversion implements IDocumentFactoryBuilder.SvgConverter {

        @Override
        public ImageInfo convert(Document document) {
            try {
                Node node = document.getFirstChild();
                //don't convert first picture for example sake
                if (node instanceof GenericComment) return null;
                ByteArrayOutputStream os = new ByteArrayOutputStream();
                ExampleTranscoderWithSize t = new ExampleTranscoderWithSize();
                TranscoderInput input = new TranscoderInput(document);
                TranscoderOutput output = new TranscoderOutput(os);
                t.transcode(input, output);
                os.flush();
                return ImageInfo.from(os.toByteArray())
                        .extension("png")
                        .height(t.getHeight())
                        .width(t.getWidth())
                        .build();
            } catch (Exception ex) {
                ex.printStackTrace();
                return null;
            }
        }
    }

    private static Document svgDoc(SAXSVGDocumentFactory factory, String name) throws IOException {
        return factory.createDocument(SVGDOMImplementation.SVG_NAMESPACE_URI, Svg.class.getResourceAsStream(name));
    }

    static class ConvertQR implements IDocumentFactoryBuilder.IFormatter {

        @Override
        public Object format(Object value, String metadata) {
            if (!"qr".equals(metadata) || value instanceof String == false) return value;
            try {
                BitMatrix matrix = new MultiFormatWriter().encode((String) value, BarcodeFormat.QR_CODE, 72, 72);
                ByteArrayOutputStream os = new ByteArrayOutputStream();
                MatrixToImageWriter.writeToStream(matrix, "png", os);
                return ImageInfo.from(os.toByteArray()).width(72).height(72).extension("png").build();
            } catch (Exception e) {
                e.printStackTrace();
                return value;
            }
        }
    }

    public static void main(final String[] args) throws Exception {
        InputStream templateStream = PicturesExample.class.getResourceAsStream("/Pictures.docx");
        File tmp = File.createTempFile("picture", ".docx");
        FileOutputStream fos = new FileOutputStream(tmp);
        IDocumentFactory factory = Configuration
                .builder()
                .include(new ImageLoader())//setup image loading via from-resource metadata
                .include(new MaxSizeBufferedImage())//setup image resizing via maxSize(X, Y) metadata
                .include(new MaxSizeImageStream())//setup image resizing via maxSize(X, Y) metadata
                .svgConverter(new BatikSvgConversion())
                .include(new ConvertQR())//setup QR code generation from text
                .build();
        SAXSVGDocumentFactory svgFactory = new SAXSVGDocumentFactory(XMLResourceDescriptor.getXMLParserClassName());
        ITemplateDocument tpl = factory.open(templateStream, "docx", fos);
        Map<String, Object> data = new HashMap<String, Object>();
        data.put("cars", Arrays.asList(
                new Car("Really fast car", "/car1.gif"),
                new Car("Ford Focus", "/car2.jpg"),
                new Car("Regular car", "/car3.png")
        ));
        data.put("boats", Arrays.asList(
                new Boat("Speadboat", "/boat1.jpg"),
                //current DPI change implementation in MaxSizeImageStream only works correctly on PNG
                new Boat("Slowboat", "/boat2.png"),
                new Boat("Cruiser", "/boat3.jpg")
        ));
        data.put("svg", Arrays.asList(
                new Svg("Cat face", "without fallback image conversion - works only in MS Word 2016+", svgDoc(svgFactory, "/cat_face.svg")), //Icon made by Freepik from www.flaticon.com
                new Svg("Happy cat", "with fallback image conversion", svgDoc(svgFactory, "/cat_happy.svg")) //Icon made by Smashicons from www.flaticon.com
        ));
        data.put("placeholder", ImageIO.read(PicturesExample.class.getResourceAsStream("/unicorn.jpg")));
        data.put("qr-tag", "https://templater.info/");
        tpl.process(data);
        tpl.close();
        fos.close();
        Desktop.getDesktop().open(tmp);
    }
}
