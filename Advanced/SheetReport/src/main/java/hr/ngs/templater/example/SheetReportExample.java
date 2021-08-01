package hr.ngs.templater.example;

import hr.ngs.templater.Configuration;
import hr.ngs.templater.ITemplateDocument;
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

    private static String getValue(NodeList xml, String attribute) {
        for (int i = 0; i < xml.getLength(); i++) {
            Element item = (Element) xml.item(i);
            String value = item.getAttribute("name");
            if (attribute.equals(value)) return item.getTextContent();
        }
        return "";
    }

    private static InputData loadXml(DocumentBuilderFactory dbf) throws Exception {
        InputData result = new InputData();
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

    public static void main(final String[] args) throws Exception {
        DocumentBuilderFactory dbFactory  = DocumentBuilderFactory.newInstance();
        InputStream templateStream = SheetReportExample.class.getResourceAsStream("/Report.xlsx");
        File tmp = File.createTempFile("table", ".xlsx");

        FileOutputStream fos = new FileOutputStream(tmp);
        ITemplateDocument tpl = Configuration.factory().open(templateStream, "xlsx", fos);

        InputData data = loadXml(dbFactory);

        tpl.process(data);

        tpl.close();
        fos.close();
        Desktop.getDesktop().open(tmp);
    }

    static class InputData {
        public List<RawData> data = new ArrayList<RawData>();
        public List<CountryInfo> country = new ArrayList<CountryInfo>();
    }

    static class RawData {
        public String country;
        public String city;
        public int year;
        public long population;
    }

    static class CityData {
        public String name;
        public long population;
    }

    static class CountryInfo {
        public String name;
        //In this case, Tenplater doesn't cope with same tag twice, so let's put tag for the sheet into a separate tag
        //also, sheet name can't be longer than 31 characters
        public String sheetName() { return name.substring(0, Math.min(30, name.length())); }
        public List<CityData> city = new ArrayList<CityData>();
    }

}
