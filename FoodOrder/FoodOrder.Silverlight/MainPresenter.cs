using System;
using System.Collections.ObjectModel;
using System.Linq;
using System.Windows.Browser;
using System.Windows.Input;
using FoodOrder.RemoteService;

namespace FoodOrder
{
	public class MainPresenter
	{
		public string Customer { get; set; }
		public DateTime FirstDate { get; private set; }
		public DateTime LastDate { get; private set; }
		public DateTime SubmissionDate { get; private set; }
		public string[] Employees { get; private set; }
		public ObservableCollection<WeeklyMenu> Menus { get; private set; }
		public ObservableCollection<EmployeeMenu> Choices { get; private set; }

		public ICommand RandomizeChoices { get; private set; }
		public ICommand CreateExcel { get; private set; }
		public ICommand CreateWord { get; private set; }

		public MainPresenter()
		{
			Customer = "Research & development";
			SubmissionDate = DateTime.Today;
			FirstDate = GetFirstDayOfNextWeek(SubmissionDate);
			LastDate = FirstDate.AddDays(4);
			Choices = new ObservableCollection<EmployeeMenu>();
			Menus = new ObservableCollection<WeeklyMenu>();
			RandomizeChoices = new RelayCommand(RandomizeMenu);
			CreateExcel = new RelayCommand(OpenExcelDocument);
			CreateWord = new RelayCommand(OpenWordDocument);
			var service = new MainServiceSoapClient();
			service.GetEmployeesCompleted += (s, ea) => PrepareMenu(ea.Result);
			service.GetEmployeesAsync();
			service.GetMenusCompleted += (s, ea) => ea.Result.ToList().ForEach(it => Menus.Add(it));
			service.GetMenusAsync();
		}

		private static DateTime GetFirstDayOfNextWeek(DateTime day)
		{
			do
			{
				day = day.AddDays(1);
			} while (day.DayOfWeek != DayOfWeek.Monday);
			return day;
		}

		private void PrepareMenu(ArrayOfString arrayOfString)
		{
			Employees = arrayOfString.ToArray();
			foreach (var e in Employees)
				Choices.Add(new EmployeeMenu { Employee = e });
			RandomizeMenu();
		}

		private void RandomizeMenu()
		{
			var rnd = new Random();
			var len = 3;
			foreach (var choice in Choices)
			{
				choice.MondayChoice = (ChoiceEnum)rnd.Next(0, len);
				choice.TuesdayChoice = (ChoiceEnum)rnd.Next(0, len);
				choice.WednesdayChoice = (ChoiceEnum)rnd.Next(0, len);
				choice.ThursdayChoice = (ChoiceEnum)rnd.Next(0, len);
				choice.FridayChoice = (ChoiceEnum)rnd.Next(0, len);
			}
		}

		private void OpenExcelDocument()
		{
			var service = new MainServiceSoapClient();
			service.CreateExcelReportCompleted += (s, ea) => ShowDocument(service.Endpoint.Address.Uri, ea.Result);
			service.CreateExcelReportAsync(Customer, Choices);
		}

		private void OpenWordDocument()
		{
			var service = new MainServiceSoapClient();
			service.CreateWordReportCompleted += (s, ea) => ShowDocument(service.Endpoint.Address.Uri, ea.Result);
			service.CreateWordReportAsync(Customer, Choices);
		}

		private static void ShowDocument(Uri uri, string result)
		{
			Func<string, Uri> completeUri =
				s => new Uri(uri.ToString().Substring(0, uri.ToString().Length - uri.LocalPath.Length) + "/" + s.Replace("\\", "/"));
			if (HtmlPage.IsPopupWindowAllowed)
				HtmlPage.PopupWindow(completeUri(result), "_blank", null);
			else
				HtmlPage.Window.Eval("window.open('" + completeUri(result) + "', '_blank', '', '')");
		}
	}
}
