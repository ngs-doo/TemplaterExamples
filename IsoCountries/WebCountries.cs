using System;
using System.Collections;
using System.Linq;
using System.Net;
using System.Text;

namespace IsoCountries
{
	public static class WebCountries
	{
		public static void Download(string uri, Action<IEnumerable> execute)
		{
			Threading.RunSafeThread(() =>
			{
				var webClient = new WebClient();
				var result = webClient.DownloadData(new Uri(uri));

				// The download url provides no header information regarding
				// which encoding the data has been encoded with (just text/plain)
				// so we have to specify it manually (LATIN-1 aka ISO-8859-1)
				var encoding = Encoding.GetEncoding("ISO-8859-1");

				execute(ProcessAndFormatData(result, encoding));
			});
		}

		private static IEnumerable ProcessAndFormatData(byte[] data, Encoding encoding)
		{
			var result = encoding.GetString(data);

			return
				(from line in result.Split("\r\n".ToCharArray()).Skip(2)
				 let row = line.Split(';')
				 where row.Length == 2
				 select new { Name = row[0], Code = row[1] })
				.ToList();
		}
	}
}
