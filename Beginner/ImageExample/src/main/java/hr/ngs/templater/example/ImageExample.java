package hr.ngs.templater.example;

import hr.ngs.templater.Configuration;
import hr.ngs.templater.TemplateDocument;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;

public class ImageExample {

    public static void main(final String[] args) throws Exception {
        InputStream templateStream = ImageExample.class.getResourceAsStream("/Picture.docx");
        File tmp = File.createTempFile("image", ".docx");

        try (FileOutputStream fos = new FileOutputStream(tmp);
             TemplateDocument tpl = Configuration.factory().open(templateStream, "docx", fos)) {
            BufferedImage img = ImageIO.read(ImageExample.class.getResourceAsStream("/Chuck_Norris.jpg"));
            //we can even use low level API to change tags directly
            tpl.templater().replace("picture", img);
        }
        Desktop.getDesktop().open(tmp);
    }
}
