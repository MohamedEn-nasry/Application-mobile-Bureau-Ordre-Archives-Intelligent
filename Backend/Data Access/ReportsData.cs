using System;
using System.Collections.Generic;
using Npgsql;
using ReportsDTO;
using DTO.Reports;

namespace Data_Access
{
    public class ReportsData
    {
        public static ReportsOverviewDTO GetOverview(string period)
        {
            int days = ParsePeriodToDays(period);
            string filter = days > 0 ? $"WHERE created_at >= NOW() - INTERVAL '{days} days'" : "";
            string filterAnd = days > 0 ? $"AND created_at >= NOW() - INTERVAL '{days} days'" : "";

            ReportsSummaryDTO summary;
            var monthly = new List<MonthlyCourrierDTO>();
            var categories = new List<CategoryReportDTO>();

            using (var conn = new NpgsqlConnection(clsSeting._connectionString))
            {
                conn.Open();

                // Summary
                string summaryQuery = $@"
                    SELECT
                        COALESCE(SUM(CASE WHEN type = 'Entrant' OR type = 'ENTRANT' THEN 1 ELSE 0 END), 0) as entrant,
                        COALESCE(SUM(CASE WHEN type = 'Sortant' OR type = 'SORTANT' THEN 1 ELSE 0 END), 0) as sortant,
                        COALESCE(SUM(CASE WHEN statut = 'En attente' OR statut = 'EN_ATTENTE' THEN 1 ELSE 0 END), 0) as en_attente,
                        COALESCE(SUM(CASE WHEN statut = 'Archivé' OR statut = 'ARCHIVE' THEN 1 ELSE 0 END), 0) as archives
                    FROM courrier {filter}";

                using (var cmd = new NpgsqlCommand(summaryQuery, conn))
                using (var reader = cmd.ExecuteReader())
                {
                    reader.Read();
                    summary = new ReportsSummaryDTO(
                        Convert.ToInt32(reader["entrant"]),
                        Convert.ToInt32(reader["sortant"]),
                        Convert.ToInt32(reader["en_attente"]),
                        Convert.ToInt32(reader["archives"])
                    );
                }

                // Monthly
                string monthlyQuery = $@"
                    WITH months AS (
                        SELECT to_char(date_trunc('month', d), 'Mon') as month_name,
                               EXTRACT(MONTH FROM d) as month_num
                        FROM generate_series(CURRENT_DATE - INTERVAL '5 months', CURRENT_DATE, '1 month') d
                    )
                    SELECT m.month_name,
                           COALESCE(SUM(CASE WHEN c.type = 'Entrant' OR c.type = 'ENTRANT' THEN 1 ELSE 0 END), 0) as entrant_count,
                           COALESCE(SUM(CASE WHEN c.type = 'Sortant' OR c.type = 'SORTANT' THEN 1 ELSE 0 END), 0) as sortant_count
                    FROM months m
                    LEFT JOIN courrier c ON to_char(date_trunc('month', c.created_at), 'Mon') = m.month_name
                    GROUP BY m.month_name, m.month_num
                    ORDER BY m.month_num";

                using (var cmd = new NpgsqlCommand(monthlyQuery, conn))
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        monthly.Add(new MonthlyCourrierDTO(
                            reader.GetString(reader.GetOrdinal("month_name")),
                            Convert.ToInt32(reader["entrant_count"]),
                            Convert.ToInt32(reader["sortant_count"])
                        ));
                    }
                }

                // Categories
                string catQuery = @"
                    SELECT cat.nom as category_name, COUNT(c.id) as count_value
                    FROM categorie cat
                    LEFT JOIN courrier c ON cat.id = c.categorie_id
                    GROUP BY cat.nom
                    ORDER BY count_value DESC
                    LIMIT 10";

