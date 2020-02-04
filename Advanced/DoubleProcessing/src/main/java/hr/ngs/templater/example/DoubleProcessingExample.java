package hr.ngs.templater.example;

import com.mockrunner.mock.jdbc.MockResultSet;
import hr.ngs.templater.Configuration;
import hr.ngs.templater.IDocumentFactory;
import hr.ngs.templater.ITemplateDocument;

import java.awt.Desktop;
import java.io.*;
import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.text.DateFormat;
import java.util.*;

public class DoubleProcessingExample {

    public static void main(final String[] args) throws Exception {
        InputStream templateStream = DoubleProcessingExample.class.getResourceAsStream("/ResizeWithNesting.xlsx");
        File tmp = File.createTempFile("double", ".xlsx");

        Random rnd = new Random();
        int totalPeople = rnd.nextInt(4) + 3;
        final Person[] person = new Person[totalPeople];
        for (int i = 0; i < person.length; i++)
            person[i] = new Person(rnd, i);

        ResultSet units = prepareStarcraftUnits();

        IDocumentFactory factory = Configuration.factory();
        ByteArrayOutputStream os = new ByteArrayOutputStream();
        //let's do a horizontal resize so document is prepared for second pass
        ITemplateDocument doc1 = factory.open(templateStream, "xlsx", os);
        //[[equals]] at the beginning of the cell causes conversion to formula
        //this is processed at the end of processing, but since this tag is newly introduced, it's processed at the second pass
        doc1.process(new HashMap<String, Object>() {{ put("Person", person); put("formula", "[[equals]]"); }});
        Set<String> columns = new HashSet<>();
        ResultSetMetaData rsMD = units.getMetaData();
        for (int i = 1; i <= rsMD.getColumnCount(); i++) {
            columns.add(rsMD.getColumnName(i));
        }
        String[] tags = doc1.templater().tags();
        for (String t : tags) {
            if (!t.startsWith("starcraft.")) continue;
            List<String> metadata = new ArrayList<>(Arrays.asList(doc1.templater().getMetadata(t, false)));
            if (!metadata.contains("horizontal-resize")) continue;//we are interested only in specific columns
            String colName = t.substring("starcraft.".length());
            if (columns.contains(colName)) {
                metadata.remove("horizontal-resize");
                String appendMetadata = metadata.size() == 0 ? "" : ":" + String.join(":", metadata);
                doc1.templater().replace(t, "[[" + t + "]" + appendMetadata + "]");//strip horizontal resize attribute
            } else {
                doc1.templater().resize(new String[] { t }, 0);//hide column from output
            }
        }
        doc1.flush();

        //now let's prepare our complex object for standard processing
        Map<String, Object> complex = buildComplexObject(totalPeople);

        ByteArrayInputStream is = new ByteArrayInputStream(os.toByteArray());
        FileOutputStream fos = new FileOutputStream(tmp);
        //let's do a second pass with our prepared object
        ITemplateDocument doc2 = factory.open(is, "xlsx", fos);
        doc2.process(complex);
        doc2.process(new HashMap<String, Object>() {{ put("starcraft", units); }});
        doc2.flush();
        fos.close();

        Desktop.getDesktop().open(tmp);
    }

    static class Person {
        public String AccountDescription;
        public String RegistrationNumber;
        public String ShortName;
        public String AccountNumber;
        public int RealizedGains;
        public int UnrealizedLosses;
        public int NetUnrealizedGains;
        public String Group;
        public String Item;
        public String Total;
        public Person(Random rnd, int i) {
            AccountDescription = "account " + i;
            RegistrationNumber = "reg " + i;
            ShortName = "name " + i;
            AccountNumber = "number " + i;
            RealizedGains = rnd.nextInt(10000 - 100) + 100;
            UnrealizedLosses = rnd.nextInt(10000 - 100) + 100;
            NetUnrealizedGains = rnd.nextInt(10000 - 100) + 100;
            Group = "[[Groups.Person" + i + "]]";
            Item = "[[Groups.Items.Person" + i + "]]";
            Total = "[[Total.Person" + i + "]]";
        }
    }

