using System.Collections.Generic;

namespace SalesOrderMVP
{
	public interface IRepository<out TRoot>
		where TRoot : IAggregateRoot
	{
		IEnumerable<TRoot> Data { get; }
	}
}
