package hr.ngs.templater.server;

public interface PdfConverter {
	byte[] convert(byte[] template, String extension) throws Exception;
}
