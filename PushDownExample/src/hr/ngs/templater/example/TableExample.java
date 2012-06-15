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
  public static void main(String[] args)
  {
    String templatePath = "MyTable.xlsx";
    String outputPath   = "MyTableResult.xlsx";

    try {
      InputStream inputTemplateStream = new FileInputStream(templatePath);
      SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");

      List<SpecialMenu> specialMenu = new ArrayList<SpecialMenu>();
      specialMenu.add(new SpecialMenu("Jelacic steak", "80 EUR", dateFormat.parse("16/05/2012")));
      specialMenu.add(new SpecialMenu("Sea surprise", "120 EUR", dateFormat.parse("18/05/2012")));

      List<DailyMenu> dailyMenu = new ArrayList<DailyMenu>();
      dailyMenu.add(new DailyMenu("Chickago pizza", "Olives", "38 EUR"));
      dailyMenu.add(new DailyMenu("Cordon bleu", "French fries", "45 EUR"));
      dailyMenu.add(new DailyMenu("Beefsteak", "Salad, french fries", "65 EUR"));

      Menu myTable = new Menu("Bon voyage", specialMenu, dailyMenu);

      ByteArrayOutputStream bAOS = new ByteArrayOutputStream();
      ITemplateDocument tpl =
        Configuration.factory().open(inputTemplateStream, "xlsx", bAOS);


      tpl.process(myTable);
      tpl.flush();
      byte[] result = bAOS.toByteArray();

      FileOutputStream fOS;
      fOS = new FileOutputStream(outputPath);
      fOS.write(result);

    }
    catch (FileNotFoundException e) {
      e.printStackTrace();
    }
    catch (IOException e){
      e.printStackTrace();
    } catch (ParseException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    }
  }
}
