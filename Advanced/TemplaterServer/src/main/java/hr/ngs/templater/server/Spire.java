package hr.ngs.templater.server;

import com.spire.doc.Document;

import java.io.*;

public class Spire implements PdfConverter {

	@Override
	public byte[] convert(byte[] template, String extension) {
		ByteArrayInputStream input = new ByteArrayInputStream(template);
		ByteArrayOutputStream result = new ByteArrayOutputStream();
		Document doc = new Document();
		doc.loadFromStream(input, com.spire.doc.FileFormat.Docx);
		doc.saveToFile(result, com.spire.doc.FileFormat.PDF);
		return result.toByteArray();
	}
}
