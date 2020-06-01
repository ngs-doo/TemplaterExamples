using System.Diagnostics;
using System.IO;
using NGS.Templater;

namespace NamedRange
{
	public class Program
	{
		public class BetaClause
		{
			public string description { get; set; }
			public string clause { get; set; }
			public decimal beta { get; set; }
		}

		public class BetaGroup
		{
			public string name { get; set; }
			public BetaClause[] clauses { get; set; }
		}

		public class Scorecard
		{
			public string clientID { get; set; }
			public string objectGroup { get; set; }
			public string description { get; set; }
			public BetaGroup[] groups { get; set; }
		}

		public static void Main(string[] args)
		{
			File.Copy("template/Scorecard.xlsx", "Scorecard.xlsx", true);

			using (var doc = Configuration.Factory.Open("Scorecard.xlsx"))
				doc.Process(MakeScorecard(100));
			Process.Start(new ProcessStartInfo("Scorecard.xlsx") { UseShellExecute = true });
		}

		private static Scorecard MakeScorecard(int groups)
		{
			var betaGroups = new BetaGroup[groups];
			for (int g = 0; g < groups; g++)
			{
				var betaClauses = new BetaClause[g];
				for (int c = 0; c < g; c++)
				{
					var group = "group_" + (g + 1);
					betaClauses[c] = new BetaClause
					{
						description = string.Format("[[{0}]::{1}]", group, group + "_clause_" + (c + 1)),
						clause = string.Format("This is group {0}, clause {1}", g + 1, c + 1),
						beta = (g + 1) + (c + 1) * 0.01m
					};
				}

				betaGroups[g] = new BetaGroup { name = "Group " + (g + 1), clauses = betaClauses };
			}

			return new Scorecard
			{
				clientID = "Test client",
				objectGroup = "Range test scorecard",
				description = "Test description",
				groups = betaGroups
			};
		}
	}
}
