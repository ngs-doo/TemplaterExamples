import hr.ngs.templater.TemplaterJson;
import hr.ngs.templater.example.*;
import org.junit.Test;

import java.awt.*;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;

public class DemoTests {
	@Test
	public void testJsonBench() throws Exception {
		InputStream json = DemoTests.class.getResourceAsStream("/benchmark-data.json");
		InputStream template = DemoTests.class.getResourceAsStream("/benchmark-template.xlsx");
		File tmp = File.createTempFile("bench", ".xlsx");
		OutputStream output = new FileOutputStream(tmp);
		TemplaterJson.process("xlsx", template, json, output);
		Desktop.getDesktop().open(tmp);
	}

	@Test
	public void testJsonBeer() throws Exception {
		InputStream json = DemoTests.class.getResourceAsStream("/beers-data.json");
		InputStream template = DemoTests.class.getResourceAsStream("/beers-template.docx");
		File tmp = File.createTempFile("beers", ".docx");
		OutputStream output = new FileOutputStream(tmp);
		TemplaterJson.process("docx", template, json, output);
		Desktop.getDesktop().open(tmp);
	}

	@Test
	public void testMapResize() throws Exception {
		MapExample.main(null);
	}

	@Test
	public void testListExample() throws Exception {
		ListExample.main(null);
	}

	@Test
	public void testDynamicResize() throws Exception {
		DynamicResize.main(null);
	}

	@Test
	public void testNamedRange() throws Exception {
		NamedRangeExample.main(null);
	}

	@Test
	public void testHtmlExcel() throws Exception {
		HtmlExample.main(null);
	}

	@Test
	public void testPushdown() throws Exception {
		TableExample.main(null);
	}

	@Test
	public void testLinks() throws Exception {
		LinksExample.main(null);
	}

	@Test
	public void testPivot() throws Exception {
		PivotExample.main(null);
	}

	@Test
	public void testCollapse() throws Exception {
		CollapseExample.main(null);
	}

	@Test
	public void testOverride() throws Exception {
		BoolExample.main(null);
	}

	@Test
	public void testShared() throws Exception {
		SharedCollectionExample.main(null);
	}

	@Test
	public void testImport() throws Exception {
		ImportExample.main(null);
	}

	@Test
	public void testLimits() throws Exception {
		LimitsExample.main(null);
	}

	@Test
	public void testFormulas() throws Exception {
		FormulaExample.main(null);
	}

	@Test
	public void testPictures() throws Exception {
		PicturesExample.main(null);
	}

	@Test
	public void testResultSet() throws Exception {
		ResultSetExample.main(null);
	}

	@Test
	public void testSheets() throws Exception {
		SheetReportExample.main(null);
	}
}
