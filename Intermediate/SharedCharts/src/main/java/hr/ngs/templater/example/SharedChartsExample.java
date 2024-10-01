package hr.ngs.templater.example;

import hr.ngs.templater.*;

import java.awt.Desktop;
import java.io.*;
import java.lang.reflect.Field;
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
        public BigDecimal total() {
            return web.add(desktop).add(mobile);
        }
    }

    public static class TableData {
        public final String A;
        public final int B;
        public final String C;
        public TableData(int i) {
            this.A = "A - " + i;
            this.B = i;
            this.C = "C - " + i;
        }
    }

    public static void main(final String[] args) throws Exception {
        InputStream templateStream = SharedChartsExample.class.getResourceAsStream("/charts.pptx");
        File tmp = File.createTempFile("chart", ".pptx");

        List<LanguageUsage> usage = new ArrayList<>();
        usage.add(new LanguageUsage("C#", 81.3, 92.22, 52.62));
        usage.add(new LanguageUsage("Java", 87.43, 69.44, 89.91));
        usage.add(new LanguageUsage("C++", 15.6, 32.6, 27.04));
        usage.add(new LanguageUsage("Python", 40.22, 33.36, 20.41));
        usage.add(new LanguageUsage("Javascript", 92.54, 42.67, 38.78));
        List<TableData> tableData = new ArrayList<>();
        for (int i = 1; i <= 15; i++) {
            tableData.add(new TableData(i));
        }
        Map<String, Object> data = new HashMap<>();
        data.put("title", "Languages");
        data.put("subtitle", "Usage analysis");
        data.put("data", usage);
        data.put("dr", new Object() {
            public final String[][] kind = {{"Web", "Desktop", "Mobile"}};
            public final Object[][] data = usage.stream().map(it -> new Object[]{it.language, it.web, it.desktop, it.mobile}).toArray(Object[][]::new);
        });
        data.put("table", tableData);
        DocumentFactory factory = Configuration.builder()
                .navigateSeparator(':', null)
                .include(new SplitRows())
                .include(new SumEntries())
                .build();
        try (FileOutputStream fos = new FileOutputStream(tmp);
             TemplateDocument tpl = factory.open(templateStream, "pptx", fos)) {
            tpl.process(data);
        }
        Desktop.getDesktop().open(tmp);
    }

    static class SplitRows implements DocumentFactoryBuilder.Navigate {
        public Object navigate(Object parent, Object value, String member, String metadata) {
            if (value instanceof List == false) return value;
            //check if plugin is applicable
            if (!metadata.startsWith("split(")) return value;
            final List list = (List) value;
            int limit = Integer.parseInt(metadata.substring(6, metadata.length() - 1));
            List<Object> result = new ArrayList<>();
            final int size = list.size() / limit;
            for (int i = 0; i <= size; i++) {
                final int ii = i;
                result.add(new Object() {
                    public final int index = ii;
                    public final boolean isNotLast = ii < size;
                    public final List value = list.subList(ii * limit, Math.min((ii + 1) * limit, list.size()));
                });
            }
            return result;
        }
    }
    static class SumEntries implements DocumentFactoryBuilder.Navigate {
        public Object navigate(Object parent, Object value, String member, String metadata) {
            if (value instanceof List == false) return value;
            //check if plugin is applicable
            if (!metadata.startsWith("sum(")) return value;
            final List list = (List) value;
            //lets sum values across all table rows for specified property in metadata
            String propertyName = metadata.substring(4, metadata.length() - 1);
            int sum = 0;
            if (list.size() > 0) {
                try {
                    Field field = list.get(0).getClass().getField(propertyName);
                    for (Object it : list) {
                        //for simplification assume its of expected type
                        sum += (int) field.get(it);
                    }
                } catch (NoSuchFieldException | IllegalAccessException e) {
                    throw new RuntimeException(e);
                }
            }
            return sum;
        }
    }
}
