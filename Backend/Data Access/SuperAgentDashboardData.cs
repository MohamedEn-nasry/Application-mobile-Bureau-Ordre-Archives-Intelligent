using System;
using System.Collections.Generic;
using System.Globalization;
using Npgsql;
using DTO.AgentDashboard;

namespace Data_Access
{
    public class SuperAgentDashboardData
    {
        public static AgentDashboardOverviewDTO GetOverview(int superAgentId)
        {
            var overview = new AgentDashboardOverviewDTO();

            FillHeader(overview, superAgentId);
            overview.Stats = GetStats(superAgentId);
            overview.AssignedMails = GetAssignedMails(superAgentId);
            overview.RecentActivities = GetRecentActivities(superAgentId);
            overview.RecentOcrResults = GetRecentOcrResults(superAgentId);

            return overview;
        }

        private static void FillHeader(AgentDashboardOverviewDTO overview, int superAgentId)
        {
            using var conn = new NpgsqlConnection(clsSeting._connectionString);

            using var cmd = new NpgsqlCommand(@"
                SELECT
                    COALESCE(
                        NULLIF(TRIM(u.firstname || ' ' || u.lastname), ''),
                        u.email,
                        'SuperAgent'
                    ) AS user_name,

                    COALESCE(u.image_path, '') AS user_image,

                    (
                        SELECT COUNT(*)::INT
                        FROM notifications n
                        WHERE n.user_id = @superAgentId
                          AND n.is_read = FALSE
                    ) AS unread_notifications
                FROM users u
                WHERE u.id = @superAgentId;
            ", conn);

            cmd.Parameters.AddWithValue("@superAgentId", superAgentId);

            conn.Open();

            using var reader = cmd.ExecuteReader();

            if (reader.Read())
            {
                overview.UserName = reader["user_name"].ToString() ?? "SuperAgent";
                overview.UserImage = reader["user_image"].ToString() ?? "";
                overview.UnreadNotifications = Convert.ToInt32(reader["unread_notifications"]);
            }
        }

        private static AgentDashboardStatsDTO GetStats(int superAgentId)
        {
            var stats = new AgentDashboardStatsDTO();

            using var conn = new NpgsqlConnection(clsSeting._connectionString);

            using var cmd = new NpgsqlCommand(@"
        SELECT
            (
                SELECT COUNT(*)::INT
                FROM courrier c
                WHERE LOWER(c.type) = 'entrant'
                  AND c.categorie_id IN (
                      SELECT uca.categorie_id
                      FROM user_categorie_access uca
                      WHERE uca.user_id = @superAgentId
                  )
            ) AS incoming_count,

            (
                SELECT COUNT(*)::INT
                FROM courrier c
                WHERE LOWER(c.type) = 'entrant'
                  AND c.categorie_id IN (
                      SELECT uca.categorie_id
                      FROM user_categorie_access uca
                      WHERE uca.user_id = @superAgentId
                  )
                  AND LOWER(COALESCE(c.statut, '')) IN (
                    'atraiter',
                    'a traiter',
                    'à traiter',
                    'é traiter',
                    'en traitement',
                    'entraiter',
                    'en attente',
                    'pending',
                    'inprogress',
                    'in progress'
                  )
            ) AS incoming_pending,

            (
                SELECT COUNT(*)::INT
                FROM courrier c
                WHERE LOWER(c.type) = 'sortant'
                  AND c.categorie_id IN (
                      SELECT uca.categorie_id
                      FROM user_categorie_access uca
                      WHERE uca.user_id = @superAgentId
                  )
            ) AS outgoing_count,

            (
                SELECT COUNT(*)::INT
                FROM courrier c
                WHERE LOWER(c.type) = 'sortant'
                  AND c.categorie_id IN (
                      SELECT uca.categorie_id
                      FROM user_categorie_access uca
                      WHERE uca.user_id = @superAgentId
                  )
                  AND LOWER(COALESCE(c.statut, '')) IN (
                    'brouillon',
                    'draft',
                    'pret',
                    'prêt'
                  )
            ) AS outgoing_drafts,

            (
                SELECT COUNT(*)::INT
                FROM courrier c
                WHERE LOWER(c.type) = 'entrant'
                  AND c.categorie_id IN (
                      SELECT uca.categorie_id
                      FROM user_categorie_access uca
                      WHERE uca.user_id = @superAgentId
                  )
                  AND LOWER(COALESCE(c.statut, '')) NOT IN (
                    'traite',
                    'traité',
                    'recu',
                    'reçu',
                    'envoye',
                    'envoyé',
                    'archive',
                    'archivé',
                    'completed',
                    'sent'
                  )
            ) AS pending_tasks_count,

            (
                SELECT COUNT(*)::INT
                FROM ocr_resultat o
                INNER JOIN piece_jointe pj ON pj.id = o.piece_jointe_id
                INNER JOIN courrier c ON c.id = pj.courrier_id
                WHERE c.categorie_id IN (
                    SELECT uca.categorie_id
                    FROM user_categorie_access uca
                    WHERE uca.user_id = @superAgentId
                )
                AND o.created_at >= NOW() - INTERVAL '30 days'
            ) AS recent_scans_count;
    ", conn);

            cmd.Parameters.AddWithValue("@superAgentId", superAgentId);

            conn.Open();

            using var reader = cmd.ExecuteReader();

            if (reader.Read())
            {
                stats.IncomingCount = Convert.ToInt32(reader["incoming_count"]);
                stats.IncomingPending = Convert.ToInt32(reader["incoming_pending"]);

                stats.OutgoingCount = Convert.ToInt32(reader["outgoing_count"]);
                stats.OutgoingDrafts = Convert.ToInt32(reader["outgoing_drafts"]);

                stats.PendingTasksCount = Convert.ToInt32(reader["pending_tasks_count"]);
                stats.PendingTasksLabel = "requires review";

                stats.RecentScansCount = Convert.ToInt32(reader["recent_scans_count"]);
                stats.RecentScansLabel = "OCR processed";
            }

            return stats;
        }

        private static List<AssignedMailItemDTO> GetAssignedMails(int superAgentId)
        {
            var list = new List<AssignedMailItemDTO>();

            using var conn = new NpgsqlConnection(clsSeting._connectionString);

            using var cmd = new NpgsqlCommand(@"
        SELECT
            c.id,
            c.reference,
            c.objet,
            COALESCE(c.expediteur, 'Not defined') AS expediteur,
            TO_CHAR(c.date_courrier, 'YYYY-MM-DD') AS date_courrier,
            c.statut
        FROM courrier c
        WHERE LOWER(c.type) = 'entrant'
          AND c.categorie_id IN (
              SELECT uca.categorie_id
              FROM user_categorie_access uca
              WHERE uca.user_id = @superAgentId
          )
        ORDER BY c.date_courrier DESC, c.created_at DESC
        LIMIT @limit;
    ", conn);

            cmd.Parameters.AddWithValue("@superAgentId", superAgentId);
            cmd.Parameters.AddWithValue("@limit", 5);

            conn.Open();

            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                list.Add(new AssignedMailItemDTO
                {
                    Id = Convert.ToInt32(reader["id"]),
                    Reference = reader["reference"].ToString() ?? "",
                    Objet = reader["objet"].ToString() ?? "",
                    Expediteur = reader["expediteur"].ToString() ?? "",
                    DateCourrier = reader["date_courrier"].ToString() ?? "",
                    Statut = reader["statut"].ToString() ?? ""
                });
            }

            return list;
        }

        private static List<RecentActivityItemDTO> GetRecentActivities(int superAgentId)
        {
            var list = new List<RecentActivityItemDTO>();

            using var conn = new NpgsqlConnection(clsSeting._connectionString);

            using var cmd = new NpgsqlCommand(@"
                SELECT *
                FROM (
                    SELECT
                        ('courrier-' || c.id)::TEXT AS id,
                        ('Mail ' || c.reference || ' created')::TEXT AS title,
                        'courrier'::TEXT AS type,
                        c.created_at AS created_at
                    FROM courrier c
                    WHERE c.categorie_id IN (
                        SELECT uca.categorie_id
                        FROM user_categorie_access uca
                        WHERE uca.user_id = @superAgentId
                    )

                    UNION ALL

                    SELECT
                        ('status-' || hs.id)::TEXT AS id,
                        ('Status of ' || c.reference || ' changed to ' || hs.nouveau_statut)::TEXT AS title,
                        'status'::TEXT AS type,
                        hs.changed_at AS created_at
                    FROM historique_statut hs
                    INNER JOIN courrier c ON c.id = hs.courrier_id
                    WHERE c.categorie_id IN (
                        SELECT uca.categorie_id
                        FROM user_categorie_access uca
                        WHERE uca.user_id = @superAgentId
                    )

                    UNION ALL

                    SELECT
                        ('ocr-' || o.id)::TEXT AS id,
                        ('OCR completed for ' || c.reference)::TEXT AS title,
                        'ocr'::TEXT AS type,
                        o.created_at AS created_at
                    FROM ocr_resultat o
                    INNER JOIN piece_jointe pj ON pj.id = o.piece_jointe_id
                    INNER JOIN courrier c ON c.id = pj.courrier_id
                    WHERE c.categorie_id IN (
                        SELECT uca.categorie_id
                        FROM user_categorie_access uca
                        WHERE uca.user_id = @superAgentId
                    )
                ) x
                ORDER BY x.created_at DESC
                LIMIT @limit;
            ", conn);

            cmd.Parameters.AddWithValue("@superAgentId", superAgentId);
            cmd.Parameters.AddWithValue("@limit", 8);

            conn.Open();

            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                var createdAt = Convert.ToDateTime(reader["created_at"]);

                list.Add(new RecentActivityItemDTO
                {
                    Id = reader["id"].ToString() ?? "",
                    Title = reader["title"].ToString() ?? "",
                    Type = reader["type"].ToString() ?? "",
                    TimeLabel = FormatRelativeTime(createdAt)
                });
            }

            return list;
        }

        private static List<RecentOcrResultItemDTO> GetRecentOcrResults(int superAgentId)
        {
            var list = new List<RecentOcrResultItemDTO>();

            using var conn = new NpgsqlConnection(clsSeting._connectionString);

            using var cmd = new NpgsqlCommand(@"
                SELECT
                    o.id AS ocr_resultat_id,
                    c.id AS courrier_id,
                    c.reference,
                    c.objet AS title,
                    LEFT(o.texte_extrait, 180) AS excerpt,
                    o.confiance AS confidence,
                    o.created_at
                FROM ocr_resultat o
                INNER JOIN piece_jointe pj ON pj.id = o.piece_jointe_id
                INNER JOIN courrier c ON c.id = pj.courrier_id
                WHERE c.categorie_id IN (
                    SELECT uca.categorie_id
                    FROM user_categorie_access uca
                    WHERE uca.user_id = @superAgentId
                )
                ORDER BY o.created_at DESC
                LIMIT @limit;
            ", conn);

            cmd.Parameters.AddWithValue("@superAgentId", superAgentId);
            cmd.Parameters.AddWithValue("@limit", 3);

            conn.Open();

            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                var createdAt = Convert.ToDateTime(reader["created_at"]);
                var courrierId = Convert.ToInt32(reader["courrier_id"]);

                list.Add(new RecentOcrResultItemDTO
                {
                    Id = courrierId,
                    OcrResultatId = Convert.ToInt32(reader["ocr_resultat_id"]),
                    Reference = reader["reference"].ToString() ?? "",
                    Title = reader["title"].ToString() ?? "",
                    Excerpt = reader["excerpt"].ToString() ?? "",
                    Confidence = Math.Round(Convert.ToDouble(reader["confidence"]), 2),
                    DateLabel = createdAt.ToString("dd MMM yyyy", CultureInfo.InvariantCulture)
                });
            }

            return list;
        }

        public static List<AgentOcrResultDTO> GetOcrResults(int superAgentId)
        {
            var list = new List<AgentOcrResultDTO>();

            using var conn = new NpgsqlConnection(clsSeting._connectionString);

            using var cmd = new NpgsqlCommand(@"
            SELECT
                o.id,
                o.piece_jointe_id,
                p.courrier_id,
                c.reference,
                c.objet,
                c.type,
                o.texte_extrait,
                o.confiance,
                o.created_at
            FROM ocr_resultat o
            INNER JOIN piece_jointe p ON p.id = o.piece_jointe_id
            INNER JOIN courrier c ON c.id = p.courrier_id
            WHERE c.categorie_id IN (
                SELECT uca.categorie_id
                FROM user_categorie_access uca
                WHERE uca.user_id = @superAgentId
            )
            ORDER BY o.created_at DESC;
        ", conn);

            cmd.Parameters.AddWithValue("@superAgentId", superAgentId);

            conn.Open();

            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                list.Add(new AgentOcrResultDTO
                {
                    Id = Convert.ToInt32(reader["id"]),
                    PieceJointeId = Convert.ToInt32(reader["piece_jointe_id"]),
                    CourrierId = Convert.ToInt32(reader["courrier_id"]),
                    Reference = reader["reference"].ToString() ?? "",
                    Objet = reader["objet"].ToString() ?? "",
                    Type = reader["type"].ToString() ?? "",
                    TexteExtrait = reader["texte_extrait"].ToString() ?? "",
                    Confidence = reader["confiance"] == DBNull.Value
                        ? 0
                        : Convert.ToDouble(reader["confiance"]),
                    CreatedAt = Convert.ToDateTime(reader["created_at"])
                });
            }

            return list;
        }

        private static string FormatRelativeTime(DateTime date)
        {
            var diff = DateTime.UtcNow - date.ToUniversalTime();

            if (diff.TotalMinutes < 1)
                return "just now";

            if (diff.TotalMinutes < 60)
                return $"{Math.Floor(diff.TotalMinutes)} min ago";

            if (diff.TotalHours < 24)
                return $"{Math.Floor(diff.TotalHours)} h ago";

            if (diff.TotalDays < 7)
                return $"{Math.Floor(diff.TotalDays)} days ago";

            return date.ToString("dd MMM yyyy", CultureInfo.InvariantCulture);
        }
    }
}
