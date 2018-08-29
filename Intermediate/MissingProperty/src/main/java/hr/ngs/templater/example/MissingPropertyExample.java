package hr.ngs.templater.example;

import hr.ngs.templater.*;

import java.awt.*;
import java.io.*;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Optional;

public class MissingPropertyExample {

    public static void main(final String[] args) throws Exception {
        InputStream templateStream = MissingPropertyExample.class.getResourceAsStream("/dynamic.docx");
        File tmp = File.createTempFile("dynamic", ".docx");

        HashMap<String, Object> dictionary = new HashMap<>();
        dictionary.put("provided", "something");
        dictionary.put("null", null);

        FileOutputStream fos = new FileOutputStream(tmp);
        ITemplateDocument doc = Configuration.factory().open(templateStream, "docx", fos);
        doc.process(dictionary);
        removeTagsWithMissing(doc.templater());
        doc.flush();
        fos.close();
        Desktop.getDesktop().open(tmp);
    }

    private static void removeTagsWithMissing(ITemplater templater) {
        for(String tag : templater.tags()) {
            int i = 0;
            String[] md;
            //metadata will return null when a tag does not exist at that index
            while ((md = templater.getMetadata(tag, i)) != null) {
                Optional<String> missing = Arrays.stream(md).filter(it -> it.startsWith("missing(")).findFirst();
                if (missing.isPresent()) {
                    String description = missing.get().substring(8, missing.get().length() - 1);
                    //Replace tag at specific index, not just the first tag
                    templater.replace(tag, i, description);
                } else i++;
            }
        }
    }
}
