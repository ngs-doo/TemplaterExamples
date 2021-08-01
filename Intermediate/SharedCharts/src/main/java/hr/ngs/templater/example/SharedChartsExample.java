package hr.ngs.templater.example;

import hr.ngs.templater.*;

import java.awt.Desktop;
import java.io.*;
import java.math.BigDecimal;
import java.util.*;

public class SharedChartsExample {

    public static class LanguageUsage {
        public String language;
        public BigDecimal web;
        public BigDecimal desktop;
        public BigDecimal mobile;
        LanguageUsage(String language, double web, double desktop, double mobile) {
            this.language = language;
            this.web = BigDecimal.valueOf(web);
            this.desktop = BigDecimal.valueOf(desktop);
            this.mobile = BigDecimal.valueOf(mobile);
        }
    }

    public static void main(final String[] args) throws Exception {
        InputStream templateStream = SharedChartsExample.class.getResourceAsStream("/charts.pptx");
        File tmp = File.createTempFile("chart", ".pptx");

        List<LanguageUsage> usage = new ArrayList<LanguageUsage>();
        usage.add(new LanguageUsage("C#", 81.3, 92.22, 52.62));
        usage.add(new LanguageUsage("Java", 87.43, 69.44, 89.91));
        usage.add(new LanguageUsage("C++", 15.6, 32.6, 27.04));
        usage.add(new LanguageUsage("Python", 40.22, 33.36, 20.41));
        usage.add(new LanguageUsage("Javascript", 92.54, 42.67, 38.78));
        Map<String, Object> data = new HashMap<String, Object>();
        data.put("title", "Languages");
        data.put("subtitle", "Usage analysis");
        data.put("data", usage);
        try(FileOutputStream fos = new FileOutputStream(tmp);
            ITemplateDocument tpl = Configuration.factory().open(templateStream, "pptx", fos)) {
            tpl.process(data);
        }
        Desktop.getDesktop().open(tmp);
    }
}
