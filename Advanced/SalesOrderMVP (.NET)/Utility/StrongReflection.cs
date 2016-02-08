using System;
using System.ComponentModel;
using System.Linq.Expressions;

namespace SalesOrderMVP.Utility
{
	public static class StrongReflection
	{
		public static void Notify<T>(this PropertyChangedEventHandler handler, Expression<Func<T>> property)
		{
			if (handler == null)
				return;

			var lambda = property as LambdaExpression;
			MemberExpression memberExpression;
			if (lambda.Body is UnaryExpression)
			{
				var unaryExpression = lambda.Body as UnaryExpression;
				memberExpression = unaryExpression.Operand as MemberExpression;
			}
			else
				memberExpression = lambda.Body as MemberExpression;
			var constantExpression = memberExpression.Expression as ConstantExpression;
			handler(constantExpression.Value, new PropertyChangedEventArgs(memberExpression.Member.Name));
		}
	}
}