    static class Group extends HashMap<String, Object> {
        public Group(Random rnd, int cur, int people)
        {
            put("Name", "group " + cur);
            put("Description", "desc " + cur);
            put("TargetPercentage", BigDecimal.valueOf(rnd.nextDouble() * 10));
            put("RecommendedDollars", BigDecimal.valueOf(rnd.nextDouble() * 100));
            put("ToleranceDollars", BigDecimal.valueOf(rnd.nextDouble() * 100));
            for (int i = 0; i < people; i++)
                put("Person" + i, rnd.nextInt(10000 - 100) + 100);
            int subitems = rnd.nextInt(4) + 1;
            List<Map<String, Object>> items = new ArrayList<Map<String, Object>>();
            for (int i = 0; i < subitems; i++) {
                Map<String, Object> dict = new HashMap<String, Object>();
                items.add(dict);
                for (int j = 0; j < people; j++)
                    dict.put("Person" + j, rnd.nextInt(10000 - 10) + 10);
                dict.put("Name", "subitem " + i + " for " + cur);
                dict.put("TargetPercentage", BigDecimal.valueOf(rnd.nextDouble()));
                dict.put("RecommendedDollars", BigDecimal.valueOf(rnd.nextDouble() * 10));
                dict.put("ToleranceDollars", BigDecimal.valueOf(rnd.nextDouble() * 100));
            }
            put("Items", items);
        }
    }

    static Map<String, Object> buildComplexObject(int people) {
        Random rnd = new Random();
        int totalGroups = (rnd.nextInt(18) + 4) / 2;
        Map<String, Object> result = new HashMap<String, Object>();
        result.put("ReportHeader", "report header");
        //or it would be better to format cell in excel instead of using string
        DateFormat df = DateFormat.getDateInstance(DateFormat.DATE_FIELD);
        result.put("Date", df.format(new Date()));
        Group[] groups = new Group[totalGroups];
        result.put("Groups", groups);
        for (int i = 0; i < totalGroups; i++)
            groups[i] = new Group(rnd, i, people);
        Map<String, Object>[] totals = new HashMap[totalGroups / 2];
        result.put("Total", totals);
        for (int i = 0; i < totals.length; i++)
        {
            Map<String, Object> dict = totals[i] = new HashMap<String, Object>();
            dict.put("Name", "total " + i);
            dict.put("TargetPercentage", BigDecimal.valueOf(rnd.nextDouble() * 10));
            dict.put("RecommendedDollars", BigDecimal.valueOf(rnd.nextDouble() * 100));
            dict.put("ToleranceDollars", BigDecimal.valueOf(rnd.nextDouble() * 100));
            dict.put("Description", "desc " + i);
            for (int j = 0; j < people; j++)
            {
                int sum = 0;
                for(int x = i * 2; x < groups.length && x < i * 2 + 2; x++)
                    sum += (Integer)(groups[x].get("Person" + j));
                dict.put("Person" + j, sum);
            }
        }
        return result;
    }

    static ResultSet prepareStarcraftUnits() {
        MockResultSet dt = new MockResultSet("Starcraft");
        dt.addColumn("unit");
        dt.addColumn("size");
        //version not included so it's removed from the output
        dt.addColumn("minerals");
        dt.addColumn("gas");
        dt.addColumn("ground attack");
        dt.addColumn("air attack");
        //range not included so it's removed from the output
        dt.addColumn("build time");
        dt.addRow(Arrays.asList("Battlecruiser", "L", 400, 300, 25, 25, 160));
        dt.addRow(Arrays.asList("Dropship", "L", 100, 100, 0, 0, 50));
        dt.addRow(Arrays.asList("Firebat", "S", 50, 25, 16, 0, 24));
        dt.addRow(Arrays.asList("Ghost", "S", 25, 75, 10, 10, 50));
        dt.addRow(Arrays.asList("Marine", "S", 50, 0, 6, 6, 24));
        dt.addRow(Arrays.asList("Vulture", "M", 75, 0, 20, 0, 30));
        return dt;
    }
}
