using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using NGS.Templater;

namespace QuestionnairePlugin
{
	public class Program
	{
		class Questionnaire
		{
			public string Title;
			internal List<Question> Questions = new List<Question>();

			internal class Question
			{
				public string Text;
				public string[] Options = new string[0];
				public int SelectedOption;
			}

			public void Add(string text, string answer, IEnumerable<string> alternatives)
			{
				var options = new[] { answer }.Union(alternatives).OrderBy(_ => _).ToList();
				Questions.Add(
					new Question
					{
						Text = text,
						Options = options.ToArray(),
						SelectedOption = options.IndexOf(answer)
					});
			}
		}

		static bool ProcessQuestionnaire(string prefix, ITemplater templater, Questionnaire q)
		{
			var tags = templater.Tags.ToArray();
			foreach (var t in tags)
				if ((prefix + "title").Equals(t, StringComparison.CurrentCultureIgnoreCase))
					templater.ReplaceAll(t, q.Title);

			templater.Resize(new[] { prefix + "Text", prefix + "Question", prefix + "Answer" }, q.Questions.Count);

			foreach (var ask in q.Questions)
			{
				templater.Replace(prefix + "Text", ask.Text);
				templater.Resize(new[] { prefix + "Answer", prefix + "Question" }, ask.Options.Length);
				for (int i = 0; i < ask.Options.Length; i++)
				{
					if (ask.SelectedOption == i)
						templater.Replace(prefix + "Answer", "\u2611");
					else
						templater.Replace(prefix + "Answer", "\u2610");
					templater.Replace(prefix + "Question", ask.Options[i]);
				}
			}

			return true;
		}

		static object FormatDate(object value, string metadata)
		{
			if (metadata == "date" && value is DateTime)
				return ((DateTime)value).ToShortDateString();
			return value;
		}

		public static void Main(string[] args)
		{
			var quest = new Questionnaire { Title = "When to write a Templater plugin?" };
			quest.Add(
				"When should a formatting plugin be used?",
				"When a simple value conversion is required",
				new[]{ "When a custom data type is required",
					"To improve performance",
					"It should never be used. All possible scenarios are already covered"});
			quest.Add(
				"When should a metadata plugin be used?",
				"To implement common features, such as region collapse",
				new[]{ "When a custom data type is required",
					"To improve performance",
					"It should never be used. All possible scenarios are already covered"});
			quest.Add(
				"When should a processor plugin be used?",
				"When a custom data type is required",
				new[]{ "When a simple value conversion is required",
					"To improve performance",
					"It should never be used. All possible scenarios are already covered"});

			var factory =
				Configuration.Builder
				.Include<Questionnaire>(ProcessQuestionnaire)
				.Include(FormatDate)
				.WithMatcher(@"[\w\.]+")
				.Build();

			using (var input = new FileStream("questions.docx", FileMode.Open))
			using (var output = new FileStream("questionnaire.docx", FileMode.Create))
			using (var doc = factory.Open(input, output, "docx"))
			{
				doc.Process(new { Date = DateTime.Now, Q = quest });
			}

			Process.Start("questionnaire.docx");
		}
	}
}
