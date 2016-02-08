using System.Collections.Generic;

namespace SalesOrderMVP
{
	public interface IPersistableRepository<TRoot> : IRepository<TRoot>
		where TRoot : IAggregateRoot
	{
		void Save(IEnumerable<TRoot> insert, IEnumerable<TRoot> update, IEnumerable<TRoot> delete);
	}

	public static class RepositoryHelper
	{
		public static void Insert<T>(this IPersistableRepository<T> repository, T item)
			where T : IAggregateRoot
		{
			repository.Save(new[] { item }, null, null);
		}
		public static void Update<T>(this IPersistableRepository<T> repository, T item)
			where T : IAggregateRoot
		{
			repository.Save(null, new[] { item }, null);
		}
		public static void Delete<T>(this IPersistableRepository<T> repository, T item)
			where T : IAggregateRoot
		{
			repository.Save(null, null, new[] { item });
		}
	}
}
