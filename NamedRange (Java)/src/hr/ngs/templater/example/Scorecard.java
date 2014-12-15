package hr.ngs.templater.example;

public class Scorecard {
    public final String clientID;
    public final String objectGroup;
    public final String description;
    public final BetaGroup[] groups;

    public Scorecard(
            final String clientID,
            final String objectGroup,
            final String description,
            final BetaGroup[] groups) {
        this.clientID = clientID;
        this.objectGroup = objectGroup;
        this.description = description;
        this.groups = groups;
    }
}
