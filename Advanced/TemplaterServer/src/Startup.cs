using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace TemplaterServer
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options =>
             {
                 options.AddDefaultPolicy(
                     policy =>
                     {
                         policy
                         .WithOrigins("http://localhost:3000", "http://localhost:3001")
                         .AllowAnyHeader()
                         .AllowAnyMethod();
                     });
             });
            services.AddMvc(options => options.EnableEndpointRouting = false);
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            app.UseCors();
            app.UseMvc();
        }
    }
}
