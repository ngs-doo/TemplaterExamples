package hr.ngs.templater.example;

import hr.ngs.templater.*;

import java.awt.*;
import java.io.*;
import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.concurrent.Callable;

public class ExcelContextRulesExample {

    static class Person {
        public String player;
        public Club[] club;
        public Person(String player, String... clubs) {
            this.player = player;
            this.club = new Club[clubs.length];
            for(int i = 0;i < clubs.length; i++) {
                this.club[i] = new Club(clubs[i]);
            }
        }
    }
    static class Club {
        public final String name;
        public Club(String name) {
            this.name = name;
        }
    }

    public static void main(final String[] args) throws Exception {
        InputStream templateStream = ExcelContextRulesExample.class.getResourceAsStream("/flattening.xlsx");
        File tmp = File.createTempFile("flat", ".xlsx");

        final Person[] data = new Person[] {
                new Person("Cristiano Ronaldo", "Real Madrid", "Manchester United"),
                new Person("Lionel Messi", "Barcelona"),
                new Person("Zlatan Ibrahimović", "Paris Saint-Germain", "Barcelona", "Inter Milan")
        };

        FileOutputStream fos = new FileOutputStream(tmp);
        ITemplateDocument tpl = Configuration.factory().open(templateStream, "xlsx", fos);
        tpl.process(new HashMap<String, Person[]>() {{ put("simple", data); put("tables", data); put("ranges", data); }});
        tpl.flush();
        fos.close();
        Desktop.getDesktop().open(tmp);
    }
}
