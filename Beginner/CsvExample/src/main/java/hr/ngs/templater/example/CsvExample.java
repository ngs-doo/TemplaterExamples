package hr.ngs.templater.example;

import hr.ngs.templater.Configuration;
import hr.ngs.templater.DocumentFactoryBuilder;
import hr.ngs.templater.TemplateDocument;
import org.threeten.bp.LocalDate;
import org.threeten.bp.OffsetDateTime;
import org.threeten.bp.ZoneOffset;

import java.awt.Desktop;
import java.io.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class CsvExample {

    static class Quoter implements DocumentFactoryBuilder.Formatter {

        @Override
        public Object format(Object value, String metadata) {
            if (metadata.equals("quote") && value != null) {
                String str = value.toString();
                int ind = str.indexOf(';');
                if (ind != -1) return "\"" + str + "\"";
            }
            return value;
        }
    }

    public static void main(final String[] args) throws Exception {
        InputStream templateStream = CsvExample.class.getResourceAsStream("/export.csv");
        File tmp = File.createTempFile("export", ".csv");

        Class.forName("org.hsqldb.jdbcDriver");
        Connection conn = DriverManager.getConnection("jdbc:hsqldb:mem:data/export", "sa", "");
        conn.createStatement().execute(
                "create table data(" +
                        "id integer NOT NULL, " +
                        "amount int not null, " +
                        "date date not null, " +
                        "created_by varchar(100), " +
                        "created_on timestamp, " +
                        "note varchar(1000), " +
                        "status varchar(10), " +
                        "reference varchar(20), " +
                        "branch varchar(20), " +
                        "verified_by varchar(100), " +
                        "verified_on timestamp, " +
                        "rolling_sum bigint, " +
                        "not_used varchar(10))");

        String[] users = new String[]{null, "", "rick", "marty", "suzane", "eric", "mick", "admin"};
        String[] notes = new String[]{null, null, "-", "...", "IMPORTANT", "REMINDER", "something to look into later", "special char;"};
        String[] stats = new String[]{"", "APPROVED", "", "APPROVED", "", "APPROVED", "VERIFIED", "CANCELED"};
        LocalDate startDate = LocalDate.now().minusDays(1000);
        OffsetDateTime startTimestamp = OffsetDateTime.now().minusDays(1000);
        PreparedStatement ins = conn.prepareStatement("INSERT INTO data VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, null)");
        long total = 0;
        ZoneOffset defaultOffset = OffsetDateTime.now().getOffset();
        for (int i = 0; i < 100000; i++) {
            total += 2000 + i % 5000;
            ins.setInt(1, 1000000 + i);
            ins.setInt(2, 2000 + i % 5000);
            ins.setDate(3, new java.sql.Date(startDate.plusDays(i / 1000).atStartOfDay().toInstant(defaultOffset).toEpochMilli()));
            ins.setString(4, users[i % users.length]);
            ins.setTimestamp(5, new java.sql.Timestamp(startTimestamp.plusDays(i / 1000).toInstant().toEpochMilli()));
            ins.setString(6, notes[i % notes.length]);
            ins.setString(7, stats[i % stats.length]);
            ins.setString(8, "reference" + i);
            ins.setString(9, "branch" + i % 100);
            ins.setString(10, users[(i + 4) % users.length]);
            ins.setTimestamp(11, new java.sql.Timestamp(startTimestamp.plusDays(i / 1000).toInstant().toEpochMilli()));
            ins.setLong(12, total);
            ins.execute();
        }
        ResultSet table = conn.createStatement().executeQuery("SELECT * FROM data");
        try (FileOutputStream fos = new FileOutputStream(tmp);
             TemplateDocument tpl = Configuration.builder().include(new Quoter()).build().open(templateStream, "csv", fos)) {
            tpl.process(table);
        }
        conn.close();
        Desktop.getDesktop().open(tmp);
    }
}
