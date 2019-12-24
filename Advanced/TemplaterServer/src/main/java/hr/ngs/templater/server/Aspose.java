package hr.ngs.templater.server;

import com.aspose.words.Document;
import com.aspose.words.SaveFormat;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;

public class Aspose implements PdfConverter {

	@Override
	public byte[] convert(byte[] template, String extension) throws Exception {
		ByteArrayInputStream input = new ByteArrayInputStream(template);
		ByteArrayOutputStream result = new ByteArrayOutputStream();
		Document doc = new Document(input);
		doc.save(result, SaveFormat.PDF);
		return result.toByteArray();
	}
}
