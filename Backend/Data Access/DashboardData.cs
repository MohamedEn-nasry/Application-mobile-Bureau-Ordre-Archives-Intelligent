using Npgsql;
using DTO.Dashboard;

namespace Data_Access
{
    public class DashboardData
    {
        public static SummaryStatsDto GetSummaryStats()
        {
            var stats = new SummaryStatsDto();

            using var conn = new NpgsqlConnection(clsSeting._connectionString);

            using var cmd = new NpgsqlCommand(@"
                 SELECT
        (SELECT COUNT(*) FROM users) AS total_users,

        (SELECT COUNT(*)
         FROM users u
         JOIN roles r ON r.id = u.role_id
         WHERE LOWER(r.nom) = 'agent') AS total_agents,

        (SELECT COUNT(*)
         FROM users u
         JOIN roles r ON r.id = u.role_id
         WHERE LOWER(r.nom) = 'lecteur') AS total_lecteurs,

        0 AS total_reports,

        (SELECT COUNT(*)
         FROM courrier
         WHERE LOWER(type) = 'entrant') AS incoming_mail,

        (SELECT COUNT(*)
         FROM courrier
         WHERE LOWER(type) = 'sortant') AS outgoing_mail,

        (SELECT COUNT(*)
         FROM courrier
         WHERE statut IN ('ATraiter', 'EnTraitement')) AS pending_mail,

        (SELECT COUNT(*)
         FROM courrier
         WHERE LOWER(statut) = 'archive') AS archived_mail
            ", conn);

            conn.Open();

            using var reader = cmd.ExecuteReader();

            if (reader.Read())
            {
                stats.TotalUsers = Convert.ToInt32(reader["total_users"]);
                stats.TotalAgents = Convert.ToInt32(reader["total_agents"]);
                stats.TotalLecteurs = Convert.ToInt32(reader["total_lecteurs"]);
                stats.TotalReports = Convert.ToInt32(reader["total_reports"]);
                stats.IncomingMail = Convert.ToInt32(reader["incoming_mail"]);
                stats.OutgoingMail = Convert.ToInt32(reader["outgoing_mail"]);
                stats.PendingMail = Convert.ToInt32(reader["pending_mail"]);
                stats.ArchivedMail = Convert.ToInt32(reader["archived_mail"]);
            }

            return stats;
        }

        public static List<ActivityResponseDto> GetRecentActivity()
        {
            var activities = new List<ActivityResponseDto>();

            using var conn = new NpgsqlConnection(clsSeting._connectionString);

            //في {PostgreSQL} الرمز || يعني دمج النصوص.
            //أعطني أول قيمة ليست NULL  {COALESCE(value1, value2)}

            using var cmd = new NpgsqlCommand(@"
                SELECT *
                FROM (
                    SELECT
                        c.id::text AS id,
                        COALESCE(u.firstname || ' ' || u.lastname, 'Utilisateur') AS user_name,
                        CASE
                            WHEN c.type = 'Entrant' THEN 'A enregistré un courrier entrant'
                            WHEN c.type = 'Sortant' THEN 'A créé un courrier sortant'
                            ELSE 'A créé un courrier'
                        END AS action,
                        c.created_at AS activity_time,
                        'mail' AS icon
                    FROM courrier c
                    LEFT JOIN users u ON u.id = c.auteur_id

                    UNION ALL

                    SELECT
                        ('archive-' || c.id)::text AS id,
                        COALESCE(u.firstname || ' ' || u.lastname, 'Utilisateur') AS user_name,
                        'A archivé un courrier' AS action,
                        c.updated_at AS activity_time,
                        'archive' AS icon
                    FROM courrier c
                    LEFT JOIN users u ON u.id = c.auteur_id
                    WHERE c.statut = 'Archive'

                    UNION ALL

                    SELECT
                        ('user-' || u.id)::text AS id,
                        COALESCE(u.firstname || ' ' || u.lastname, 'Admin') AS user_name,
                        'A ajouté un utilisateur' AS action,
                        u.created_at AS activity_time,
                        'user-plus' AS icon
                    FROM users u
                ) x
                ORDER BY activity_time DESC
                LIMIT 10;
            ", conn);

            conn.Open();

            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                activities.Add(new ActivityResponseDto
                {
                    Id = reader["id"].ToString() ?? "",
                    User = reader["user_name"].ToString() ?? "",
                    Action = reader["action"].ToString() ?? "",
                    Time = Convert.ToDateTime(reader["activity_time"])
                        .ToString("yyyy-MM-dd HH:mm"),
                    Icon = reader["icon"].ToString() ?? "mail"
                });
            }

            return activities;
        }
    }
}