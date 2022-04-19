package hr.ngs.templater.example;

import hr.ngs.templater.Configuration;
import hr.ngs.templater.TemplateDocument;

import java.io.*;
import java.time.LocalDate;

public class SimpleExcelExample {

    static class MyClass {
        public String Name = "Marry";
        public Date BirthDay = new Date( 2005, 10, 10);
        public Date Today = new Date(LocalDate.now());
    }

    static class Date {
        public final int Year, Month, Day;
        public Date(LocalDate date) {
            Year = date.getYear();
            Month = date.getMonthValue();
            Day = date.getDayOfMonth();
        }
        public Date(int year, int month, int day) {
            this.Year = year;
            this.Month = month;
            this.Day = day;
        }
    }

    public static void main(final String[] args) throws Exception {
        InputStream templateStream = SimpleExcelExample.class.getResourceAsStream("/MySpreadsheet.xlsx");
        File tmp = File.createTempFile("simple-excel", ".xlsx");

        MyClass data = new MyClass();

        try (FileOutputStream fos = new FileOutputStream(tmp);
             TemplateDocument tpl = Configuration.factory().open(templateStream, "xlsx", fos)) {
            tpl.process(data);
        }
        java.awt.Desktop.getDesktop().open(tmp);
    }

}
