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

import org.joda.time.LocalDate;

public class ListExample {
  public static void main(String[] args)
  {
    String templatePath = "MyList.docx";
    String outputPath   = "MyListResult.docx";

    try {
      InputStream inputTemplateStream = new FileInputStream(templatePath);
      SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");


      List<MyBets> myList = new ArrayList<MyBets>();
      List<MyHorse> horses = new ArrayList<MyHorse>();
      horses.add(new MyHorse("Blizzard", 1.4500134f));
      horses.add(new MyHorse("Sandstorm", 1.5500134f));
      horses.add(new MyHorse("Earth", 1.2500134f));
      horses.add(new MyHorse("Cat", 2.4500134f));

      myList.add(new MyBets("Mirko", dateFormat.parse("11/05/2012"), new LocalDate("2012-05-12"), horses));

      ByteArrayOutputStream bAOS = new ByteArrayOutputStream();
      ITemplateDocument tpl =
        Configuration.factory().open(inputTemplateStream, "docx", bAOS);


      tpl.process(myList);
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
    }
    catch (ParseException e){
      e.printStackTrace();
    }
  }

}


