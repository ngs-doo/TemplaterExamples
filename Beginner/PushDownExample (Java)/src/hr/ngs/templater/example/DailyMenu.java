package hr.ngs.templater.example;

public class DailyMenu {
    public final String name;
    public final String bonus;
    public final String cost;

    public DailyMenu(
            final String name,
            final String bonus,
            final String cost) {
        this.name = name;
        this.bonus = bonus;
        this.cost = cost;
    }
}
