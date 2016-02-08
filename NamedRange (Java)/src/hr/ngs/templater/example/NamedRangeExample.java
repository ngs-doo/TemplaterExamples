package hr.ngs.templater.example;

import hr.ngs.templater.Configuration;
import hr.ngs.templater.ITemplateDocument;

import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.math.BigDecimal;

public class NamedRangeExample {

    private static Scorecard makeScorecard(final int groups, final int clauses) {
        final BetaGroup[] betaGroups = new BetaGroup[groups];
        for (int g = 0; g < groups; g ++) {
            final BetaClause[] betaClauses = new BetaClause[g];
            for (int c = 0; c < g; c ++) {
                final String group = "group_" + (g + 1);

                betaClauses[c] = new BetaClause(
                        String.format("[[%s]::%s]", group, group + "_clause_" + (c + 1)),
                        String.format("This is group %d, clause %d", g + 1, c + 1),
                        new BigDecimal((g + 1) + (c + 1) * 0.01));
            }

            betaGroups[g] = new BetaGroup("Group " + g, betaClauses);
        }

        return new Scorecard(
                "Test client",
                "Range test scorecard",
                "Test description",
                betaGroups);
    }

    public static void main(final String[] args) {
        final String templatePath = "Scorecard.xlsx";
        final String outputPath = "ScorecardResult.xlsx";

        try {
            final InputStream inputTemplateStream = new FileInputStream(templatePath);
            final SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");

            final ByteArrayOutputStream baos = new ByteArrayOutputStream();
            final ITemplateDocument tpl = Configuration.factory().open(inputTemplateStream, "xlsx", baos);

            tpl.process(makeScorecard(100, 100));
            tpl.flush();
            inputTemplateStream.close();

            final byte[] result = baos.toByteArray();

            final FileOutputStream fos = new FileOutputStream(outputPath);
            fos.write(result);
            fos.close();
        } catch (final IOException e) {
            e.printStackTrace();
        }
    }
}
