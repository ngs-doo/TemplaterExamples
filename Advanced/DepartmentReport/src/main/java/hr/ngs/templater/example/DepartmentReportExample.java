package hr.ngs.templater.example;

import hr.ngs.templater.Configuration;
import hr.ngs.templater.ITemplateDocument;

import java.awt.Desktop;
import java.io.*;
import java.util.*;
import java.util.stream.Collectors;

public class DepartmentReportExample {

    static class Company {
        public String name;
        public Department[] department;

        public Collection summary() {
            return Arrays.stream(department).flatMap(d ->
                    Arrays.stream(d.team).flatMap(t ->
                            Arrays.stream(t.project).flatMap(p ->
                                    Arrays.stream(p.epic).flatMap(e ->
                                            Arrays.stream(e.task).map(it ->
                                                    new Object() {
                                                        public final String department = d.name;
                                                        public final String team = t.name;
                                                        public final String project = p.name;
                                                        public final String epic = e.name;
                                                        public final String task = it.id;
                                                        public final double days = it.spent;
                                                    }
                                            )
                                    )
                            )
                    )
            ).collect(Collectors.toList());
        }
    }
    static class Department {
        public String name;
        public String code;
        public String head;
        public Team[] team;
        public Department(String name, String code, String head, Team... teams) {
            this.name = name;
            this.code = code;
            this.head = head;
            this.team = teams;
        }
    }
    static class Team {
        public String name;
        public String lead;
        public Project[] project;
        public Team(String name, String lead, Project... projects) {
            this.name = name;
            this.lead = lead;
            this.project = projects;
        }
    }
    static class Project {
        public String name;
        public Epic[] epic;
        public Project(String name, Epic... epics) {
            this.name = name;
            this.epic = epics;
        }
    }
    static class Epic {
        public String name;
        public Task[] task;
        public Epic(String name, Task... tasks) {
            this.name = name;
            this.task = tasks;
        }
    }
    static class Task {
        public String id;
        public double estimated;
        public double spent;
        public Task(String id, double estimated, double spent) {
            this.id = id;
            this.estimated = estimated;
            this.spent = spent;
        }
    }

    public static void main(final String[] args) throws Exception {
        InputStream templateStream = DepartmentReportExample.class.getResourceAsStream("/departments.xlsx");
        File tmp = File.createTempFile("department", ".xlsx");

        FileOutputStream fos = new FileOutputStream(tmp);
        ITemplateDocument tpl = Configuration.factory().open(templateStream, "xlsx", fos);
        tpl.process(getCompany());
        tpl.flush();
        fos.close();
        Desktop.getDesktop().open(tmp);
    }

    private static Company getCompany() {
        Company company = new Company();
        company.name = "Sweat shop ltd.";
        Department dev = new Department(
                "Development",
                "DEV",
                "Michael",
                new Team(
                        "React",
                        "John",
                        new Project(
                                "Soda shop",
                                new Epic(
                                        "Rewrite",
                                        new Task("BR-343", 2, 0.5),
                                        new Task("BR-346", 7, 3.5),
                                        new Task("BR-349", 12, 15),
                                        new Task("BR-423", 1, 0.5),
                                        new Task("BR-443", 20, 35),
                                        new Task("BR-466", 70, 120),
                                        new Task("BR-481", 6, 0),
                                        new Task("BR-482", 10, 60)),
                                new Epic(
                                        "New product search",
                                        new Task("BR-245", 6, 6),
                                        new Task("BR-301", 10, 12),
                                        new Task("BR-302", 2, 1),
                                        new Task("BR-305", 5, 4)))),
                new Team(
                        "Java",
                        "Mary",
                        new Project(
                                "McShop",
                                new Epic(
                                        "Analysis",
                                        new Task("BR-543", 4, 4.5),
                                        new Task("BR-546", 4, 4),
                                        new Task("BR-549", 2, 2),
                                        new Task("BR-623", 1, 1),
                                        new Task("BR-644", 10, 8),
                                        new Task("BR-666", 20, 15),
                                        new Task("BR-681", 60, 80),
                                        new Task("BR-682", 100, 300)),
                                new Epic(
                                        "Reports",
                                        new Task("BR-745", 25, 30),
                                        new Task("BR-702", 100, 20),
                                        new Task("BR-705", 20, 10)),
                                new Epic(
                                        "Performance",
                                        new Task("BR-746", 200, 300),
                                        new Task("BR-762", 100, 20))),
                        new Project(
                                "DoD",
                                new Epic(
                                        "GUI",
                                        new Task("DOD-003", 40, 4.5),
                                        new Task("DOD-007", 50, 60)),
                                new Epic(
                                        "Encryption",
                                        new Task("DOD-022", 25, 30)),
                                new Epic(
                                        "Mining",
                                        new Task("DOD-033", 100, 110),
                                        new Task("DOD-034", 100, 80)))));
        Department sale = new Department(
                "Sales",
                "SALE",
                "Eric",
                new Team(
                        "Philippines",
                        "Marc",
                        new Project(
                                "New leads",
                                new Epic(
                                        "Initial contact",
                                        new Task("SL-231", 6, 4),
                                        new Task("SL-232", 3, 6),
                                        new Task("SL-233", 8, 10),
                                        new Task("SL-234", 1, 1),
                                        new Task("SL-236", 2, 1.5),
                                        new Task("SL-300", 4, 4)),
                                new Epic(
                                        "Demo",
                                        new Task("SL-126", 1, 1),
                                        new Task("SL-222", 2, 4)))),
                new Team(
                        "Government",
                        "Naomi",
                        new Project(
                                "Bitcoin",
                                new Epic(
                                        "Bitcoin",
                                        new Task("GV-003", 5, 10),
                                        new Task("GV-006", 10, 20),
                                        new Task("GV-010", 10, 50))),
                        new Project(
                                "Etherum",
                                new Epic(
                                        "Etherum",
                                        new Task("GV-101", 20, 10)))));
        Department qa = new Department(
                "Quality assurance",
                "QA",
                "Mickey",
                new Team(
                        "QA",
                        "Mickey",
                        new Project(
                                "Releases",
                                new Epic(
                                        "v2.9.2",
                                        new Task("QA-113", 0.5, 0.5),
                                        new Task("QA-114", 1, 1.5),
                                        new Task("QA-115", 0.5, 1),
                                        new Task("QA-116", 2, 1),
                                        new Task("QA-117", 2, 1.5),
                                        new Task("QA-118", 2, 2),
                                        new Task("QA-119", 1, 3),
                                        new Task("QA-120", 3, 1),
                                        new Task("QA-121", 4, 2),
                                        new Task("QA-122", 1, 1),
                                        new Task("QA-123", 2, 1.5),
                                        new Task("QA-124", 5, 7)),
                                new Epic(
                                        "v2.9.3",
                                        new Task("QA-211", 10, 5),
                                        new Task("QA-222", 20, 50))),
                        new Project(
                                "Hotfixes",
                                new Epic(
                                        "Bugs",
                                        new Task("QA-131", 2, 2),
                                        new Task("QA-132", 0.5, 1),
                                        new Task("QA-133", 0.5, 0.25),
                                        new Task("QA-134", 1, 1),
                                        new Task("QA-135", 2, 2),
                                        new Task("QA-136", 0.5, 1),
                                        new Task("QA-137", 1, 0.5),
                                        new Task("QA-139", 3, 1),
                                        new Task("QA-140", 2, 3)))));
        company.department = new Department[] { dev, sale, qa };
        return company;
    }
}
