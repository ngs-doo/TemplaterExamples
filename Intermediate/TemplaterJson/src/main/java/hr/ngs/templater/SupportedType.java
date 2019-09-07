package hr.ngs.templater;

import java.util.Locale;

enum SupportedType {
    DOCM("Macro-Enabled Office Open XML document (Word)"),
    DOCX("Office Open XML document (Word)"),
    XLSM("Macro-Enabled Office Open XML spreadsheet (Excel)"),
    XLSX("Office Open XML spreadsheet (Excel)"),
    PPTM("Macro-Enabled Office Open XML presentation (PowerPoint)"),
    PPTX("Office Open XML presentation (PowerPoint)"),
    CSV("Comma separated values document"),
    TXT("Text file (native encoding)"),
    UTF8("Text file (UTF-8 encoding)");

    public final String description;
    public final String extension;

    SupportedType(final String description) {
        this.description = description;
        this.extension = name().toLowerCase(Locale.ENGLISH);
    }

    public static SupportedType getByFilename(final String path) {
        final int lastIndexOfDot = path.lastIndexOf('.');
        if (lastIndexOfDot == -1) return null;

        final String extension = path.substring(lastIndexOfDot + 1);
        return valueOf(extension.toUpperCase(Locale.ENGLISH));
    }
}
