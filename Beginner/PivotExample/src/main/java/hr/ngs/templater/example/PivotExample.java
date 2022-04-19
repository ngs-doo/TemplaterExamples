package hr.ngs.templater.example;

import hr.ngs.templater.Configuration;
import hr.ngs.templater.TemplateDocument;

import java.awt.*;
import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class PivotExample {
    public static void main(final String[] args) throws Exception {
        InputStream templateStream = PivotExample.class.getResourceAsStream("/Pivot.xlsx");
        File tmp = File.createTempFile("pivot", ".xlsx");

        List<Map<String, Object>> data = new ArrayList<Map<String, Object>>();
        data.add(createItem("Tokyo", "Japan", 35.83, 1479));
        data.add(createItem("New York", "USA", 19.18, 1406));
        data.add(createItem("Los Angeles", "USA", 218.85, 792));
        data.add(createItem("Chicago", "USA", 425.6, 574));
        data.add(createItem("London", "England", 217.63, 565));
        data.add(createItem("Paris", "France", 338.48, 564));
        data.add(createItem("Osaka/Kobe", "Japan", 116.28, 417));
        data.add(createItem("Mexico City", "Mexico", 19.18, 390));
        data.add(createItem("Philadelphia", "USA", 198.45, 388));
        data.add(createItem("Sao Paulo", "Brasil", 426.32, 388));
        data.add(createItem("Washington DC", "USA", 139.71, 375));
        data.add(createItem("Boston", "USA", 187.19, 363));
        data.add(createItem("Buenos Aires", "Argentina", 332.08, 362));
        data.add(createItem("Dallas/Fort Worth", "USA", 315.03, 338));
        data.add(createItem("Moscow", "Russia", 174.41, 321));
        data.add(createItem("Hong Kong", "China", 469.35, 320));
        data.add(createItem("Atlanta", "USA", 212.76, 304));
        data.add(createItem("San Francisco/Oakland", "USA", 175.93, 301));
        data.add(createItem("Houston", "USA", 190.85, 297));
        data.add(createItem("Miami", "USA", 238.63, 292));
        data.add(createItem("Seoul", "South Korea", 287.34, 291));
        data.add(createItem("Toronto", "USA", 472.39, 253));
        data.add(createItem("Detroit", "USA", 413.65, 253));
        data.add(createItem("Seattle", "USA", 426.77, 235));
        data.add(createItem("Shanghai", "China", 15.24, 233));
        data.add(createItem("Madrid", "Spain", 234.98, 230));
        data.add(createItem("Singapore", "Malaysia", 179.89, 215));
        data.add(createItem("Sydney", "Australia", 132.41, 213));
        data.add(createItem("Mumbai (Bombay)", "India", 19.35, 209));
        data.add(createItem("Rio de Janeiro", "Brasil", 328.13, 201));

        try (FileOutputStream fos = new FileOutputStream(tmp);
             TemplateDocument tpl = Configuration.factory().open(templateStream, "xlsx", fos)) {
            tpl.process(data);
        }
        Desktop.getDesktop().open(tmp);
    }

    private static Map<String, Object> createItem(String town, String country, double population, int gdp) {
        Map<String, Object> result = new HashMap<String, Object>();
        result.put("town", town);
        result.put("country", country);
        result.put("population", population);
        result.put("gdp", gdp);
        return result;
    }
}
