package hr.ngs.templater.example;

import java.util.ArrayList;
import java.util.List;

public class Applicant {
    private String name;
    private EmploymentFromUntil fromUntil;
    private EmploymentFrom from;
    private List<Child> children = new ArrayList<Child>();

    public Applicant(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public EmploymentFromUntil getFromUntil() {
        return fromUntil;
    }

    public Applicant setFromUntil(String employer, int fromYear, int fromMonth, int toYear, int toMonth) {
        this.fromUntil = new EmploymentFromUntil().setUntil(toYear, toMonth);
        this.fromUntil.setName(employer).setFrom(fromYear, fromMonth);
        return this;
    }

    public EmploymentFrom getFrom() {
        return from;
    }

    public Applicant setFrom(String employer, int fromYear, int fromMonth) {
        this.from = new EmploymentFromUntil().setName(employer).setFrom(fromYear, fromMonth);
        return this;
    }

    public List<Child> getChildren() { return children; }
    public Applicant addChild(String name) {
        children.add(new Child(name));
        return this;
    }

    public static class Child {
        private final String name;
        public Child(String name) {
            this.name = name;
        }
        public String getName() { return name; }
    }
}
