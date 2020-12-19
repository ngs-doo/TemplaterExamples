using System.Collections.Generic;

namespace CollapseRegion
{
	public class Applicant
	{
		private string name;
		private EmploymentFromUntil fromUntil;
		private EmploymentFrom from;
		private List<Child> children = new List<Child>();

		public Applicant(string name)
		{
			this.name = name;
		}

		public string getName()
		{
			return name;
		}

		public EmploymentFromUntil getFromUntil()
		{
			return fromUntil;
		}

		public Applicant setFromUntil(string employer, int fromYear, int fromMonth, int toYear, int toMonth)
		{
			this.fromUntil = new EmploymentFromUntil().setUntil(toYear, toMonth);
			this.fromUntil.setName(employer).setFrom(fromYear, fromMonth);
			return this;
		}

		public EmploymentFrom getFrom()
		{
			return from;
		}

		public Applicant setFrom(string employer, int fromYear, int fromMonth)
		{
			this.from = new EmploymentFromUntil().setName(employer).setFrom(fromYear, fromMonth);
			return this;
		}

		public List<Child> getChildren() { return children; }
		public Applicant addChild(string name)
		{
			children.Add(new Child(name));
			return this;
		}

		public class Child
		{
			private readonly string name;
			public Child(string name)
			{
				this.name = name;
			}
			public string getName() { return name; }
		}
	}
}
