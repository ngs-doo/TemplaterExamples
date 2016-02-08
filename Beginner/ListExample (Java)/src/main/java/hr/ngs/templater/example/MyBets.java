package hr.ngs.templater.example;

import java.util.Date;
import java.util.List;

import org.joda.time.LocalDate;

@SuppressWarnings("rawtypes")
public class MyBets {
    public final String name;
    public final Date date;
    public final LocalDate announced;
    public final List horses; // <MyHorse>

    public MyBets(
            final String name,
            final Date date,
            final LocalDate announced,
            final List horses) { // <MyHorse>
        this.name = name;
        this.date = date;
        this.announced = announced;
        this.horses = horses;
    }
}
