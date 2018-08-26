package hr.ngs.templater.example;

import hr.ngs.templater.Configuration;
import hr.ngs.templater.IDocumentFactoryBuilder;
import hr.ngs.templater.ITemplateDocument;
import com.mockrunner.mock.jdbc.MockResultSet;
import hr.ngs.templater.ITemplater;

import java.awt.Desktop;
import java.io.*;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.*;

public class WordTablesExample {
    public static void main(final String[] args) throws Exception {
        InputStream templateStream = WordTablesExample.class.getResourceAsStream("/Tables.docx");
        File tmp = File.createTempFile("table", ".docx");

        //Result set mocking library hijacks the default XML parser. let's specify which one Templater should use
        System.setProperty("templater:DocumentBuilderFactory", "com.sun.org.apache.xerces.internal.jaxp.DocumentBuilderFactoryImpl");
        MockResultSet dt = new MockResultSet("Table");
        dt.addColumn("Col1");
        dt.addColumn("Col2");
        dt.addColumn("Col3");
        for (int i = 0; i < 100; i++) {
            dt.addRow(new String[]{"a" + i, "b" + i, "c" + i});
        }
        MockResultSet dt4 = new MockResultSet("Empty");
        dt4.addColumn("Name");
        dt4.addColumn("Description");
        Object[][] dynamicResize1 = {
                {"a", "b", "c"},
                {"a", null, "c"},
                {"a", "b", null},
                {null, "b", "c"},
                {"a", null, null},
                {null, null, null},
                {"a", "b", "c"}
        };
        Object[][] dynamicResize2 = {
                {"a", "b", "c"},
                {null, null, "c"},
                {null, null, null},
                {null, "b", "c"},
                {"a", null, null},
                {null, "b", null},
                {"a", "b", null}
        };
        List<HashMap<String, Object>> map = Arrays.asList(
                new HashMap<String, Object>() {{
                    put("1", "a");
                    put("2", "b");
                    put("3", "c");
                }},
                new HashMap<String, Object>() {{
                    put("1", "a");
                    put("2", null);
                    put("3", "c");
                }},
                new HashMap<String, Object>() {{
                    put("1", "a");
                    put("2", "b");
                    put("3", null);
                }},
                new HashMap<String, Object>() {{
                    put("1", null);
                    put("2", "b");
                    put("3", "c");
                }},
                new HashMap<String, Object>() {{
                    put("1", "a");
                    put("2", null);
                    put("3", null);
                }},
                new HashMap<String, Object>() {{
                    put("1", null);
                    put("2", null);
                    put("3", null);
                }},
                new HashMap<String, Object>() {{
                    put("1", "a");
                    put("2", "b");
                    put("3", "c");
                }}
        );

        Arguments arguments = new Arguments();
        arguments.Table1 = dt;
        arguments.Table2 = dt;
        arguments.DynamicResize = dynamicResize1;
        arguments.DynamicResizeAndMerge = dynamicResize2;
        arguments.Nulls = map;
        arguments.Table4 = dt4;
        arguments.Combined = Arguments.combined(
                new String[]{"Bottle", "Where"},
                Arguments.beer("Heineken", "Green and cold", "Light", "International"),
                Arguments.beer("Leila", "Blueish", "Blue", "Domestic"));

        FileOutputStream fos = new FileOutputStream(tmp);
        ITemplateDocument tpl =
                Configuration.builder()
                        .include(new Top10Rows())
                        .include(ResultSet.class, new Limit10Table())
                        .include(new CollapseNonEmpty())
                        .build().open(templateStream, "docx", fos);
        tpl.process(arguments);
        tpl.flush();
        fos.close();
        Desktop.getDesktop().open(tmp);
    }

    static class Top10Rows implements IDocumentFactoryBuilder.IFormatter {
        public Object format(Object argument, String metadata) {
            //if we find exact metadata and type invoke the plugin
            if ("top10".equals(metadata) && argument instanceof ResultSet) {
                ResultSet oldRs = (ResultSet) argument;
                MockResultSet newRs = new MockResultSet("copy");
                try {
                    ResultSetMetaData rsMD = oldRs.getMetaData();
                    for (int i = 0; i < rsMD.getColumnCount(); i++) {
                        newRs.addColumn(rsMD.getColumnName(i + 1));
                    }
                    for (int i = 0; i < 10 && oldRs.next(); i++) {
                        Object[] row = new Object[rsMD.getColumnCount()];
                        for (int j = 0; j < row.length; j++) {
                            row[j] = oldRs.getObject(j + 1);
                        }
                        newRs.addRow(row);
                    }
                    return newRs;
                } catch (SQLException ex) {
                    throw new RuntimeException(ex);
                }
            }
            return argument;
        }
    }

    static class Limit10Table implements IDocumentFactoryBuilder.IProcessor<ResultSet> {
        @Override
        public boolean tryProcess(String prefix, ITemplater templater, ResultSet resultSet) {
            try {
                resultSet.last();
                int rows = resultSet.getRow();
                resultSet.first();
                if (rows > 10) {
                    //simplified way to match columns against tags
                    List<String> tags = new ArrayList<String>();
                    ResultSetMetaData rsMD = resultSet.getMetaData();
                    boolean hasMatchingTag = false;
                    for (int i = 0; i < rsMD.getColumnCount(); i++) {
                        String tag = prefix + rsMD.getColumnName(i + 1);
                        tags.add(tag);
                        hasMatchingTag = hasMatchingTag || Arrays.asList(templater.getMetadata(tag, true)).contains("limit10");
                    }
                    //if any of the found tags matches limit10 condition
                    if (hasMatchingTag) {
                        templater.resize(tags.toArray(new String[0]), 10);
                        for (int i = 0; i < 10; i++) {
                            resultSet.next();
                            for (int x = 0; x < rsMD.getColumnCount(); x++) {
                                templater.replace(prefix + rsMD.getColumnName(x + 1), resultSet.getObject(x + 1));
                            }
                        }
                        return true;
                    }
                }
            } catch (SQLException ex) {
                throw new RuntimeException(ex);
            }
            return false;
        }
    }

    static class CollapseNonEmpty implements IDocumentFactoryBuilder.IHandler {
        @Override
        public boolean handle(Object value, String metadata, String property, ITemplater templater) {
            if ("collapseNonEmpty".equals(metadata) || "collapseEmpty".equals(metadata)) {
                if (value instanceof ResultSet == false) return false;
                ResultSet rs = (ResultSet) value;
                try {
                    boolean isEmpty = !rs.next();
                    //loop until all tags with the same name are processed
                    do {
                        List<String> md = Arrays.asList(templater.getMetadata(property, false));
                        boolean collapseOnEmpty = md.contains("collapseEmpty");
                        boolean collapseNonEmpty = md.contains("collapseNonEmpty");
                        if (isEmpty) {
                            if (collapseOnEmpty)
                                templater.resize(new String[]{property}, 0);
                            else
                                templater.replace(property, "");
                        } else {
                            if (collapseNonEmpty)
                                templater.resize(new String[]{property}, 0);
                            else
                                templater.replace(property, "");
                        }
                    } while (Arrays.asList(templater.tags()).contains(property));
                    return true;
                } catch (SQLException ex) {
                    throw new RuntimeException(ex);
                }
            }
            return false;
        }
    }
}
