package hr.ngs.templater.example;

import hr.ngs.templater.Configuration;
import hr.ngs.templater.DocumentFactory;
import hr.ngs.templater.DocumentFactoryBuilder;
import hr.ngs.templater.TemplateDocument;

import java.awt.Desktop;
import java.io.*;
import java.math.BigDecimal;
import java.sql.*;
import java.text.DecimalFormatSymbols;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Locale;
import java.util.zip.*;

public class StreamingExample {

    static class Quoter implements DocumentFactoryBuilder.LowLevelReplacer {

        @Override
        public Object replace(Object value, String tag, String[] metadata) {
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
    static class NumberAsComma implements DocumentFactoryBuilder.LowLevelReplacer {

        @Override
        public Object replace(Object value, String tag, String[] metadata) {
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

        public static class RsIterator implements Iterator<StreamingRow> {
            private final ResultSet rs;
            private boolean hasNext;

            public RsIterator(ResultSet rs) throws SQLException {
                this.rs = rs;
                this.hasNext = rs.next();
            }

            @Override
            public boolean hasNext() {
                return hasNext;
            }

            @Override
            public StreamingRow next() {
                try {
                    StreamingRow row = new StreamingRow(rs);
                    hasNext = rs.next();
                    return row;
                } catch (SQLException e) {
                    throw new RuntimeException(e);
                }
            }
        }
    }

    public static void main(final String[] args) throws Exception {
        File tmp = File.createTempFile("output", ".zip");

        Class.forName("org.hsqldb.jdbcDriver");
        Connection conn = DriverManager.getConnection("jdbc:hsqldb:mem:data/export", "sa", "");
        conn.createStatement().execute(
                "create table csv_data(" +
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
        PreparedStatement ins = conn.prepareStatement("INSERT INTO csv_data VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
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
        ResultSet rs1 = conn.createStatement().executeQuery("SELECT * FROM csv_data");
        ResultSet rs2 = conn.createStatement().executeQuery("SELECT * FROM csv_data");
        ResultSet rs3 = conn.createStatement().executeQuery("SELECT * FROM csv_data");
        DocumentFactoryBuilder csvConfig = Configuration.builder().include(new Quoter());
        DocumentFactoryBuilder xmlConfig = Configuration.builder();
        DecimalFormatSymbols dfs = new DecimalFormatSymbols(Locale.getDefault());
        //if we are using a culture which has comma as decimal separator, change the output to dot
        //we could apply this always, but it adds a bit of overhead, so let's apply it conditionally
        if (dfs.getDecimalSeparator() == ',') {
            csvConfig.include(new NumberAsComma());
            xmlConfig.include(new NumberAsComma());
        }
        csvConfig.streaming(50000);//by default streaming is 16k, lets leave the default for xml
        DocumentFactory csvFactory = csvConfig.build();
        DocumentFactory xmlFactory = xmlConfig.build();
        //we can stream directly into a zipped stream/file
        ZipOutputStream zos = new ZipOutputStream(new FileOutputStream(tmp));
        zos.putNextEntry(new ZipEntry("manual.csv"));
        long start = System.currentTimeMillis();
        manualStreaming(rs1, csvFactory, zos);
        System.out.println("manual csv took: " + (System.currentTimeMillis() - start));
        zos.putNextEntry(new ZipEntry("automatic.csv"));
        start = System.currentTimeMillis();
        automaticStreaming(rs2, csvFactory, "csv", zos);
        System.out.println("automatic csv took: " + (System.currentTimeMillis() - start));
        zos.putNextEntry(new ZipEntry("data.xml"));
        start = System.currentTimeMillis();
        //by default XML will do many small operations so its much faster to wrap the stream with a buffer
        BufferedOutputStream bos = new BufferedOutputStream(zos);
        automaticStreaming(rs3, xmlFactory, "xml", bos);
        bos.flush();
        System.out.println("automatic xml took: " + (System.currentTimeMillis() - start));
        conn.close();
        zos.close();
        Desktop.getDesktop().open(tmp);
    }

    private static void manualStreaming(ResultSet rs, DocumentFactory factory, OutputStream os) throws SQLException {
        InputStream templateStream = StreamingExample.class.getResourceAsStream("/input.csv");
        try (TemplateDocument doc = factory.open(templateStream, "csv", os)) {
            //streaming processing assumes we have only a single collection, which means we first need to process all other tags
            doc.process(new Object() {
                public Object filter = new Object() {
                    public String date = "All";
                    public String user = "All";
                };
            });
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
                doc.process(new Object() {
                    public ArrayList<StreamingRow> data = chunk;
                });
                chunk.clear();
            }
            //remove remaining rows
            doc.templater().resize(doc.templater().tags(), 0);
        }
    }

    private static void automaticStreaming(ResultSet rs, DocumentFactory factory, String extension, OutputStream os) throws SQLException {
        InputStream templateStream = StreamingExample.class.getResourceAsStream("/input." + extension);
        try (TemplateDocument doc = factory.open(templateStream, extension, os)) {
            //we still want to make sure all non collection tags are processed first (or they are at the end of document)
            doc.process(new Object() {
                public Object filter = new Object() {
                    public String date = "All";
                    public String user = "All";
                };
            });
            //for streaming lets just pass iterator for processing
            doc.process(new Object() {
                public Iterator<StreamingRow> data = new StreamingRow.RsIterator(rs);
            });
        }
    }
}
