package hr.ngs.templater.example;

import hr.ngs.templater.*;
import com.mockrunner.mock.jdbc.MockResultSet;

import java.awt.Desktop;
import java.io.*;
import java.math.BigDecimal;
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
        MockResultSet dtData = new MockResultSet("Table");
        dtData.addColumn("Col1");
        dtData.addColumn("Col2");
        dtData.addColumn("Col3");
        for (int i = 0; i < 100; i++) {
            dtData.addRow(new String[]{"a" + i, "b" + i, "c" + i});
        }
        MockResultSet dtEmpty = new MockResultSet("Empty");
        dtEmpty.addColumn("Name");
        dtEmpty.addColumn("Description");
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
                new HashMap<String, Object>() {{ put("1", "a"); put("2", "b"); put("3", "c"); }},
                new HashMap<String, Object>() {{ put("1", "a"); put("2", null); put("3", "c"); }},
                new HashMap<String, Object>() {{ put("1", "a"); put("2", "b"); put("3", null); }},
                new HashMap<String, Object>() {{ put("1", null); put("2", "b"); put("3", "c"); }},
                new HashMap<String, Object>() {{ put("1", "a"); put("2", null); put("3", null); }},
                new HashMap<String, Object>() {{ put("1", null); put("2", null); put("3", null); }},
                new HashMap<String, Object>() {{ put("1", "a"); put("2", "b"); put("3", "c"); }}
        );
        List<Arguments.Fixed> fixedItems = Arrays.asList(
                new Arguments.Fixed("A", 1, BigDecimal.valueOf(42)),
                new Arguments.Fixed("B", 2, BigDecimal.valueOf(23)),
                new Arguments.Fixed("C", 3, BigDecimal.valueOf(505)),
                new Arguments.Fixed("D", 4, BigDecimal.valueOf(99)),
                new Arguments.Fixed("E", 5, BigDecimal.valueOf(199)),
                new Arguments.Fixed("F", 6, BigDecimal.valueOf(0)),
                new Arguments.Fixed("G", 7, BigDecimal.valueOf(7))
        );

        Arguments arguments = new Arguments();
        arguments.Table1 = dtData;
        arguments.Table2 = dtData;
        arguments.DynamicResize = dynamicResize1;
        arguments.DynamicResizeAndMerge = dynamicResize2;
        arguments.Nulls = map;
        arguments.Table4 = dtEmpty;
        arguments.Table5 = dtEmpty;
        arguments.Combined = Arguments.combined(
                new String[]{"Bottle", "Where"},
                Arguments.beer("Heineken", "Green and cold", "Light", "International"),
                Arguments.beer("Leila", "Blueish", "Blue", "Domestic"));
        arguments.Fixed = fixedItems;

        FileOutputStream fos = new FileOutputStream(tmp);
        TemplateDocument tpl =
                Configuration.builder()
                        .include(new Top10Rows())
                        .include(ResultSet.class, new Limit10Table())
                        //without specifying separator, navigation feature will not be available
                        .navigateSeparator(':', null)
                        .include(new LimitResultSet())
                        .include(new CollapseNonEmpty())
                        .build().open(templateStream, "docx", fos);
        tpl.process(arguments);
        tpl.close();
        fos.close();
        Desktop.getDesktop().open(tmp);
    }

    static class Top10Rows implements DocumentFactoryBuilder.Formatter {
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
                    //since this is in memory and we are reusing it in plugins for the sake of example, let's just reposition
                    oldRs.beforeFirst();
                    return newRs;
                } catch (SQLException ex) {
                    throw new RuntimeException(ex);
                }
            }
            return argument;
        }
    }

    static class LimitResultSet implements DocumentFactoryBuilder.Navigate {
        @Override
        public Object navigate(Object parent, Object value, String member, String metadata) {
            //check if plugin is applicable
            if (value instanceof ResultSet == false || !metadata.startsWith("limit(")) return value;
            int limit = Integer.parseInt(metadata.substring(6, metadata.length() - 1));
            ResultSet rs = (ResultSet) value;
            MockResultSet dt = new MockResultSet("rs-copy");
            try {
                ResultSetMetaData rsmd = rs.getMetaData();
                int columns = rsmd.getColumnCount();
                for (int i = 1; i <= columns; i++) {
                    dt.addColumn(rsmd.getColumnName(i));
                }
                for (int i = 0; rs.next() && i < limit; i++) {
                    Object[] row = new Object[columns];
                    for (int j = 0; j < columns; j++) {
                        row[j] = rs.getObject(j + 1);
                    }
                    dt.addRow(row);
                }
                //since this is in memory and we are reusing it in plugins for the sake of example, let's just reposition
                rs.beforeFirst();
            } catch (SQLException ex) {
                throw new RuntimeException(ex);
            }
            //return different object which will be used further in the processing
            return dt;
        }
    }

    static class Limit10Table implements DocumentFactoryBuilder.Processor<ResultSet> {
        @Override
        public boolean tryProcess(String prefix, Templater templater, ResultSet resultSet) {
            try {
                ResultSetMetaData rsMD = resultSet.getMetaData();
                boolean hasMatchingTag = false;
                for (int i = 0; !hasMatchingTag && i < rsMD.getColumnCount(); i++) {
                    String tag = prefix + rsMD.getColumnName(i + 1);
                    //if any of the found tags matches limit10 condition
                    hasMatchingTag = Arrays.asList(templater.getMetadata(tag, true)).contains("limit10");
                }
                if (!hasMatchingTag) return false;
                resultSet.last();
                int rows = resultSet.getRow();
                resultSet.beforeFirst();
                if (rows > 10) {
                    //simplified way to match columns against tags
                    List<String> tags = new ArrayList<String>();
                    for (int i = 0; i < rsMD.getColumnCount(); i++) {
                        String tag = prefix + rsMD.getColumnName(i + 1);
                        tags.add(tag);
                    }
                    templater.resize(tags.toArray(new String[0]), 10);
                    for (int i = 0; i < 10; i++) {
                        resultSet.next();
                        for (int x = 0; x < rsMD.getColumnCount(); x++) {
                            templater.replace(prefix + rsMD.getColumnName(x + 1), resultSet.getObject(x + 1));
                        }
                    }
                    //since this is in memory and we are reusing it in plugins for the sake of example, let's just reposition
                    resultSet.beforeFirst();
                    return true;
                }
            } catch (SQLException ex) {
                throw new RuntimeException(ex);
            }
            return false;
        }
    }

    static class CollapseNonEmpty implements DocumentFactoryBuilder.Handler {
        @Override
        public Handled handle(Object value, String metadata, String tag, int position, Templater templater) {
            if (value instanceof ResultSet && ("collapseNonEmpty".equals(metadata) || "collapseEmpty".equals(metadata))) {
                ResultSet rs = (ResultSet) value;
                try {
                    boolean isEmpty = !rs.next();
                    //loop until all tags with the same name are processed
                    do {
                        List<String> md = Arrays.asList(templater.getMetadata(tag, false));
                        boolean collapseOnEmpty = md.contains("collapseEmpty");
                        boolean collapseNonEmpty = md.contains("collapseNonEmpty");
                        if (isEmpty) {
                            if (collapseOnEmpty) {
                                //when position is -1 it means non sharing tag is being used, in which case we can resize that region via "standard" API
                                //otherwise we need to use "advanced" resize API to specify which exact tag to replace
                                if (position == -1) {
                                    templater.resize(new String[]{tag}, 0);
                                } else {
                                    templater.resize(new Templater.TagPosition[] { new Templater.TagPosition(tag, position)}, 0);
                                }
                            } else {
                                //when position is -1 it means non sharing tag is being used, in which case we can just replace the first tag
                                //otherwise we can replace that exact tag via position API
                                if (position == -1) {
                                    templater.replace(tag, "");
                                } else {
                                    templater.replace(tag, position, "");
                                }
                            }
                        } else {
                            if (collapseNonEmpty) {
                                if (position == -1) {
                                    templater.resize(new String[]{tag}, 0);
                                } else {
                                    templater.resize(new Templater.TagPosition[] { new Templater.TagPosition(tag, position)}, 0);
                                }
                            } else {
                                if (position == -1) {
                                    templater.replace(tag, "");
                                } else {
                                    templater.replace(tag, position, "");
                                }
                            }
                        }
                    } while (Arrays.asList(templater.tags()).contains(tag));
                    return Handled.NESTED_TAGS;
                } catch (SQLException ex) {
                    throw new RuntimeException(ex);
                }
            }
            return Handled.NOTHING;
        }
    }
}
