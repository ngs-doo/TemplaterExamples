package hr.ngs.templater.example;

public class EmploymentFromUntil extends EmploymentFrom {
	private int untilYear;
	private int untilMonth;

	public int getUntilYear() {
		return untilYear;
	}

	public EmploymentFromUntil setUntil(int year, int month) {
		this.untilYear = year;
		this.untilMonth = month;
		return this;
	}

	public int getUntilMonth() {
		return untilMonth;
	}
}
