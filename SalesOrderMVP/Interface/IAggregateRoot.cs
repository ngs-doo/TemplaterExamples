namespace SalesOrderMVP
{
	public interface IAggregateRoot
	{
		string URI { get; }
	}

	public static class AggregateRootHelper
	{
		public static bool IsSameAs<TRoot>(this TRoot root, object obj)
			where TRoot : class, IAggregateRoot
		{
			var other = obj as TRoot;
			return other != null && root != null
				&& other.URI == root.URI;
		}
	}
}
