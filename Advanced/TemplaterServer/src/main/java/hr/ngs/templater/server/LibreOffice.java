package hr.ngs.templater.server;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.util.Date;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;

public class LibreOffice implements PdfConverter {
	private final Logger logger;
	private final int timeoutLimit;
	private final String tmpFolder;
	private final String libreOfficePath;
	private int counter = 1;

	public LibreOffice(Logger logger, String[] args) {
		this.logger = logger;
		int timeout = 30;
		String tmp = "";
		String path = "";
		for (String a : args) {
			if (a.startsWith("-timeout=")) {
				timeout = Integer.parseInt(a.substring("-timeout=".length()));
			} else if (a.startsWith("-tmp=")) {
				tmp = a.substring("-tmp=".length());
				File f = new File(tmp);
				if (!f.exists()) {
					throw new RuntimeException("Unable to find specified temporary folder: " + tmp);
				}
			} else if (a.startsWith("-libreoffice=")) {
				path = a.substring("-libreoffice=".length());
			}
		}
		if (path.length() == 0) {
			File pf = new File("C:/Program Files (x86)");
			if (pf.exists()) {
				File[] files = pf.listFiles(f -> f.getName().startsWith("LibreOffice "));
				if (files != null && files.length > 0) {
					File prog = new File(files[0], "program");
					File soffice = new File(prog, "soffice.exe");
					if (soffice.exists()) {
						path = soffice.getAbsolutePath();
					}
				}
			}
			if (path.length() == 0) {
				throw new RuntimeException(
						"Unable to find LibreOffice on the system. Please explicitly specify it via: -libreoffice=/user/home/office/libreoffice");
			}
		}
		this.timeoutLimit = timeout;
		this.tmpFolder = tmp;
		this.libreOfficePath = path;
	}

	@Override
	public synchronized byte[] convert(byte[] template, String extension) throws Exception {

			final File tmpFile = tmpFolder.length() == 0
					? File.createTempFile("templaterDocument", "." + extension)
					: new File(tmpFolder, "templaterDocument" + (counter++) + "." + extension);
			final String outputFileName = tmpFile.getPath().substring(0, tmpFile.getPath().length() - extension.length()) + "pdf";

			try {
				long start = new Date().getTime();
				final OutputStream os = new FileOutputStream(tmpFile);
				os.write(template);
				os.close();

				ProcessBuilder builder = new ProcessBuilder(libreOfficePath, "--norestore", "--nofirststartwizard", "--nologo", "--headless", "--convert-to", "pdf", tmpFile.getPath());
				builder.directory(tmpFile.getParentFile());
				Process process = builder.start();
				if (process.waitFor(timeoutLimit, TimeUnit.SECONDS)) {
					File result = new File(outputFileName);
					try {
						if (result.exists()) {
							byte[] output = Files.readAllBytes(result.toPath());
							if (logger.isLoggable(Level.FINE)) {
								logger.log(Level.FINE, String.format("PDF conversion finished in %d ms. input size = %d, output size = %d", new Date().getTime() - start, template.length, output.length));
							}
							return output;
						} else {
							if (logger.isLoggable(Level.WARNING)) {
								logger.log(Level.WARNING, String.format("Unable to find output PDF. Duration: %d ms", new Date().getTime() - start));
							}
						}
					} finally {
						result.delete();
					}
				} else {
					if (logger.isLoggable(Level.WARNING)) {
						logger.log(Level.WARNING, String.format("Timeout waiting for PDF conversion. Duration: %d ms", new Date().getTime() - start));
					}
				}
			} finally {
				tmpFile.delete();
			}
			return null;
		}

}
