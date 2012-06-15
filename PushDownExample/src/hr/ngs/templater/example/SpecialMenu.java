package hr.ngs.templater.example;

import java.util.Date;

public class SpecialMenu {
  public final String name;
  public final String cost;
  public final Date  date;
  public SpecialMenu(String name, String cost, Date date){
    this.name = name;
    this.cost = cost;
    this.date = date;
  }
}
