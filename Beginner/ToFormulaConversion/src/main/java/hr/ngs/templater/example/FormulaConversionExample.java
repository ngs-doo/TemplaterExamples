package hr.ngs.templater.example;

import hr.ngs.templater.Configuration;
import hr.ngs.templater.ITemplateDocument;

import java.awt.*;
import java.io.*;
import java.util.HashMap;

public class FormulaConversionExample {

    public static void main(final String[] args) throws Exception {
        InputStream templateStream = FormulaConversionExample.class.getResourceAsStream("/SimpleConversion.xlsx");
        File tmp = File.createTempFile("formula", ".xlsx");

        FileOutputStream fos = new FileOutputStream(tmp);
        ITemplateDocument tpl = Configuration.factory().open(templateStream, "xlsx", fos);
        tpl.process(new HashMap<String, Object>() {{ put("aa", 100); put("bb", 22.2); }});
        tpl.flush();
        fos.close();
        Desktop.getDesktop().open(tmp);
    }
}
