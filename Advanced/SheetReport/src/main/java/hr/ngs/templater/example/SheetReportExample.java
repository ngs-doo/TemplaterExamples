package hr.ngs.templater.example;

import hr.ngs.templater.Configuration;
import hr.ngs.templater.TemplateDocument;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.awt.Desktop;
import java.io.*;
import java.util.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

public class SheetReportExample {

    public static void main(final String[] args) throws Exception {
        DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
        InputStream templateStream = SheetReportExample.class.getResourceAsStream("/Report.xlsx");
        File tmp = File.createTempFile("table", ".xlsx");

        InputData data = loadXml(dbFactory);

        try (FileOutputStream fos = new FileOutputStream(tmp);
             TemplateDocument tpl = Configuration.factory().open(templateStream, "xlsx", fos)) {
            tpl.process(data);
        }
        Desktop.getDesktop().open(tmp);
    }

    private static String getValue(NodeList xml, String attribute) {
        for (int i = 0; i < xml.getLength(); i++) {
            Element item = (Element) xml.item(i);
            String value = item.getAttribute("name");
            if (attribute.equals(value)) return item.getTextContent();
        }
        return "";
    }

    private static InputData loadXml(DocumentBuilderFactory dbf) throws Exception {
        InputData result = new InputData(6);
        InputStream input = SheetReportExample.class.getResourceAsStream("/UNdata_Export.zip");
        ZipInputStream zip = new ZipInputStream(input);
        ZipEntry entry = zip.getNextEntry();
        int size = (int) entry.getSize();
        byte[] buffer = new byte[size];
        int len;
        int position = 0;
        while ((len = zip.read(buffer, position, size - position)) > 0) {
            position += len;
        }
        zip.close();
        input.close();
        DocumentBuilder db = dbf.newDocumentBuilder();
        Document doc = db.parse(new ByteArrayInputStream(buffer));
        Element root = doc.getDocumentElement();
        Element data = (Element)root.getElementsByTagName("data").item(0);
        NodeList records = data.getElementsByTagName("record");
        String lastCountry = "";
        CountryInfo country = new CountryInfo();
        Map<String, RawData> cities = new HashMap<String, RawData>();
        for (int i = 0; i < records.getLength(); i++) {
            NodeList fields = ((Element)records.item(i)).getElementsByTagName("field");
            RawData stats = new RawData();
            stats.country = getValue(fields, "Country or Area");
            stats.year = Integer.parseInt(getValue(fields, "Year"));
            stats.city = getValue(fields, "City");
            stats.population = (long)Double.parseDouble(getValue(fields, "Value"));
            result.data.add(stats);
            if (!lastCountry.equals(stats.country)) {
                boolean isFirst = lastCountry.length() == 0;
                country.name = lastCountry;
                lastCountry = stats.country;
                if (isFirst) continue;
                for(RawData rd : cities.values()) {
                    CityData cd = new CityData();
                    cd.name = rd.city;
                    cd.population = rd.population;
                    country.city.add(cd);
                }
                result.country.add(country);
                cities.clear();
                country = new CountryInfo();
                country.name = stats.country;
            }
            RawData last = cities.get(stats.city);
            if (last == null || last.year < stats.year) {
                cities.put(stats.city, stats);
            }
        }
        for(RawData rd : cities.values()) {
            CityData cd = new CityData();
            cd.name = rd.city;
            cd.population = rd.population;
            country.city.add(cd);
        }
        result.country.add(country);
        return result;
    }

    public static class InputData {
        public List<RawData> data = new ArrayList<>();
        public List<CountryInfo> country = new ArrayList<>();
        public String[][] cities;

        public InputData(int size) {
            cities = new String[1][];
            cities[0] = new String[size];
            for (int i = 0; i < size; i++) {
                cities[0][i] = ORDER[i] + " city";
            }
        }

        public Object[][] analysis() {
            int size = cities[0].length;
            Object[][] result = new Object[country.size()][size + 1];
            for (int i = 0; i < country.size(); i++) {
                CountryInfo c = country.get(i);
                CityData[] sorted = c.city.stream().sorted(Comparator.comparingLong(it -> -it.population)).toArray(CityData[]::new);
                result[i][0] = c.name;
                for (int j = 1; j <= size && j <= sorted.length; j++) {
                    result[i][j] = sorted[j - 1].population;
                }
            }
            return result;
        }
    }
    private static String[] ORDER = {
            "Largest",
            "Second",
            "Third",
            "Fourth",
            "Fifth",
            "Sixth",
            "Seventh",
    };

    public static class RawData {
        public String country;
        public String city;
        public int year;
        public long population;
    }

    public static class CityData {
        public String name;
        public long population;
    }

    public static class CountryInfo {
        public String name;
        //In this case, Templater doesn't cope with same tag twice, so let's put tag for the sheet into a separate tag
        //also, sheet name can't be longer than 31 characters
        public String sheetName() { return name.substring(0, Math.min(30, name.length())); }
        public List<CityData> city = new ArrayList<>();
    }

}
