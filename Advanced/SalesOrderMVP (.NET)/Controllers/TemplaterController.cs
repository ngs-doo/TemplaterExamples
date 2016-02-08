using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Windows;
using System.Windows.Input;
using NGS.Templater;
using SalesOrderMVP.Commands;

namespace SalesOrderMVP.Controllers
{
	public class TemplaterController : IDisposable
	{
		private readonly List<CommandBinding> Bindings = new List<CommandBinding>();

		private static readonly IDocumentFactory Factory = NGS.Templater.Configuration.Factory;
		private static int Counter;

		public TemplaterController(
			string excelGridTemplate,
			string excelItemTemplate,
			string itemTemplate,
			string txtTemplate,
			IEnumerable data,
			Func<IEnumerable> getSelectedData)
		{
			Bindings.Add(
				new CommandBinding(
					GlobalCommands.EditExcelGridTemplate,
					(s, ea) => Process.Start(excelGridTemplate)));
			Bindings.Add(
				new CommandBinding(
					GlobalCommands.EditExcelItemTemplate,
					(s, ea) => Process.Start(excelItemTemplate)));
			Bindings.Add(
				new CommandBinding(
					GlobalCommands.EditItemTemplate,
					(s, ea) => Process.Start(itemTemplate)));
			Bindings.Add(
				new CommandBinding(
					GlobalCommands.EditTxtTemplate,
					(s, ea) => Process.Start(txtTemplate)));
			Bindings.Add(
				new CommandBinding(
					GlobalCommands.ShowExcelGridData,
					(s, ea) => CreateReport(excelGridTemplate, data)));
			Bindings.Add(
				new CommandBinding(
					GlobalCommands.ShowExcelItemData,
					(s, ea) => CreateReport(excelItemTemplate, getSelectedData())));
			Bindings.Add(
				new CommandBinding(
					GlobalCommands.ShowItemData,
					(s, ea) => CreateReport(itemTemplate, getSelectedData())));
			Bindings.Add(
				new CommandBinding(
					GlobalCommands.ShowTxtData,
					(s, ea) => CreateReport(txtTemplate, getSelectedData())));

			App.Current.MainWindow.CommandBindings.AddRange(Bindings);
		}

		private void CreateReport(string template, IEnumerable data)
		{
			if (!data.Cast<object>().Any())
			{
				MessageBox.Show("There is no data for report!", "Report", MessageBoxButton.OK, MessageBoxImage.Warning);
				return;
			}

			var file = "Document" + (++Counter) + Path.GetExtension(template);
			File.Copy(template, file, true);
			using (var doc = Factory.Open(file))
				doc.Process(data);

			Process.Start(file);
		}

		public void Dispose()
		{
			Bindings.ForEach(it => App.Current.MainWindow.CommandBindings.Remove(it));
		}
	}
}
