package hr.ngs.templater.example;

public class BetaGroup {
    public final String name;
    public final BetaClause[] clauses;

    public BetaGroup(
            final String name,
            final BetaClause[] clauses) {
        this.name = name;
        this.clauses = clauses;
    }
}
