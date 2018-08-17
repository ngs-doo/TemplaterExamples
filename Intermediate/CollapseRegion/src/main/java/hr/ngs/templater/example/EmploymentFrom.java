package hr.ngs.templater.example;

public class EmploymentFrom {
	private String name;
	private int fromYear;
	private int fromMonth;

	public String getName() {
		return name;
	}

	public EmploymentFrom setName(String name) {
		this.name = name;
		return this;
	}

	public int getFromYear() {
		return fromYear;
	}

	public EmploymentFrom setFrom(int year, int month) {
		this.fromYear = year;
		this.fromMonth = month;
		return this;
	}

	public int getFromMonth() {
		return fromMonth;
	}
}
