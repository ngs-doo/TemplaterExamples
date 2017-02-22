package hr.ngs.templater.example;

import hr.ngs.templater.*;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
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

	static class MaxWidth implements IDocumentFactoryBuilder.IFormatter {

		@Override
		public Object format(Object value, String metadata) {
			if (metadata.startsWith("maxWidth(") && value instanceof BufferedImage) {
				//http://www.asknumbers.com/CentimetersToPointsConversion.aspx
				int maxWidth = Integer.parseInt(metadata.substring("maxWidth(".length(), metadata.length() - 1)) * 28;
				BufferedImage image = (BufferedImage) value;
				int width = image.getWidth();
				if (width > 0 && maxWidth > 0 && width > maxWidth) {
					int scaledHeight = image.getHeight() * maxWidth / width;
					BufferedImage scaledBI = new BufferedImage(maxWidth, scaledHeight, BufferedImage.TYPE_INT_ARGB);
					Graphics2D g = scaledBI.createGraphics();
					g.setComposite(AlphaComposite.Src);
					g.drawImage(image, 0, 0, maxWidth, scaledHeight, null);
					g.dispose();
					return scaledBI;
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
					return ImageIO.read(ImageLoader.class.getResourceAsStream((String) value));
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
		IDocumentFactory factory = Configuration.builder().include(new ImageLoader()).include(new MaxWidth()).build();
		ITemplateDocument tpl = factory.open(templateStream, "docx", fos);
		Map<String, List> data = new HashMap<String, List>();
		data.put("cars", Arrays.asList(
				new Car("Really fast car", "/car1.jpg"),
				new Car("Ford Focus", "/car2.jpg"),
				new Car("Regular car", "/car3.png")
		));
		data.put("boats", Arrays.asList(
				new Boat("Speadboat", "/boat1.jpg"),
				new Boat("Slowboat", "/boat2.jpeg"),
				new Boat("Cruiser", "/boat3.jpg")
		));
		tpl.process(data);
		tpl.flush();
		fos.close();
		Desktop.getDesktop().open(tmp);
	}
}
