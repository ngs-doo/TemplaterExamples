package hr.ngs.templater.example;

import java.util.Date;
import java.util.List;

import org.joda.time.LocalDate;

public class MyBets {
  public final String name;
  public final Date date;
  public final LocalDate announced;
  public final List<MyHorse> horses;
  public MyBets(String name, Date date, LocalDate announced, List<MyHorse> horses){
    this.name      = name;
    this.date      = date;
    this.announced = announced;
    this.horses    = horses;
  }
}
