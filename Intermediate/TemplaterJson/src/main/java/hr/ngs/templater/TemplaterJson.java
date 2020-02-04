package hr.ngs.templater;

import com.dslplatform.json.DslJson;
import com.dslplatform.json.JsonReader;
import com.dslplatform.json.ObjectConverter;

import javax.imageio.ImageIO;
import java.io.*;
import java.util.Base64;
import java.util.Formatter;

public class TemplaterJson {
    public static void main(final String[] args) {
        int exitCode;
        if (args.length == 0) {
            outputHelp(System.out);
            exitCode = 0;
        } else if (args.length > 3) {
            System.err.println("Too many arguments (" + args.length + ")!");
            System.err.println();
            outputHelp(System.err);
            exitCode = 1;
        } else {
            try {
                exitCode = process(
                        args[0],
                        args.length > 1 ? args[1] : null,
                        args.length > 2 ? args[2] : null);
            } catch (Throwable t) {
                System.err.println("An error occurred while processing:");
                t.printStackTrace();
                exitCode = 2;
            }
        }
        System.exit(exitCode);
    }

    public static int process(String templatePath, String dataPath, String outputPath) throws IOException {
        // Prepare the input template stream, check extension
        SupportedType st = SupportedType.getByFilename(templatePath);
        if (st == null) {
            System.err.println("Unsupported extension: " + templatePath);
            return 2;
        }

        InputStream templateStream = new FileInputStream(templatePath);

        // Prepare the input data stream (file or stdin)
        InputStream dataStream = dataPath == null ? System.in : new FileInputStream(dataPath);

        // Prepare the output stream (file or stdout)
        OutputStream outputStream = outputPath == null ? System.out : new FileOutputStream(outputPath);

        process(st.extension, templateStream, dataStream, outputStream);
        return 0;
    }

    private static Object readData(InputStream dataStream) throws IOException {
        DslJson<Object> dslJson = new DslJson<Object>(new DslJson.Settings<Object>());
        JsonReader<Object> reader = dslJson.newReader(dataStream, new byte[4096]);
        reader.getNextToken();
        return ObjectConverter.deserializeObject(reader);
    }

    public static void process(
            String extension,
            InputStream templateStream,
            InputStream dataStream,
            OutputStream outputStream) throws IOException {

        Object data = readData(dataStream);

        ITemplateDocument tpl = Configuration.builder().include(IMAGE_DECODER).build().open(templateStream, extension, outputStream);
        tpl.process(data);
        tpl.flush();
    }

    private static IDocumentFactoryBuilder.IFormatter IMAGE_DECODER = new IDocumentFactoryBuilder.IFormatter() {
        @Override
        public Object format(Object value, String metadata) {
            if ("image".equals(metadata) && value instanceof String) {
                byte[] bytes = Base64.getDecoder().decode((String)value);
                try {
                    return ImageIO.read(new ByteArrayInputStream(bytes));
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }
            return value;
        }
    };

    private static void outputHelp(final PrintStream ps) {
        StringBuilder sb = new StringBuilder();
        Formatter fmt = new Formatter(sb);
        fmt.format("Example usage:%n" +
                "\tjava -jar templater-json.jar template.ext [data.json] [output.ext]%n" +
                "\ttemplate.ext: path to the template file (eg. document.docx)%n" +
                "\tdata.json:    path to a file containing a JSON object or an array of JSON objects%n" +
                "\toutput.ext:   output path where the processed report is to be placed (eg. result.docx)%n%n" +
                "Alternatively, you can use omit the [data.json] and [output.ext] arguments to read from stdin and write to stdout%n" +
                "\tjava -jar templater-json.jar template.ext < [data.json] > [output.ext]%n%n" +
                "\tjava -jar templater-json.jar template.ext < [data.json] > [output.ext]%n%n" +
                "Images can be sent as base64 string in JSON and paired with :image metadata on the tag.%n%n" +
                "Supported extensions are:%n");

        for (SupportedType st : SupportedType.values()) {
            fmt.format("\t%-4s - %s%n", st.extension, st.description);
        }
        ps.print(sb);
    }
}
