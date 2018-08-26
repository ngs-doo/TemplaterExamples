package hr.ngs.templater.example;

import hr.ngs.templater.*;

import java.awt.Desktop;
import java.io.*;
import java.math.BigDecimal;
import java.nio.file.*;
import java.time.LocalDate;
import java.time.temporal.IsoFields;
import java.util.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;
import java.util.zip.ZipOutputStream;

public class PowerQueryExample {

    private static IDocumentFactory xlsxFactory = Configuration.builder()
            .include(new LocalDateToDate())
            //Excel will complain about corrupted file unless Templater is initialized with a valid license
            .build("Customer email", "Customer license");
    private static IDocumentFactory csvFactory = Configuration.builder()
            .build();//CSV does not require license file

    static class LocalDateToDate implements IDocumentFactoryBuilder.ILowLevelReplacer {

        @Override
        public Object replace(Object value) {
            //Templater does not understand java8 types so we can convert local date into legacy date
            if (value instanceof LocalDate) {
                return java.sql.Date.valueOf((LocalDate)value);
            }
            return value;
        }
    }

    //class should be public Templater to reduce the overhead of reflection access
    public static class CsvData {
        public LocalDate date;
        public String week;
        public String month;
        public String quarter;
        public int year;
        public LocalDate paymentDate;
        public int originalPrincipal;
        public String personID;
        public String operatorID;
        public String invoiceNumber;
        public LocalDate dueDate;
        public LocalDate invoiceDate;
        public LocalDate collectionDate;
        public BigDecimal invoiceFee;
        public BigDecimal interest;
        public BigDecimal reminderFee;
        public BigDecimal currentAmount;
    }

    public static class InputData {
        public CsvData[] csv;
        public CsvData[] sheet;
    }

    private static CsvData[] generateData(int size) {
        LocalDate startDate = LocalDate.of(2015, 2, 3);
        CsvData[] result = new CsvData[size];
        for(int i = 0; i < result.length; i++) {
            CsvData csv = new CsvData();
            csv.date = startDate.plusDays(i / 10);
            String yearOf = csv.date.getYear() + "/";
            csv.week = yearOf + csv.date.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
            csv.month = yearOf + csv.date.getMonthValue();
            csv.quarter = yearOf + csv.date.get(IsoFields.QUARTER_OF_YEAR);
            csv.year = csv.date.getYear();
            boolean isPaid = i % 7 != 0;
            csv.paymentDate = isPaid ? csv.date.plusDays(i%100) : null;
            csv.originalPrincipal = 1000 + 1000 * (i%100) + 10 * (i / 100);
            csv.personID = "PER-" + (i%100) + "-" + (i/1000);
            csv.operatorID = "OP-" + (i%10);
            csv.invoiceNumber = "INV-" + csv.year + "-" + (i + 1);
            csv.dueDate = csv.date.plusMonths(1);
            csv.invoiceDate = csv.date.plusDays(i%3);
            csv.collectionDate = isPaid ? (i%5 == 0 ? csv.date.plusDays(i%13) : null) : null;
            csv.invoiceFee = BigDecimal.valueOf(i%8 == 0 ? 0 : i%1000, 2);
            csv.interest = BigDecimal.valueOf(i%6 == 0 ? 0 : i%1000, 2);
            csv.reminderFee = BigDecimal.valueOf(i%5 == 0 ? 50 : 0);
            csv.currentAmount = BigDecimal.valueOf(csv.originalPrincipal).add(csv.interest).add(csv.reminderFee).add(csv.invoiceFee);
            result[i] = csv;
        }
        return result;
    }

    private static File updateCSV(File file, InputData data) throws IOException {
        //PowerQuery Zip function doesn't cope well with streaming ZIP, so let's convert it to zip without data descriptors
        File result = File.createTempFile("power", ".xlsx");
        ZipFile from = new ZipFile(file);
        byte[] buffer = new byte[4096];
        ZipOutputStream to = new ZipOutputStream(new FileOutputStream(result));
        for (Enumeration<? extends ZipEntry> entries = from.entries(); entries.hasMoreElements();) {
            ZipEntry entry = entries.nextElement();
            to.putNextEntry(entry);
            int size = (int)entry.getSize();
            InputStream is = from.getInputStream(entry);
            while (size > 0) {
                int len = is.read(buffer);
                size -= len;
                to.write(buffer, 0, len);
            }
            to.closeEntry();
        }
        to.close();
        //and let's update CSV within the ZIP with actual data
        try (FileSystem zipfs = FileSystems.newFileSystem(result.toPath(), null)) {
            Path csv = zipfs.getPath("/xl/embeddings/data.csv");
            try(InputStream is = new ByteArrayInputStream(Files.readAllBytes(csv));
                OutputStream os = Files.newOutputStream(csv, StandardOpenOption.CREATE)) {
                ITemplateDocument tpl = csvFactory.open(is, "csv", os);
                tpl.process(data);
                tpl.flush();
            }
        }
        file.delete();
        return result;
    }

    public static void main(final String[] args) throws Exception {
        File tmp = File.createTempFile("power", ".xlsx");
        InputData data = new InputData();
        data.csv = generateData(100000);
        data.sheet = generateData(25000);

        try(InputStream is = PowerQueryExample.class.getResourceAsStream("/PowerQuery.xlsx");
            OutputStream os = Files.newOutputStream(tmp.toPath())) {
            ITemplateDocument tpl = xlsxFactory.open(is, "xlsx", os);
            tpl.process(data);
            tpl.flush();
        }

        File result = updateCSV(tmp, data);

        Desktop.getDesktop().open(result);
    }
}
