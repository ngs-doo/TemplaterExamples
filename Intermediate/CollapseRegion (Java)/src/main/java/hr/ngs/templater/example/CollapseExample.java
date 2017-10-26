package hr.ngs.templater.example;

import hr.ngs.templater.*;

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
		File tmp = File.createTempFile("collapse", ".docx");
		Application application1 =
				new Application()
						.setPaybackYears(20)
						.setUcCheck(true).setUcCheckResponse("Ok")
						.setApplicant(new Applicant("first applicant").setFrom("Google", 2012, 11));
		application1.getLoans().add(new Loan("Big Bank", BigDecimal.valueOf(10000), Color.BLUE));
		application1.getLoans().add(new Loan("Small Bank", BigDecimal.valueOf(2000), Color.GREEN));
		Application application2 =
				new Application()
						.setPaybackYears(15)
						.setUcCheck(false)
						.setUcCheckResponse("Not good enough")
						.setApplicant(new Applicant("second applicant").setFrom("Apple", 2015, 12))
						.setCoApplicant(new Applicant("second co-applicant").setFromUntil("IBM", 2014, 11, 2015, 12));
		InputStream templateStream = CollapseExample.class.getResourceAsStream("/Collapse.docx");
		FileOutputStream fos = new FileOutputStream(tmp);
		DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
		final DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
		final Charset utf8 = Charset.forName("UTF-8");
		ITemplateDocument tpl = Configuration.builder().include(new IDocumentFactoryBuilder.IHandler() {
			@Override
			public boolean handle(Object value, String metadata, String path, ITemplater templater) {
				if (value != null && value instanceof String && metadata.startsWith("collapseIf(")) {
					//Extract the matching expression
					String expression = metadata.substring("collapseIf(".length(), metadata.length() - 1);
					if (value.equals(expression)) {
						//remove the context around the specific property
						templater.resize(new String[]{path}, 0);
						return true;
					}
				}
				return false;
			}
		}).include(new IDocumentFactoryBuilder.IHandler() {
			@Override
			public boolean handle(Object value, String metadata, String property, ITemplater templater) {
				if (value instanceof List && ("collapseNonEmpty".equals(metadata) || "collapseEmpty".equals(metadata))) {
					List list = (List) value;
					//loop until all tags with the same name are processed
					do {
						String[] md = templater.getMetadata(property, false);
						boolean collapseOnEmpty = contains(md, "collapseEmpty");
						boolean collapseNonEmpty = contains(md, "collapseNonEmpty");
						if (list.isEmpty()) {
							if (collapseOnEmpty) {
								templater.resize(new String[]{property}, 0);
							} else {
								templater.replace(property, "");
							}
						} else {
							if (collapseNonEmpty) {
								templater.resize(new String[]{property}, 0);
							} else {
								templater.replace(property, "");
							}
						}
					} while (contains(templater.tags(), property));
					//we want to stop further processing if list is empty
					//otherwise we want to continue resizing list and processing it's elements
					return list.isEmpty();
				}
				return false;
			}
		}).include(new IDocumentFactoryBuilder.ILowLevelReplacer() {
			@Override
			public Object replace(Object value) {
				if (value instanceof Color) {
					String fillValue = Integer.toHexString(((Color) value).getRGB()).substring(2);
					String xml = "<w:tc><w:tcPr>\n" +
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
		}).build().open(templateStream, "docx", fos);
		tpl.process(Arrays.asList(application1, application2));
		tpl.flush();
		fos.close();
		Desktop.getDesktop().open(tmp);
	}
}
