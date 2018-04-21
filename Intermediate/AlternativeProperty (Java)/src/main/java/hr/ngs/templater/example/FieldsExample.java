package hr.ngs.templater.example;

import hr.ngs.templater.*;

import java.awt.*;
import java.io.*;
import java.lang.reflect.Field;
import java.util.concurrent.Callable;

public class FieldsExample {
	static class MyObjectA {
		public String fieldA = null;
	}
	static class MyObjectB {
		public String fieldB = "alternative value";
	}
	static class MyObject {
		public MyObjectA objectA = new MyObjectA();
		public MyObjectB objectB = new MyObjectB();
	}

	static class MissingFormatter implements IDocumentFactoryBuilder.IFormatter {
		private Callable<Object> getRoot;
		public MissingFormatter(Callable<Object> getRoot) {
			this.getRoot = getRoot;
		}

		@Override
		public Object format(Object value, String metadata) {
			if (metadata.startsWith("missing(") && value == null) {
				try {
					//path to appropriate field
					String[] path = metadata.substring(8, metadata.length() - 1).split("\\.");
					Object current = getRoot.call();
					for(String p : path) {
						Field f = current.getClass().getField(p);
						current = f.get(current);
					}
					return current;
				} catch (Exception ignore) {
				}
			}
			return value;
		}
	}

	private static final ThreadLocal<Object> currentRoot = new ThreadLocal<Object>();

	public static void main(final String[] args) throws Exception {
		InputStream templateStream = FieldsExample.class.getResourceAsStream("/Fields.docx");
		File tmp = File.createTempFile("bool", ".docx");
		FileOutputStream fos = new FileOutputStream(tmp);
		IDocumentFactory factory = Configuration.builder().include(new MissingFormatter(new Callable<Object>() {
			@Override
			public Object call() {
				return currentRoot.get();
			}
		})).build();
		ITemplateDocument tpl = factory.open(templateStream, "docx", fos);
		process(tpl, new MyObject());
		tpl.flush();
		fos.close();
		Desktop.getDesktop().open(tmp);
	}

	static void process(ITemplateDocument doc, Object value) {
		try {
			currentRoot.set(value);
			doc.process(value);
		} finally {
			currentRoot.remove();
		}
	}
}
