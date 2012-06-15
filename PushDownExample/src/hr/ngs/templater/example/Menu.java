package hr.ngs.templater.example;

import java.util.List;



public class Menu {
  public final List<SpecialMenu> specialMenu;
  public final List<DailyMenu> dailyMenu;
  public final String name;
  public Menu(String name, List<SpecialMenu> specialMenu, List<DailyMenu> dailyMenu){
    this.name = name;
    this.specialMenu = specialMenu;
    this.dailyMenu   = dailyMenu;
  }
}
