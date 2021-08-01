package hr.ngs.templater.example;

import hr.ngs.templater.Configuration;
import hr.ngs.templater.ITemplateDocument;

import java.awt.Desktop;
import java.io.*;

public class ParagraphsExample {

    public static class Paragraph {
        public final String paragraph;
        public Paragraph(String paragraph) {
            this.paragraph = paragraph;
        }
    }
    public static class Model {
        public Paragraph[] table;
        public Paragraph[] list;
        public String remove_cc;
    }

    public static void main(final String[] args) throws Exception {
        InputStream templateStream = ParagraphsExample.class.getResourceAsStream("/Paragraphs.docx");
        File tmp = File.createTempFile("Paragraphs", ".docx");

        Paragraph[] paragraphs = new Paragraph[] {
                new Paragraph("While Templater does not support resizing of paragraphs, same effect can be created through the use of lists and tables which are considered resizable by Templater."),
                new Paragraph("A common use case for paragraphs is custom indentation rules for paragraphs which can be replicated just fine inside lists and tables with a use of some tricks.")
        };
        Model model = new Model();
        model.table = paragraphs;
        model.list = paragraphs;
        try(FileOutputStream fos = new FileOutputStream(tmp);
            ITemplateDocument tpl = Configuration.factory().open(templateStream, "docx", fos)) {
            tpl.process(model);
        }
        Desktop.getDesktop().open(tmp);
    }
}
