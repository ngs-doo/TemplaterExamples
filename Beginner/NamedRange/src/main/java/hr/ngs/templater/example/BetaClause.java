package hr.ngs.templater.example;

import java.math.BigDecimal;

public class BetaClause {
    public final String description;
    public final String clause;
    public final BigDecimal beta;

    public BetaClause(
            final String description,
            final String clause,
            final BigDecimal beta) {
        this.description = description;
        this.clause = clause;
        this.beta = beta;
    }
}
