package hr.ngs.templater.example;



import hr.ngs.templater.Configuration;
import hr.ngs.templater.ITemplateDocument;

import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.FileOutputStream;
import java.io.InputStream;

public class DynamicResize {

  public static void main(String[] args)
  {
    final String templatePath = "GroceryList.docx";
    String outputPath   = "GroceryListResult.docx";

    try {
      final InputStream inputTemplateStream = new FileInputStream(templatePath);

      final String[][] myArr = new String[4][3];
      myArr[0][0] = "Apples";
      myArr[0][1] = "Milk";
      myArr[0][2] = "Bread";

      myArr[1][0] = "Golden apple";
      myArr[1][1] = "Dukat";
      myArr[1][2] = "Black bread";

      myArr[2][0] = "Granny smith";
      myArr[2][1] = "Omega 3";
      myArr[2][2] = "Alpine";

      myArr[3][0] = "Red GMO";
      myArr[3][1] = "Cow";
      myArr[3][2] = "French bread";

      final ByteArrayOutputStream bAOS = new ByteArrayOutputStream();
      final ITemplateDocument tpl =
        Configuration.factory().open(inputTemplateStream, "docx", bAOS);

      tpl.templater().replace("myArr", myArr);
      tpl.flush();
      final byte[] result = bAOS.toByteArray();

      final FileOutputStream fOS;
      fOS = new FileOutputStream(outputPath);
      fOS.write(result);
    }
    catch (final FileNotFoundException e) {
      e.printStackTrace();
    }
    catch (final IOException e){
      e.printStackTrace();
    }
  }
}
