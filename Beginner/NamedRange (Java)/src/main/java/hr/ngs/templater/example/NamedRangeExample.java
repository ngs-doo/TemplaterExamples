package hr.ngs.templater.example;

import hr.ngs.templater.Configuration;
import hr.ngs.templater.ITemplateDocument;

import java.awt.*;
import java.io.*;
import java.math.BigDecimal;

public class NamedRangeExample {

	private static Scorecard makeScorecard(final int groups) {
		final BetaGroup[] betaGroups = new BetaGroup[groups];
		for (int g = 0; g < groups; g++) {
			final BetaClause[] betaClauses = new BetaClause[g];
			for (int c = 0; c < g; c++) {
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

	public static void main(final String[] args) throws Exception {
		InputStream templateStream = NamedRangeExample.class.getResourceAsStream("/Scorecard.xlsx");
		File tmp = File.createTempFile("score", ".xlsx");

		FileOutputStream fos = new FileOutputStream(tmp);
		ITemplateDocument tpl = Configuration.factory().open(templateStream, "xlsx", fos);
		tpl.process(makeScorecard(100));
		tpl.flush();
		fos.close();
		Desktop.getDesktop().open(tmp);
	}
}
