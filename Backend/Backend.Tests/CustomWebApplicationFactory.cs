using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using System;
using System.IO;

namespace Backend.Tests
{
    public class CustomWebApplicationFactory<TProgram> : WebApplicationFactory<TProgram> where TProgram : class
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.UseEnvironment("Development");

            // Point the connection string to a test DB if needed
            string testConn = Environment.GetEnvironmentVariable("TEST_ConnectionString");
            if (!string.IsNullOrEmpty(testConn))
            {
                Data_Access.clsSeting._connectionString = testConn;
            }
            else
            {
                // Fallback test database name
                Data_Access.clsSeting._connectionString = "Host=localhost;Port=5432;Database=order_management_archive_test;Username=postgres;Password=sa123456";
            }

            builder.ConfigureAppConfiguration((context, configBuilder) =>
            {
                configBuilder.SetBasePath(Directory.GetCurrentDirectory());
                configBuilder.AddJsonFile("appsettings.json", optional: true);
                configBuilder.AddEnvironmentVariables();
            });
        }
    }
}
