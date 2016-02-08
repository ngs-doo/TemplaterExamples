package hr.ngs.templater.example;

import org.joda.time.LocalDate;

public class Kills {
    public final String name;
    public final LocalDate date;

    public Kills(
            final String name,
            final LocalDate date) {
        this.name = name;
        this.date = date;
    }
}
