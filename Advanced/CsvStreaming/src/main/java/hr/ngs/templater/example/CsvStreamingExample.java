package hr.ngs.templater.example;

import hr.ngs.templater.Configuration;
import hr.ngs.templater.IDocumentFactoryBuilder;
import hr.ngs.templater.ITemplateDocument;

import java.awt.Desktop;
import java.io.*;
import java.math.BigDecimal;
import java.sql.*;
import java.text.DecimalFormatSymbols;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Locale;
import java.util.zip.*;

public class CsvStreamingExample {

    static class Quoter implements IDocumentFactoryBuilder.ILowLevelReplacer {

        @Override
        public Object replace(Object value) {
            if (value != null) {
                String str = value.toString();
                int ind1 = str.indexOf(',');
                int ind2 = str.indexOf('"');
                if (ind1 != -1 && ind2 == -1) return "\"" + str + "\"";
                if (ind2 != -1) return "\"" + str.replace("\"", "\"\"") + "\"";
            }
            return value;
        }
    }
    static class NumberAsComma implements IDocumentFactoryBuilder.ILowLevelReplacer {

        @Override
        public Object replace(Object value) {
            if (value instanceof BigDecimal) {
                BigDecimal bd = (BigDecimal)value;
                return bd.toString().replace('.', ',');
            }
            return value;
        }
    }

    //it is important that class has public accessibility for performance reasons
    public static class StreamingRow {
        public int id;
        public BigDecimal amount;
        public Date date;
        public String createdBy;
        public Timestamp createdOn;
        public String note;
        public String status;
        public String reference;
        public String branch;
        public String verifiedBy;
        public Timestamp verifiedOn;

		public StreamingRow(ResultSet rs) throws SQLException {
            id = rs.getInt(1);
            amount = rs.getBigDecimal(2);
            date = rs.getDate(3);
            createdBy = rs.getString(4);
            createdOn = rs.getTimestamp(5);
            note = rs.getString(6);
            status = rs.getString(7);
            reference = rs.getString(8);
            branch = rs.getString(9);
            verifiedBy = rs.getString(10);
            verifiedOn = rs.getTimestamp(11);
        }
    }

    public static void main(final String[] args) throws Exception {
        InputStream templateStream = CsvStreamingExample.class.getResourceAsStream("/input.csv");
        File tmp = File.createTempFile("output", ".zip");

        Class.forName("org.hsqldb.jdbcDriver");
        Connection conn = DriverManager.getConnection("jdbc:hsqldb:mem:data/export", "sa", "");
        conn.createStatement().execute(
                "create table data(" +
                        "id integer NOT NULL, " +
                        "amount decimal not null, " +
                        "date date not null, " +
                        "created_by varchar(100), " +
                        "created_on timestamp, " +
                        "note varchar(1000), " +
                        "status varchar(10), " +
                        "reference varchar(20), " +
                        "branch varchar(20), " +
                        "verified_by varchar(100), " +
                        "verified_on timestamp)");

        String[] users = new String[] { null, "", "rick", "marty", "suzane", "eric", "mick", "admin" };
        String[] notes = new String[] { null, null, "-", "...", "IMPORTANT", "REMINDER", "something to look \"into later", "special\" char," };
        String[] stats = new String[] { "", "APPROVED", "", "APPROVED", "", "APPROVED", "VERIFIED", "CANCELED" };
        LocalDate startDate = LocalDate.now().minusDays(1000);
        OffsetDateTime startTimestamp = OffsetDateTime.now().minusDays(1000);
        PreparedStatement ins = conn.prepareStatement("INSERT INTO data VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        ZoneOffset defaultOffset = OffsetDateTime.now().getOffset();
        for (int i = 0; i < 200000; i++) {
            ins.setInt(1, 1000000 + i);
            ins.setBigDecimal(2, BigDecimal.valueOf((2000 + i % 5000) * 0.13));
            ins.setDate(3, new java.sql.Date(startDate.plusDays(i / 1000).atStartOfDay().toInstant(defaultOffset).toEpochMilli()));
            ins.setString(4, users[i % users.length]);
            ins.setTimestamp(5, new java.sql.Timestamp(startTimestamp.plusHours(i / 1000).toInstant().toEpochMilli()));
            ins.setString(6, notes[i % notes.length]);
            ins.setString(7, stats[i % stats.length]);
            ins.setString(8, "reference" + i);
            ins.setString(9, "branch" + i % 100);
            ins.setString(10, users[(i + 4) % users.length]);
            ins.setTimestamp(11, new java.sql.Timestamp(startTimestamp.plusMinutes(i / 1000).toInstant().toEpochMilli()));
            ins.execute();
        }
        ResultSet rs = conn.createStatement().executeQuery("SELECT * FROM data");
        IDocumentFactoryBuilder config = Configuration.builder().include(new Quoter());
        DecimalFormatSymbols dfs = new DecimalFormatSymbols(Locale.getDefault());
        //if we are using a culture which has comma as decimal separator, change the output to dot
        //we could apply this always, but it adds a bit of overhead, so let's apply it conditionally
        if (dfs.getDecimalSeparator() == ',') {
            config.include(new NumberAsComma());
        }
        //we can stream directly into a zipped stream/file
        ZipOutputStream zos = new ZipOutputStream(new FileOutputStream(tmp));
        zos.putNextEntry(new ZipEntry("output.csv"));
        ITemplateDocument doc = config.build().open(templateStream, "csv", zos);
        //streaming processing assumes we have only a single collection, which means we first need to process all other tags
        doc.process(new Object() { public Object filter = new Object() { public String date = "All"; public String user = "All"; }; });
        //to do a streaming processing we need to process collection in chunks
        ArrayList<StreamingRow> chunk = new ArrayList<>(50000);
        boolean hasData = rs.next();
        while (hasData) {
            //one way of doing streaming is first duplicating the template row (context)
            doc.templater().resize(doc.templater().tags(), 2);
            //and then process that row with all known data
            //this way we will have additional row to process (or remove) later
            do {
                chunk.add(new StreamingRow(rs));
                hasData = rs.next();
            } while (chunk.size() < 50000 && hasData);
            doc.process(new Object() { public ArrayList<StreamingRow> data = chunk; });
            chunk.clear();
        }
        //remove remaining rows
        doc.templater().resize(doc.templater().tags(), 0);
        doc.flush();
        conn.close();
        zos.closeEntry();
        zos.close();
        Desktop.getDesktop().open(tmp);
    }
}
