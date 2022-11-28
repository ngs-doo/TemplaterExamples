package hr.ngs.templater.example;

import com.ibm.icu.text.NumberFormat;
import com.ibm.icu.text.RuleBasedNumberFormat;
import com.ibm.icu.util.ULocale;
import hr.ngs.templater.*;
import hr.ngs.templater.Templater.TagPosition;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.awt.*;
import java.io.*;
import java.math.BigDecimal;
import java.nio.charset.Charset;
import java.util.*;
import java.util.List;

public class CollapseExample {

    private static boolean contains(String[] input, String target) {
        for (String it : input) {
            if (it.equals(target)) return true;
        }
        return false;
    }

    public static void main(final String[] args) throws Exception {
        DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
        File tmp = File.createTempFile("collapse", ".docx");
        Application application1 =
                new Application()
                        .setPaybackYears(20)
                        .setUcCheck(true).setUcCheckResponse("Ok")
                        .setApplicant(new Applicant("first applicant").setFrom("Google", 2012, 11).addChild("Mary"));
        application1.getLoans().add(new Loan("Big Bank", BigDecimal.valueOf(10000), Color.BLUE));
        application1.getLoans().add(new Loan("Small Bank", BigDecimal.valueOf(2000), Color.GREEN));
        Application application2 =
                new Application().hideLoans()
                        .setPaybackYears(15)
                        .setUcCheck(false)
                        .setUcCheckResponse("Not good enough")
                        .setApplicant(new Applicant("second applicant").setFrom("Apple", 2015, 12))
                        .setCoApplicant(new Applicant("second co-applicant").setFromUntil("IBM", 2014, 11, 2015, 12));
        Application application3 =
                new Application()
                        .setPaybackYears(10)
                        .setUcCheck(true).setUcCheckResponse("Ok")
                        .setApplicant(
                                new Applicant("third applicant").setFrom("Microsoft", 2010, 1)
                                .addChild("Jack").addChild("Jane")
                        );
        InputStream templateStream = CollapseExample.class.getResourceAsStream("/Collapse.docx");
        FileOutputStream fos = new FileOutputStream(tmp);
        final DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
        final Charset utf8 = Charset.forName("UTF-8");
        final NumberFormat formatter = new RuleBasedNumberFormat(ULocale.ENGLISH, RuleBasedNumberFormat.SPELLOUT);
        TemplateDocument tpl = Configuration.builder().include(new DocumentFactoryBuilder.Handler() {
            @Override
            public Handled handle(Object value, String metadata, String path, int position, Templater templater) {
                if (value instanceof String && metadata.startsWith("collapseIf(")) {
                    //Extract the matching expression
                    String expression = metadata.substring("collapseIf(".length(), metadata.length() - 1);
                    if (value.equals(expression)) {
                        //remove the context around the specific property
                        if (position == -1)
                            //when position is -1 it means non sharing tag is being used, in which case we can resize that region via "standard" API
                            templater.resize(new String[]{path}, 0);
                        else
                            //otherwise we need to use "advanced" resize API to specify which exact tag to replace
                            templater.resize(new TagPosition[] { new TagPosition(path, position)}, 0);
                        return Handled.NESTED_TAGS;
                    }
                }
                return Handled.NOTHING;
            }
        }).include(new DocumentFactoryBuilder.Handler() {
            @Override
            public Handled handle(Object value, String metadata, String tag, int position, Templater templater) {
                if (value instanceof List && ("collapseNonEmpty".equals(metadata) || "collapseEmpty".equals(metadata))) {
                    List list = (List) value;
                    //loop until all tags with the same name are processed
                    do {
                        String[] md = templater.getMetadata(tag, false);
                        boolean collapseOnEmpty = contains(md, "collapseEmpty");
                        boolean collapseNonEmpty = contains(md, "collapseNonEmpty");
                        if (list.isEmpty()) {
                            if (collapseOnEmpty) {
                                //when position is -1 it means non sharing tag is being used, in which case we can resize that region via "standard" API
                                //otherwise we need to use "advanced" resize API to specify which exact tag to replace
                                if (position == -1) {
                                    templater.resize(new String[]{tag}, 0);
                                } else {
                                    templater.resize(new TagPosition[]{new TagPosition(tag, position)}, 0);
                                }
                            } else {
                                //when position is -1 it means non sharing tag is being used, in which case we can just replace the first tag
                                //otherwise we can replace that exact tag via position API
                                //replacing the first tag is the same as calling replace(tag, 0, value)
                                if (position == -1) {
                                    templater.replace(tag, "");
                                } else {
                                    templater.replace(tag, position, "");
                                }
                            }
                        } else {
                            if (collapseNonEmpty) {
                                if (position == -1) {
                                    templater.resize(new String[]{tag}, 0);
                                } else {
                                    templater.resize(new TagPosition[]{new TagPosition(tag, position)}, 0);
                                }
                            } else {
                                if (position == -1) {
                                    templater.replace(tag, "");
                                } else {
                                    templater.replace(tag, position, "");
                                }
                            }
                        }
                    } while (contains(templater.tags(), tag));
                    //we want to stop further processing if list is empty
                    //otherwise we want to continue resizing list and processing it's elements
                    return list.isEmpty() ? Handled.NESTED_TAGS : Handled.NOTHING;
                }
                return Handled.NOTHING;
            }
        }).include(new DocumentFactoryBuilder.LowLevelReplacer() {
            @Override
            public Object replace(Object value, String tag, String[] metadata) {
                if (value instanceof Color) {
                    String fillValue = Integer.toHexString(((Color) value).getRGB()).substring(2);
                    String xml = "<w:tc xmlns:w=\"http://schemas.openxmlformats.org/wordprocessingml/2006/main\"><w:tcPr>\n" +
                            "<w:shd w:val=\"clear\" w:color=\"auto\" w:fill=\"" + fillValue + "\" />\n" +
                            "</w:tcPr></w:tc>";
                    try {
                        return dBuilder.parse(new ByteArrayInputStream(xml.getBytes(utf8))).getDocumentElement();
                    } catch (Exception e) {
                        return value;
                    }
                }
                return value;
            }
        }).include(new DocumentFactoryBuilder.Handler() {
            @Override
            public Handled handle(Object value, String metadata, String tag, int position, Templater templater) {
                if ("leaveIfEmpty".equals(metadata) && value instanceof List) {
                    List list = (List)value;
                    if (list.isEmpty()) {
                        //when list is empty we want to leave the default message
                        templater.replace(tag, "");
                    } else {
                        //when list is not empty, we will remove the default message
                        templater.resize(new String[]{ tag }, 0);
                    }
                    //indicates that only this tag was handled,
                    //so Templater will either duplicate or remove other tags from this collection
                    return Handled.THIS_TAG;
                }
                return Handled.NOTHING;
            }
        }).include(new DocumentFactoryBuilder.Formatter() {
            @Override
            public Object format(Object value, String metadata) {
                if ("verbalize".equals(metadata) && value instanceof BigDecimal) {
                    BigDecimal bd = (BigDecimal)value;
                    return formatter.format(bd);
                }
                return value;
            }
        }).build().open(templateStream, "docx", fos);
        //manually invoke resize 0 on a tag. ideally this would be some boolean flag/empty collection
        tpl.templater().resize(new String[] { "remove_me" }, 0);
        tpl.process(Arrays.asList(application1, application2, application3));
        tpl.close();
        fos.close();
        Desktop.getDesktop().open(tmp);
    }
}