                int totalCat = 0;
                var catRaw = new List<(string name, int count)>();
                using (var cmd = new NpgsqlCommand(catQuery, conn))
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        int count = Convert.ToInt32(reader["count_value"]);
                        catRaw.Add((reader.GetString(reader.GetOrdinal("category_name")), count));
                        totalCat += count;
                    }
                }
                foreach (var (name, count) in catRaw)
                {
                    decimal pct = totalCat > 0 ? Math.Round((decimal)count / totalCat * 100, 1) : 0;
                    categories.Add(new CategoryReportDTO(name, count, pct));
                }
            }

            return new ReportsOverviewDTO(summary, monthly, categories, new List<UserActivityDTO>(), new List<KeyIndicatorDTO>());
        }

        private static int ParsePeriodToDays(string period)
        {
            if (string.IsNullOrEmpty(period)) return 0;
            if (period.EndsWith("d") && int.TryParse(period[..^1], out int d)) return d;
            if (period.EndsWith("m") && int.TryParse(period[..^1], out int m)) return m * 30;
            if (period.EndsWith("y") && int.TryParse(period[..^1], out int y)) return y * 365;
            return 0;
        }


        public static SummaryStatsDto GetDashboardSummaryStats(int? days)
        {
            var stats = new SummaryStatsDto();

            using (var conn = new NpgsqlConnection(clsSeting._connectionString))
            {
                string filterUtilisateurs = days.HasValue ? $"WHERE created_at >= NOW() - INTERVAL '{days.Value} days'" : "";
                string filterCourriers = days.HasValue ? $"AND created_at >= NOW() - INTERVAL '{days.Value} days'" : "";
                string filterCourriersWhere = days.HasValue ? $"WHERE created_at >= NOW() - INTERVAL '{days.Value} days'" : "";

                string query = $@"
                    SELECT 
                        (SELECT COUNT(*) FROM users {filterUtilisateurs}) as total_users,
                        (SELECT COUNT(*) FROM courrier WHERE type = 'Entrant' {filterCourriers}) as incoming_mail,
                        (SELECT COUNT(*) FROM courrier WHERE type = 'Sortant' {filterCourriers}) as outgoing_mail,
                        (SELECT COUNT(*) FROM courrier WHERE statut = 'En attente' OR statut = 'EN_ATTENTE' {filterCourriers}) as pending_mail,
                        (SELECT COUNT(*) FROM courrier WHERE statut = 'Archivé' OR statut = 'ARCHIVE' {filterCourriers}) as archived_mail,
                        (SELECT COUNT(*) FROM courrier {filterCourriersWhere}) as total_courriers,
                        (SELECT COUNT(*) FROM courrier WHERE statut IN ('Traité', 'Archivé', 'TRAITE', 'ARCHIVE') {filterCourriers}) as treated_courriers,
                        (SELECT COALESCE(AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/86400.0), 0) FROM courrier WHERE statut IN ('Traité', 'Archivé', 'TRAITE', 'ARCHIVE') {filterCourriers}) as delay_moyen,
                        (SELECT COUNT(*) FROM courrier WHERE (statut = 'En attente' OR statut = 'EN_ATTENTE') AND date_echeance < NOW() {filterCourriers}) as retard_courriers
                ";

                using (var cmd = new NpgsqlCommand(query, conn))
                {
                    conn.Open();
                    using (var reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            stats.TotalUsers = Convert.ToInt32(reader["total_users"]);
                            stats.IncomingMail = Convert.ToInt32(reader["incoming_mail"]);
                            stats.OutgoingMail = Convert.ToInt32(reader["outgoing_mail"]);
                            stats.PendingMail = Convert.ToInt32(reader["pending_mail"]);
                            stats.ArchivedMail = Convert.ToInt32(reader["archived_mail"]);

                            int total = Convert.ToInt32(reader["total_courriers"]);
                            int treated = Convert.ToInt32(reader["treated_courriers"]);
                            double rate = total > 0 ? (double)treated / total * 100.0 : 0;

                            stats.KeyMetrics = new KeyMetricsDto
                            {
                                TauxTraitement = Math.Round(rate, 2),
                                DelaiMoyen = Math.Round(Convert.ToDouble(reader["delay_moyen"]), 1),
                                CourriersRetard = Convert.ToInt32(reader["retard_courriers"])
                            };
                        }
                    }
                }
            }

            return stats;
        }

        public static List<MonthlyStatDto> GetMonthlyStats(int? days)
        {
            var list = new List<MonthlyStatDto>();
            // Since we group by month, days filter might limit the months.
            using (var conn = new NpgsqlConnection(clsSeting._connectionString))
            {
                string filter = days.HasValue ? $"WHERE created_at >= NOW() - INTERVAL '{days.Value} days'" : "";
                
                string query = $@"
                    WITH months AS (
                        SELECT to_char(date_trunc('month', d), 'Mon') as month_name,
                               EXTRACT(MONTH FROM d) as month_num
                        FROM generate_series(
                            CURRENT_DATE - INTERVAL '5 months',
                            CURRENT_DATE,
                            '1 month'
                        ) d
                    )
                    SELECT m.month_name,
                           COALESCE(SUM(CASE WHEN c.type = 'Entrant' OR c.type = 'ENTRANT' THEN 1 ELSE 0 END), 0) as entrant_count,
                           COALESCE(SUM(CASE WHEN c.type = 'Sortant' OR c.type = 'SORTANT' THEN 1 ELSE 0 END), 0) as sortant_count
                    FROM months m
                    LEFT JOIN courrier c ON to_char(date_trunc('month', c.created_at), 'Mon') = m.month_name 
                                          AND (c.created_at >= NOW() - INTERVAL '{(days.HasValue ? days.Value.ToString() : "365")} days')
                    GROUP BY m.month_name, m.month_num
                    ORDER BY m.month_num;
                ";

                using (var cmd = new NpgsqlCommand(query, conn))
                {
                    conn.Open();
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            list.Add(new MonthlyStatDto
                            {
                                Month = reader.GetString(reader.GetOrdinal("month_name")),
                                Entrant = Convert.ToInt32(reader["entrant_count"]),
                                Sortant = Convert.ToInt32(reader["sortant_count"])
                            });
                        }
                    }
                }
            }
            return list;
        }

        public static List<CategoryStatDto> GetCategoryStats(int? days)
        {
            var list = new List<CategoryStatDto>();

            using (var conn = new NpgsqlConnection(clsSeting._connectionString))
            {
                string filter = days.HasValue ? $"WHERE c.created_at >= NOW() - INTERVAL '{days.Value} days'" : "";

                string query = $@"
                    SELECT cat.nom as category_name, COUNT(c.id) as count_value
                    FROM categorie cat
                    LEFT JOIN courrier c ON cat.id = c.categorie_id 
                    {(days.HasValue ? $"AND c.created_at >= NOW() - INTERVAL '{days.Value} days'" : "")}
                    GROUP BY cat.nom
                    ORDER BY count_value DESC;
                ";

                using (var cmd = new NpgsqlCommand(query, conn))
                {
                    conn.Open();
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            list.Add(new CategoryStatDto
                            {
                                Name = reader.GetString(reader.GetOrdinal("category_name")),
                                Value = Convert.ToInt32(reader["count_value"])
                            });
                        }
                    }
                }
            }

            return list;
        }
    }
}
