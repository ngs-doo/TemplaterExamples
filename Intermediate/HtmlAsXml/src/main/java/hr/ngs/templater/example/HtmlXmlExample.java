package hr.ngs.templater.example;

import hr.ngs.templater.Configuration;
import hr.ngs.templater.TemplateDocument;
import org.jsoup.Jsoup;
import org.jsoup.parser.Parser;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;

public class HtmlXmlExample {

    public static void main(final String[] args) throws Exception {

        InputStream htmlTemplate = HtmlXmlExample.class.getResourceAsStream("/document.html");
        File tmp = File.createTempFile("tmp", ".html");
        org.jsoup.nodes.Document doc = Jsoup.parse(htmlTemplate, "UTF-8", "", Parser.xmlParser());
        byte[] html = doc.outerHtml().getBytes(StandardCharsets.UTF_8);
        ByteArrayInputStream is = new ByteArrayInputStream(html);

        Map<String, Object> map = new LinkedHashMap<>();
        Map<String, Object> customer = new HashMap<>();
        map.put("title", "HTML generated from Templater");
        map.put("invoice.number", "123456");
        map.put("invoice.created", "Yesterday");
        map.put("invoice.due", "Tomorrow");
        map.put("customer", customer);
        customer.put("name", "John Doe");
        customer.put("address", "Zagreb, Croatia");
        customer.put("email", "john.doe@example.com");
        map.put("payment", new HashMap() {{
            put("method", "Cash");
            put("description", "Amount");
            put("details", "EUR 1000");
        }});
        map.put("invoice.total", "8997");
        map.put("items", Arrays.asList(
                new HashMap() {{ put("description", "Reporting"); put("amount", "999"); }},
                new HashMap() {{ put("description", "Enterprise"); put("amount", "2999"); }},
                new HashMap() {{ put("description", "Jumpstart"); put("amount", "4999"); }}
        ));

        try (FileOutputStream fos = new FileOutputStream(tmp);
             TemplateDocument tpl = Configuration.builder()
                     .build().open(is, "xml", fos)) {
            tpl.process(map);
        }
        java.awt.Desktop.getDesktop().open(tmp);
    }
}
