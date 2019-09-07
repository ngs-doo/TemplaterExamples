package hr.ngs.templater.example;

import hr.ngs.templater.*;

import java.awt.Desktop;
import java.io.*;
import java.math.BigDecimal;
import java.util.*;

public class PresentationTablesExample {

    public static class TableRow {
        public String colA;
        public int colB;
        public BigDecimal colC;
        public String colD;
    }

    public static void main(final String[] args) throws Exception {
        InputStream templateStream = PresentationTablesExample.class.getResourceAsStream("/tables.pptx");
        File tmp = File.createTempFile("table", ".pptx");

        final List<TableRow> list = new ArrayList<TableRow>();
        for (int i = 0; i < 6; i++) {
            TableRow row = new TableRow();
            row.colA = "name " + i;
            row.colB = i * i * i + 505;
            row.colC = BigDecimal.valueOf(1000 + i * i, 2);
            row.colD = "last column " + i;
            list.add(row);
        }
        final String[][] array = new String[][]{
            {"Header 1", "Header2", "Header 3"},
            {"Row 1/1", "Row 1/2", "Row 1/3"},
            {"Second row 1", "Second row 2", "Second row 3"},
            {"Last row 1", "Last row 2", "Last row 3"},
        };
        FileOutputStream fos = new FileOutputStream(tmp);
        ITemplateDocument tpl = Configuration.factory().open(templateStream, "pptx", fos);
        tpl.process(new Object() {
            public final String title = "Tables";
            public final String subtitle = "Working with";
            public final List<TableRow> table1 = list;
            public final String[][] table2 = array;
        });
        tpl.flush();
        fos.close();
        Desktop.getDesktop().open(tmp);
    }
}
