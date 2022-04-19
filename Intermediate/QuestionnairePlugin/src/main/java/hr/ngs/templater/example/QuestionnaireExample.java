package hr.ngs.templater.example;

import hr.ngs.templater.Configuration;
import hr.ngs.templater.DocumentFactoryBuilder;
import hr.ngs.templater.TemplateDocument;
import hr.ngs.templater.Templater;

import java.awt.Desktop;
import java.io.*;
import java.text.SimpleDateFormat;
import java.util.*;

public class QuestionnaireExample {
    public static void main(final String[] args) throws Exception {
        InputStream templateStream = QuestionnaireExample.class.getResourceAsStream("/questions.docx");
        File tmp = File.createTempFile("questions", ".docx");

        Questionnaire quest = new Questionnaire();
        quest.title = "When to write a Templater plugin?";
        quest.add(
                "When should a formatting plugin be used?",
                "When a simple value conversion is required",
                "When a custom data type is required",
                "To improve performance",
                "It should never be used. All possible scenarios are already covered");
        quest.add(
                "When should a metadata plugin be used?",
                "To implement common features, such as region collapse",
                "When a custom data type is required",
                "To improve performance",
                "It should never be used. All possible scenarios are already covered");
        quest.add(
                "When should a processor plugin be used?",
                "When a custom data type is required",
                "When a simple value conversion is required",
                "To improve performance",
                "It should never be used. All possible scenarios are already covered");

        Map<String, Object> arguments = new HashMap<String, Object>();
        arguments.put("Date", new Date());
        arguments.put("Q", quest);
        arguments.put("Reason", "Example");
        arguments.put("Authors", new String[]{"Mark", "Jane", "Jack"});

        try (FileOutputStream fos = new FileOutputStream(tmp);
             TemplateDocument tpl =
                     Configuration.builder()
                             .include(Questionnaire.class, new QuestionnairePlugin())
                             .include(new FormatDate())
                             .include(new Letters())
                             .withMatcher("[\\w\\.]+")
                             .build().open(templateStream, "docx", fos)) {
            tpl.process(arguments);
        }
        Desktop.getDesktop().open(tmp);
    }

    static class Questionnaire {
        public String title;
        List<Question> questions = new ArrayList<Question>();

        public void add(String text, String answer, String... alternatives) {
            List<String> options = new ArrayList<String>();
            options.add(answer);
            options.addAll(Arrays.asList(alternatives));
            Collections.sort(options);
            questions.add(new Question(text, options, options.indexOf(answer)));
        }
    }

    static class Question {
        public final String text;
        public final List<String> options;
        public final int selectedOption;

        public Question(String text, List<String> options, int selectedOption) {
            this.text = text;
            this.options = options;
            this.selectedOption = selectedOption;
        }
    }

    static class FormatDate implements DocumentFactoryBuilder.Formatter {
        private final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd");

        @Override
        public Object format(Object value, String metadata) {
            if ("date".equals(metadata) && value instanceof Date) {
                return DATE_FORMAT.format((Date) value);
            }
            return value;
        }
    }

    static class Letters implements DocumentFactoryBuilder.Formatter {

        @Override
        public Object format(Object value, String metadata) {
            if (metadata.startsWith("letter(")) {
                if (value == null) return "";
                String str = value.toString();
                int index = Integer.parseInt(metadata.substring(7, metadata.length() - 1));
                if (index >= str.length() || index < 0) return "";
                return Character.toString(str.charAt(index)).toUpperCase();
            }
            return value;
        }
    }

    static class QuestionnairePlugin implements DocumentFactoryBuilder.Processor<Questionnaire> {
        @Override
        public boolean tryProcess(String prefix, Templater templater, Questionnaire q) {
            String[] tags = templater.tags();
            for (String t : tags) {
                if ((prefix + "title").equalsIgnoreCase(t))
                    while (templater.replace(t, q.title)) {
                        //replace all such tags
                    }
            }

            templater.resize(new String[]{prefix + "Text", prefix + "Question", prefix + "Answer"}, q.questions.size());

            for (Question ask : q.questions) {
                templater.replace(prefix + "Text", ask.text);
                templater.resize(new String[]{prefix + "Answer", prefix + "Question"}, ask.options.size());
                for (int i = 0; i < ask.options.size(); i++) {
                    if (ask.selectedOption == i) templater.replace(prefix + "Answer", "\u2611");
                    else templater.replace(prefix + "Answer", "\u2610");
                    templater.replace(prefix + "Question", ask.options.get(i));
                }
            }

            return true;
        }
    }
}
