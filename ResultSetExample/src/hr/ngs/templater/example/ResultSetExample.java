package hr.ngs.templater.example;

import hr.ngs.templater.Configuration;
import hr.ngs.templater.ITemplateDocument;

import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

public class ResultSetExample {

  public static void main(String[] args) {
    String templatePath = "MyCoffeeTable.xlsx";
    String outputPath   = "MyCoffeeTableResult.xlsx";

    InputStream inputTemplateStream;
    try {
      inputTemplateStream = new FileInputStream(templatePath);

    ByteArrayOutputStream bAOS = new ByteArrayOutputStream();
    ITemplateDocument tpl =
      Configuration.factory().open(inputTemplateStream, "xlsx", bAOS);




    Coffee myCoffee = (new CoffeeData()).getResultSet();

    Long startTime = System.currentTimeMillis();
    System.out.println("Start processing");

    tpl.process(myCoffee);
    Long endTime = System.currentTimeMillis();
    System.out.println("Finished in " + (endTime - startTime) + "ms");

    tpl.flush();
    byte[] result = bAOS.toByteArray();

    FileOutputStream fOS;
    fOS = new FileOutputStream(outputPath);
    fOS.write(result);

    } catch (FileNotFoundException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    } catch (IOException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

}
