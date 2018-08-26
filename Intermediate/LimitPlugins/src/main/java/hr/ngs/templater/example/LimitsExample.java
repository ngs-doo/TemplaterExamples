package hr.ngs.templater.example;

import hr.ngs.templater.*;

import java.io.*;
import java.util.*;

public class LimitsExample {

    static class TopNElementsFormatting implements IDocumentFactoryBuilder.IFormatter {

        @Override
        public Object format(Object value, String metadata) {
            if (value instanceof List && metadata.startsWith("top(")) {
                int x = Integer.parseInt(metadata.substring(4, metadata.length() - 1));
                return ((List) value).subList(0, x);
            }
            return value;
        }
    }

    static class TopNElementsProcessing implements IDocumentFactoryBuilder.IProcessor<List> {
        @Override
        public boolean tryProcess(String prefix, ITemplater templater, List list) {
            for (String t : templater.tags()) {
                //if any of the tag metadata contain limit(X), apply limit on the provided list
                Optional<String> limit = Arrays.stream(templater.getMetadata(t, true)).filter(it -> it.startsWith("limit(")).findAny();
                if (limit.isPresent()) {
                    int x = Integer.parseInt(limit.get().substring(6, limit.get().length() - 1));
                    //mutate the object in place... while this is not ideal, it's a convenient way to implement such requirement
                    //alternative is to replicate Iterable processor features which is not trivial
                    while (list.size() > x) {
                        list.remove(x);
                    }
                    break;
                }
            }
            //say that we did not process object, so it's passed down to next processor (built-in)
            //which will process it with more complex logic
            return false;
        }
    }

    static class Instance {
        public String column1;
        public String column2;
        public String column3;
    }

    public static void main(final String[] args) throws Exception {
        InputStream templateStream = LimitsExample.class.getResourceAsStream("/Limits.docx");
        File tmp = File.createTempFile("limits", ".docx");
        List<List<String>> dynamicResize = new ArrayList<>();
        List<Instance> fixed = new ArrayList<>();
        Random rnd = new Random();
        int col = rnd.nextInt(3) + 2;
        for (int i = 0; i < 100; i++) {
            List<String> columns = new ArrayList<>(col);
            for (int j = 0; j < col; j++) {
                columns.add("row " + i + " col " + j + " = " + rnd.nextInt());
            }
            dynamicResize.add(columns);
            Instance instance = new Instance();
            instance.column1 = "row " + i + " col1 " + " = " + rnd.nextInt();
            instance.column2 = "row " + i + " col2 " + " = " + rnd.nextInt();
            instance.column3 = "row " + i + " col3 " + " = " + rnd.nextInt();
            fixed.add(instance);
        }
        Map<String, Object> input = new HashMap<>();
        input.put("dynamic", dynamicResize);
        input.put("fixed", fixed);
        FileOutputStream fos = new FileOutputStream(tmp);
        IDocumentFactory factory =
                Configuration.builder()
                        .include(new TopNElementsFormatting())
                        .include(List.class, new TopNElementsProcessing())
                        .build();
        ITemplateDocument tpl = factory.open(templateStream, "docx", fos);
        tpl.process(input);
        tpl.flush();
        fos.close();
        java.awt.Desktop.getDesktop().open(tmp);
    }
}
