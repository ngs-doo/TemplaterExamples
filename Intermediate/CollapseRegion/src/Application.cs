using System.Collections.Generic;

namespace CollapseRegion
{
	public class Application
	{
		public int paybackYears { get; private set; }
		public bool? ucCheck { get; private set; }
		public string ucCheckResponse { get; private set; }
		private Applicant applicant;
		private Applicant coApplicant;
		private List<Loan> loans = new List<Loan>();
		private bool _hideLoans;

		public Application setPaybackYears(int paybackYears)
		{
			this.paybackYears = paybackYears;
			return this;
		}

		public Application setUcCheck(bool? ucCheck)
		{
			this.ucCheck = ucCheck;
			return this;
		}

		public Application setUcCheckResponse(string ucCheckResponse)
		{
			this.ucCheckResponse = ucCheckResponse;
			return this;
		}

		public Applicant getApplicant()
		{
			return applicant;
		}

		public Application setApplicant(Applicant applicant)
		{
			this.applicant = applicant;
			return this;
		}

		public Applicant getCoApplicant()
		{
			return coApplicant;
		}

		public Application setCoApplicant(Applicant coApplicant)
		{
			this.coApplicant = coApplicant;
			return this;
		}

		public List<Loan> getLoans()
		{
			return loans;
		}

		public Application hideLoans()
		{
			_hideLoans = true;
			return this;
		}

		public bool getHideLoans()
		{
			return _hideLoans;
		}

		public int getLoansCount() { return loans.Count; }
	}
}
