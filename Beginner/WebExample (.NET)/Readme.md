##ASP.NET example

Use of Templater in ASP.NET application. Embedding license as a resource.

Good practice is to initialize Templater factory in a shared static field as done in Global.

templater.lic is added as embedded resource in web project. 
This will allow Templater to pick it up later from assembly instead of providing it with explicit license registration or path to license file.

Templater can work directly with streams as shown in WebService example where it directly pipes template result to Context.Response.OutputStream.