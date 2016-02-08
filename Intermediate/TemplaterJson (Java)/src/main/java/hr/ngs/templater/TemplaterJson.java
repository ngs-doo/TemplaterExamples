package hr.ngs.templater;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.io.*;
import java.util.Formatter;
import java.util.Map;

public class TemplaterJson {
    public static void main(final String[] args) throws IOException {
        if (args.length == 0) {
            outputHelp(System.out);
            System.exit(0);
        }

        if (args.length > 3) {
            System.err.println("Too many arguments (" + args.length + ")!");
            System.err.println();
            outputHelp(System.err);
            System.exit(1);
        }

        try {
            process(
                args[0],
                args.length > 1 ? args[1] : null,
                args.length > 2 ? args[2] : null);
            System.exit(0);
        }
        catch (final Throwable t) {
            System.err.println("An error occurred while processing:");
            t.printStackTrace();
            System.exit(2);
        }
    }

    public static void process(
            final String templatePath,
            final String dataPath,
            final String outputPath) throws IOException {

        // Prepare the input template stream, check extension
        final String extension;
        final InputStream templateStream;
        {
            final SupportedType st = SupportedType.getByFilename(templatePath);
            if (st == null) {
                System.err.println("Unsupported extension: " + templatePath);
                System.exit(2);
            }

            extension = st.extension;
            templateStream = new FileInputStream(templatePath);
        }

        // Prepare the input data stream (file or stdin)
        final InputStream dataStream = dataPath == null
                ? System.in
                : new FileInputStream(dataPath);

        // Prepare the output stream (file or stdout)
        final OutputStream outputStream = outputPath == null
                ? System.out
                : new FileOutputStream(outputPath);

        process(extension, templateStream, dataStream, outputStream);
    }

    protected static Object readData(final InputStream dataStream) throws IOException {
        final BufferedInputStream bis = new BufferedInputStream(dataStream);
        bis.mark(1);
        final int ch0 = bis.read();
        bis.reset();

        final Reader dataReader = new InputStreamReader(bis, "UTF-8");
        final Gson gson = new GsonBuilder().create();

        if (ch0 == '{') return gson.fromJson(dataReader, Map.class);
        if (ch0 == '[') return gson.fromJson(dataReader, Map[].class);

        throw new IOException("JSON stream must start with either '{' or '[', but encountered: '" + ch0 + "'");
    }

    public static void process(
            final String extension,
            final InputStream templateStream,
            final InputStream dataStream,
            final OutputStream outputStream) throws IOException {

        final ITemplateDocument tpl = Configuration.factory()
                .open(templateStream, extension, outputStream);

        final Object data = readData(dataStream);
        tpl.process(data);
        tpl.flush();
    }

    private static void outputHelp(final PrintStream ps) {
        final StringBuilder sb = new StringBuilder();
        final Formatter fmt = new Formatter(sb);
        fmt.format("Example usage:%n" +
                "\tjava -jar templater-json.jar [template.ext] [data.json] [output.ext]%n" +
                "\ttemplate.ext: path to the template file%n" +
                "\tdata.json:    path to a file containing a JSON object or an array of JSON objects%n" +
                "\toutput.ext:   output path where the processed report is to be placed%n%n" +
                "Alternatively, you can use omit the [data.json] and [output.ext] arguments to read from stdin and write to stdout%n" +
                "\tjava -jar templater-json.jar [template.ext] < [data.json] > [output.ext]%n%n" +
                "Supported extensions are:%n");

        for (final SupportedType st : SupportedType.values()) {
            fmt.format("\t%-4s - %s%n", st.extension, st.description);
        }

        ps.print(sb);
    }
}
