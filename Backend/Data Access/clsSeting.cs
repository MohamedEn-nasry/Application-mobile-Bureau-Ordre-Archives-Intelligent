using System;
using System.Collections.Generic;
using System.Text;

namespace Data_Access
{
    public class clsSeting
    {
        private static string GetConnectionString()
        {
            // If ConnectionString is provided in environment variables (e.g. Docker Compose), use it
            string envConn = Environment.GetEnvironmentVariable("ConnectionString");
            if (!string.IsNullOrEmpty(envConn))
            {
                return envConn;
            }

            // Otherwise, fall back to localhost for standard local development on Windows
            return "Host=localhost;Port=5432;Database=order_management_archive;Username=postgres;Password=sa123456";
        }

        public static string _connectionString = GetConnectionString();
    }
}
