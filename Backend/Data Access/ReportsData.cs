using System;
using System.Collections.Generic;
using Npgsql;
using ReportsDTO;

namespace Data_Access
{
    public class ReportsData
    {
        public static SummaryStatsDto GetDashboardSummaryStats()
        {
            var stats = new SummaryStatsDto();

            using (var conn = new NpgsqlConnection(clsSeting._connectionString))
            using (var cmd = new NpgsqlCommand("SELECT * FROM sp_get_dashboard_summary_stats()", conn))
            {
                conn.Open();
                using (var reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        stats.TotalUsers = reader.GetInt32(reader.GetOrdinal("total_users"));
                        stats.IncomingMail = reader.GetInt32(reader.GetOrdinal("incoming_mail"));
                        stats.OutgoingMail = reader.GetInt32(reader.GetOrdinal("outgoing_mail"));
                        stats.PendingMail = reader.GetInt32(reader.GetOrdinal("pending_mail"));
                        stats.ArchivedMail = reader.GetInt32(reader.GetOrdinal("archived_mail"));
                    }
                }
            }

            return stats;
        }

        public static List<MonthlyStatDto> GetMonthlyStats()
        {
            var list = new List<MonthlyStatDto>();

            using (var conn = new NpgsqlConnection(clsSeting._connectionString))
            using (var cmd = new NpgsqlCommand("SELECT * FROM sp_get_monthly_stats()", conn))
            {
                conn.Open();
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        list.Add(new MonthlyStatDto
                        {
                            Month = reader.GetString(reader.GetOrdinal("month_name")),
                            Entrant = reader.GetInt32(reader.GetOrdinal("entrant_count")),
                            Sortant = reader.GetInt32(reader.GetOrdinal("sortant_count"))
                        });
                    }
                }
            }

            return list;
        }

        public static List<CategoryStatDto> GetCategoryStats()
        {
            var list = new List<CategoryStatDto>();

            using (var conn = new NpgsqlConnection(clsSeting._connectionString))
            using (var cmd = new NpgsqlCommand("SELECT * FROM sp_get_category_stats()", conn))
            {
                conn.Open();
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        list.Add(new CategoryStatDto
                        {
                            Name = reader.GetString(reader.GetOrdinal("category_name")),
                            Value = reader.GetInt32(reader.GetOrdinal("count_value"))
                        });
                    }
                }
            }

            return list;
        }
    }
}
