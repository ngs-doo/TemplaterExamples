package hr.ngs.templater.example;

import hr.ngs.templater.*;

import java.io.*;
import java.util.*;
import java.util.stream.Collectors;

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

    static class TopNElementNavigation implements IDocumentFactoryBuilder.INavigate {

        @Override
        public Object navigate(Object parent, Object value, String member, String metadata) {
            if (value instanceof List && metadata.startsWith("limit(")) {
                //extract argument from the metadata
                int limit = Integer.parseInt(metadata.substring(6, metadata.length() - 1));
                List list = (List)value;
                //return only a subset of list for processing - does not mutate the object like previous plugin
                return list.subList(0, limit);
            }
            return value;
        }
    }

    static class ListGrouping implements IDocumentFactoryBuilder.INavigate {

        @Override
        public Object navigate(Object parent, Object value, String member, String metadata) {
            if (value instanceof List && metadata.startsWith("group(")) {
                //extract grouping column
                String name = metadata.substring(6, metadata.length() - 1);
                List<Map> list = (List) value;
                Map<String, List<Map>> result = list.stream().collect(
                        //use linked hash map to preserve order
                        Collectors.groupingBy(it -> (String) it.get(name), LinkedHashMap::new, Collectors.toList())
                );
                //key and value members work due to Java Bean support which map getKey and getValue into such tags
                return result.entrySet();
            }
            return value;
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
        List<Map> list = new ArrayList<>();
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
            Map<String, Object> item = new HashMap<>();
            item.put("A", "group " + (i % 5 + 1));
            item.put("B", "row " + (i + 1));
            item.put("C", "modulo " + (i % 10));
            list.add(item);
        }
        Map<String, Object> input = new HashMap<>();
        input.put("dynamic", dynamicResize);
        input.put("fixed", fixed);
        input.put("list", list);
        FileOutputStream fos = new FileOutputStream(tmp);
        IDocumentFactory factory =
                Configuration.builder()
                        .include(new TopNElementsFormatting())
                        .include(List.class, new TopNElementsProcessing())
                        .navigateSeparator(':')
                        .include(new TopNElementNavigation())
                        .include(new ListGrouping())
                        .build();
        ITemplateDocument tpl = factory.open(templateStream, "docx", fos);
        tpl.process(input);
        tpl.flush();
        fos.close();
        java.awt.Desktop.getDesktop().open(tmp);
    }
}
