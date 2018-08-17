package hr.ngs.templater.example;

import java.util.ArrayList;
import java.util.List;

public class Application {
	private int paybackYears;
	private Boolean ucCheck;
	private String ucCheckResponse;
	private Applicant applicant;
	private Applicant coApplicant;
	private List<Loan> loans = new ArrayList<Loan>();
	private boolean hideLoans;

	public int getPaybackYears() {
		return paybackYears;
	}

	public Application setPaybackYears(int paybackYears) {
		this.paybackYears = paybackYears;
		return this;
	}

	public Boolean getUcCheck() {
		return ucCheck;
	}

	public Application setUcCheck(Boolean ucCheck) {
		this.ucCheck = ucCheck;
		return this;
	}

	public String getUcCheckResponse() {
		return ucCheckResponse;
	}

	public Application setUcCheckResponse(String ucCheckResponse) {
		this.ucCheckResponse = ucCheckResponse;
		return this;
	}

	public Applicant getApplicant() {
		return applicant;
	}

	public Application setApplicant(Applicant applicant) {
		this.applicant = applicant;
		return this;
	}

	public Applicant getCoApplicant() {
		return coApplicant;
	}

	public Application setCoApplicant(Applicant coApplicant) {
		this.coApplicant = coApplicant;
		return this;
	}

	public List<Loan> getLoans() {
		return loans;
	}

	public Application hideLoans() {
		hideLoans = true;
		return this;
	}

	public boolean getHideLoans() {
		return hideLoans;
	}

	public int getLoansCount() { return loans.size(); }
}
