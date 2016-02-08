package hr.ngs.templater.example;

import hr.ngs.templater.Configuration;
import hr.ngs.templater.ITemplateDocument;

import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

public class TableExample {
    public static void main(final String[] args) {
        final String templatePath = "MyTable.xlsx";
        final String outputPath = "MyTableResult.xlsx";

        try {
            final InputStream inputTemplateStream = new FileInputStream(templatePath);
            final SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");

            final List<SpecialMenu> specialMenu = new ArrayList<SpecialMenu>();
            specialMenu.add(new SpecialMenu("Jelacic steak", "80 EUR", dateFormat.parse("16/05/2012")));
            specialMenu.add(new SpecialMenu("Sea surprise", "120 EUR", dateFormat.parse("18/05/2012")));

            final List<DailyMenu> dailyMenu = new ArrayList<DailyMenu>();
            dailyMenu.add(new DailyMenu("Chickago pizza", "Olives", "38 EUR"));
            dailyMenu.add(new DailyMenu("Cordon bleu", "French fries", "45 EUR"));
            dailyMenu.add(new DailyMenu("Beefsteak", "Salad, french fries", "65 EUR"));

            final Menu myTable = new Menu("Bon voyage", specialMenu, dailyMenu);

            final ByteArrayOutputStream baos = new ByteArrayOutputStream();
            final ITemplateDocument tpl = Configuration.factory().open(inputTemplateStream, "xlsx", baos);

            tpl.process(myTable);
            tpl.flush();
            final byte[] result = baos.toByteArray();

            final FileOutputStream fos = new FileOutputStream(outputPath);
            fos.write(result);
            fos.close();
        } catch (final FileNotFoundException e) {
            e.printStackTrace();
        } catch (final IOException e) {
            e.printStackTrace();
        } catch (final ParseException e) {
            e.printStackTrace();
        }
    }
}
