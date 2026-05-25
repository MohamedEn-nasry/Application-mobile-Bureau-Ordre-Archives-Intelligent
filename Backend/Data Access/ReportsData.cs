using Npgsql;
using DTO.Reports;

namespace Data_Access
{
    public class ReportsData
    {
        public static ReportsOverviewDTO GetOverview(string period)
        {
            DateTime startDate = GetStartDate(period);

            var summary = GetSummary(startDate);
            var monthly = GetMonthlyCourriers(startDate);
            var categories = GetCategoryDistribution(startDate);
            var activity = GetUserActivity();
            var indicators = GetKeyIndicators(startDate);

            return new ReportsOverviewDTO(
                summary,
                monthly,
                categories,
                activity,
                indicators
            );
        }

        private static DateTime GetStartDate(string period)
        {
            return period switch
            {
                "7d" => DateTime.UtcNow.AddDays(-7),
                "30d" => DateTime.UtcNow.AddDays(-30),
                "3m" => DateTime.UtcNow.AddMonths(-3),
                "6m" => DateTime.UtcNow.AddMonths(-6),
                "1y" => DateTime.UtcNow.AddYears(-1),
                _ => DateTime.UtcNow.AddMonths(-6)
            };
        }

        private static ReportsSummaryDTO GetSummary(DateTime startDate)
        {
            using var conn = new NpgsqlConnection(clsSeting._connectionString);
            using var cmd = new NpgsqlCommand(@"
                SELECT
                    COUNT(*) FILTER (WHERE type = 'Entrant') AS entrant,
                    COUNT(*) FILTER (WHERE type = 'Sortant') AS sortant,
                    COUNT(*) FILTER (WHERE statut IN ('ATraiter', 'EnTraitement')) AS en_attente,
                    COUNT(*) FILTER (WHERE statut = 'Archive') AS archives
                FROM courrier
                WHERE date_courrier >= @startDate;
            ", conn);

            cmd.Parameters.AddWithValue("@startDate", startDate);

            conn.Open();

            using var reader = cmd.ExecuteReader();

            if (reader.Read())
            {
                return new ReportsSummaryDTO(
                    Convert.ToInt32(reader["entrant"]),
                    Convert.ToInt32(reader["sortant"]),
                    Convert.ToInt32(reader["en_attente"]),
                    Convert.ToInt32(reader["archives"])
                );
            }

            return new ReportsSummaryDTO(0, 0, 0, 0);
        }

        private static List<MonthlyCourrierDTO> GetMonthlyCourriers(DateTime startDate)
        {
            var list = new List<MonthlyCourrierDTO>();

            using var conn = new NpgsqlConnection(clsSeting._connectionString);
            //هذه تحول التاريخ إلى نص يمثل اسم الشهر المختصر.{TO_CHAR(date_courrier, 'Mon') AS label}

            //هذه تقطع التاريخ إلى بداية الشهر.{ DATE_TRUNC('month', date_courrier) AS month_date,}
            //يعني FILTER هنا يعمل شرط داخل COUNT.

            using var cmd = new NpgsqlCommand(@"
                SELECT
                    TO_CHAR(date_courrier, 'Mon') AS label,   
                    DATE_TRUNC('month', date_courrier) AS month_date,
                    COUNT(*) FILTER (WHERE type = 'Entrant') AS entrant,
                    COUNT(*) FILTER (WHERE type = 'Sortant') AS sortant
                FROM courrier
                WHERE date_courrier >= @startDate
                GROUP BY month_date, label
                ORDER BY month_date;
            ", conn);

            cmd.Parameters.AddWithValue("@startDate", startDate);

            conn.Open();

            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                list.Add(new MonthlyCourrierDTO(
                    reader["label"].ToString() ?? "",
                    Convert.ToInt32(reader["entrant"]),
                    Convert.ToInt32(reader["sortant"])
                ));
            }

            return list;
        }

        private static List<CategoryReportDTO> GetCategoryDistribution(DateTime startDate)
        {
            var list = new List<CategoryReportDTO>();

            using var conn = new NpgsqlConnection(clsSeting._connectionString);
            //هذا اسمه CTE، يعني جدول مؤقت داخل query.{WITH total AS }



            using var cmd = new NpgsqlCommand(@"
                WITH total AS (
                    SELECT COUNT(*)::decimal AS total_count
                    FROM courrier
                    WHERE date_courrier >= @startDate
                )
                SELECT
                    c.nom AS category_name,
                    COUNT(co.id) AS count,
                    CASE
                        WHEN (SELECT total_count FROM total) = 0 THEN 0
                        ELSE ROUND((COUNT(co.id)::decimal / (SELECT total_count FROM total)) * 100, 0)
                    END AS percentage
                FROM categorie c
                LEFT JOIN courrier co ON co.categorie_id = c.id
                    AND co.date_courrier >= @startDate
                GROUP BY c.id, c.nom
                ORDER BY count DESC;
            ", conn);

            cmd.Parameters.AddWithValue("@startDate", startDate);

            conn.Open();

            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                list.Add(new CategoryReportDTO(
                    reader["category_name"].ToString() ?? "",
                    Convert.ToInt32(reader["count"]),
                    Convert.ToDecimal(reader["percentage"])
                ));
            }

            return list;
        }

        private static List<UserActivityDTO> GetUserActivity()
        {
            var list = new List<UserActivityDTO>();

            using var conn = new NpgsqlConnection(clsSeting._connectionString);
            //هذه تجيب رقم اليوم من التاريخ created_at  { CASE EXTRACT(DOW FROM created_at)}
            //هذا يحوّل رقم اليوم إلى اختصار فرنسي/مغربي:{CASE ... END AS label}

            using var cmd = new NpgsqlCommand(@"
                SELECT
                    CASE EXTRACT(DOW FROM created_at)
                        WHEN 1 THEN 'L'
                        WHEN 2 THEN 'M'
                        WHEN 3 THEN 'Me'
                        WHEN 4 THEN 'J'
                        WHEN 5 THEN 'V'
                        WHEN 6 THEN 'S'
                        WHEN 0 THEN 'D'
                    END AS label,
                    EXTRACT(DOW FROM created_at) AS day_order,
                    COUNT(*) AS count
                FROM courrier
                WHERE created_at >= NOW() - INTERVAL '7 days'
                GROUP BY day_order, label
                ORDER BY day_order;
            ", conn);

            conn.Open();

            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                list.Add(new UserActivityDTO(
                    reader["label"].ToString() ?? "",
                    Convert.ToInt32(reader["count"])
                ));
            }

            return list;
        }

        private static List<KeyIndicatorDTO> GetKeyIndicators(DateTime startDate)
        {
            var list = new List<KeyIndicatorDTO>();

            using var conn = new NpgsqlConnection(clsSeting._connectionString);
            using var cmd = new NpgsqlCommand(@"
                SELECT
                    COUNT(*) AS total,
                    COUNT(*) FILTER (WHERE statut IN ('Traite', 'Recu', 'Envoye', 'Archive')) AS processed,
                    COUNT(*) FILTER (WHERE statut = 'Archive') AS archived,
                    COUNT(*) FILTER (
                        WHERE date_echeance IS NOT NULL
                        AND date_echeance < NOW()
                        AND statut NOT IN ('Traite', 'Recu', 'Envoye', 'Archive')
                    ) AS overdue
                FROM courrier
                WHERE date_courrier >= @startDate;
            ", conn);

            cmd.Parameters.AddWithValue("@startDate", startDate);

            conn.Open();

            using var reader = cmd.ExecuteReader();

            if (reader.Read())
            {
                var total = Convert.ToDecimal(reader["total"]);
                var processed = Convert.ToDecimal(reader["processed"]);
                var archived = Convert.ToDecimal(reader["archived"]);
                var overdue = Convert.ToInt32(reader["overdue"]);

                var processingRate = total == 0 ? 0 : Math.Round((processed / total) * 100, 0);
                var archiveRate = total == 0 ? 0 : Math.Round((archived / total) * 100, 0);

                list.Add(new KeyIndicatorDTO("Taux de traitement", $"{processingRate}%", "+4%", true));
                list.Add(new KeyIndicatorDTO("Délai moyen de traitement", "2.3j", "-0.5j", true));
                list.Add(new KeyIndicatorDTO("Courriers en retard", overdue.ToString(), "+3", false));
                list.Add(new KeyIndicatorDTO("Taux d'archivage", $"{archiveRate}%", "+2%", true));
            }

            return list;
        }
    }
}