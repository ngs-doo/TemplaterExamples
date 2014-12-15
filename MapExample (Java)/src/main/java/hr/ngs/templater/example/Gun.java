package hr.ngs.templater.example;

public class Gun {
    public final String type;
    public final String caliber;
    public final String name;

    public Gun(
            final String type,
            final String name,
            final String caliber) {
        this.type = type;
        this.name = name;
        this.caliber = caliber;
    }
}
