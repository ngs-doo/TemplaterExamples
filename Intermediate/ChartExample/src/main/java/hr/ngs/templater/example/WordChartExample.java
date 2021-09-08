package hr.ngs.templater.example;

import hr.ngs.templater.Configuration;
import hr.ngs.templater.ITemplateDocument;

import java.io.*;
import java.util.*;

public class WordChartExample {

    @SuppressWarnings("unchecked")
    public static void main(final String[] args) throws Exception {
        InputStream templateStream = WordChartExample.class.getResourceAsStream("/Charts.docx");
        File tmp = File.createTempFile("chart", ".docx");

        Map<String, Object>[] pie1 = new HashMap[] {
            new HashMap<String, Object>() {{ put("name", "Top"); put("value", 11.2); }},
            new HashMap<String, Object>() {{ put("name", "Middle"); put("value", 1.2); }},
            new HashMap<String, Object>() {{ put("name", "Low"); put("value", 22); }}
        };
        Map<String, Object>[] pie2 = new HashMap[]{
                new HashMap<String, Object>() {{ put("name", "Top"); put("value", 44.2); }},
                new HashMap<String, Object>() {{ put("name", "Low"); put("value", 12); }}
        };
        LinkedHashMap<String, Object>[] lines1 = new LinkedHashMap[]{
                new LinkedHashMap<String, Object>() {{ put("category", "good"); put("ser1", 22); put("ser2", 55); put("ser3", 120); }},
                new LinkedHashMap<String, Object>() {{ put("category", "bad"); put("ser1", 12); put("ser2", 155); put("ser3", 20); }},
                new LinkedHashMap<String, Object>() {{ put("category", "great"); put("ser1", 2.5); put("ser2", 4.55); put("ser3", 2); }},
                new LinkedHashMap<String, Object>() {{ put("category", "awful"); put("ser1", 44.5); put("ser2", 55.3); put("ser3", 1.20); }}
        };
        LinkedHashMap<String, Object>[] lines2 = new LinkedHashMap[]{
                new LinkedHashMap<String, Object>() {{ put("category", "nice"); put("ser1", 122); put("ser2", 5); put("ser3", 20); }},
                new LinkedHashMap<String, Object>() {{ put("category", "cute"); put("ser1", 212); put("ser2", 15); put("ser3", 2); }}
        };

        try(FileOutputStream fos = new FileOutputStream(tmp);
            ITemplateDocument tpl = Configuration.factory().open(templateStream, "docx", fos)) {
            tpl.process(new Info[]{
                    new Info("first page", pie1, lines1),
                    new Info("second page", pie2, lines2)
            });
        }
        java.awt.Desktop.getDesktop().open(tmp);
    }

    public static class Info {
        public String tag;
        public Map<String, Object>[] pie;
        public Map<String, Object>[] lines;
        public DynamicResize dr;

        public Info(String tag, Map<String, Object>[] pie, LinkedHashMap<String, Object>[] lines) {
            this.tag = tag;
            this.pie = pie;
            this.lines = lines;
            this.dr = new DynamicResize(lines);
        }
    }

    public static class DynamicResize {
        public String[][] series;
        public String[][] categories;
        public Number[][] values;

        public DynamicResize(LinkedHashMap<String, Object>[] setup) {
            categories = new String[setup.length][];
            values = new Number[categories.length][];
            series = new String[1][];
            series[0] = setup[0].keySet().stream().skip(1).toArray(String[]::new);
            for (int i = 0; i < categories.length; i++) {
                LinkedHashMap<String, Object> d = setup[i];
                categories[i] = new String[] { d.get("category").toString() };
                values[i] = Arrays.stream(series[0]).map(s -> (Number)d.get(s)).toArray(Number[]::new);
            }
        }
    }
}
