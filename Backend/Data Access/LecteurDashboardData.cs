using DTO.LecteurDashboard;
using Npgsql;

namespace Data_Access
{
    public class LecteurDashboardData
    {
        public static LecteurDashboardOverviewDTO GetOverview(int lecteurId)
        {
            var dto = new LecteurDashboardOverviewDTO();

            using var conn = new NpgsqlConnection(clsSeting._connectionString);
            conn.Open();

            dto.IncomingCount = ExecuteInt(conn, @"
                SELECT COUNT(*)::INT
                FROM courrier
                WHERE LOWER(type) = 'entrant'
                  AND categorie_id IN (
                        SELECT categorie_id
                        FROM user_categorie_access
                        WHERE user_id = @userId
                  );
            ", lecteurId);

            dto.OutgoingCount = ExecuteInt(conn, @"
                SELECT COUNT(*)::INT
                FROM courrier
                WHERE LOWER(type) = 'sortant'
                  AND categorie_id IN (
                        SELECT categorie_id
                        FROM user_categorie_access
                        WHERE user_id = @userId
                  );
            ", lecteurId);

            dto.ArchivedCount = ExecuteInt(conn, @"
                SELECT COUNT(*)::INT
                FROM courrier
                WHERE LOWER(COALESCE(statut, '')) IN ('archive', 'archivé', 'archived')
                  AND categorie_id IN (
                        SELECT categorie_id
                        FROM user_categorie_access
                        WHERE user_id = @userId
                  );
            ", lecteurId);

            dto.UnreadNotifications = ExecuteInt(conn, @"
                SELECT COUNT(*)::INT
                FROM notifications n
                INNER JOIN courrier c
                    ON c.id = n.entity_id
                WHERE  n.is_read = FALSE
                  AND LOWER(n.entity_type) = 'courrier'
                  AND c.categorie_id IN (
                        SELECT categorie_id
                        FROM user_categorie_access
                        WHERE user_id = @userId
                  );
            ", lecteurId);

            dto.WeeklyCourriers = ExecuteInt(conn, @"
                SELECT COUNT(*)::INT
                FROM courrier
                WHERE created_at >= NOW() - INTERVAL '7 days'
                  AND categorie_id IN (
                        SELECT categorie_id
                        FROM user_categorie_access
                        WHERE user_id = @userId
                  );
            ", lecteurId);

            dto.WeeklyArchives = ExecuteInt(conn, @"
                SELECT COUNT(*)::INT
                FROM courrier
                WHERE LOWER(COALESCE(statut, '')) IN ('archive', 'archivé', 'archived')
                  AND updated_at >= NOW() - INTERVAL '7 days'
                  AND categorie_id IN (
                        SELECT categorie_id
                        FROM user_categorie_access
                        WHERE user_id = @userId
                  );
            ", lecteurId);

            dto.RecentDocuments = GetRecentDocuments(conn, lecteurId);

            dto.RecentUpdates = GetRecentUpdates(conn, lecteurId);

            dto.LastUpdatedAt = GetLastUpdatedAt(conn, lecteurId);

            return dto;
        }

        private static int ExecuteInt(
            NpgsqlConnection conn,
            string sql,
            int? userId = null)
        {
            using var cmd = new NpgsqlCommand(sql, conn);

            if (userId.HasValue)
                cmd.Parameters.AddWithValue("@userId", userId.Value);

            var result = cmd.ExecuteScalar();

            return result == null || result == DBNull.Value
                ? 0
                : Convert.ToInt32(result);
        }

        private static List<LecteurRecentDocumentDTO> GetRecentDocuments(
            NpgsqlConnection conn,
            int userId)
        {
            var list = new List<LecteurRecentDocumentDTO>();

            using var cmd = new NpgsqlCommand(@"
                SELECT
                    id,
                    reference,
                    objet,
                    type,
                    COALESCE(expediteur, destinataire, '') AS source,
                    COALESCE(statut, '') AS statut,
                    date_courrier::TEXT AS date_courrier
                FROM courrier
                WHERE categorie_id IN (
                    SELECT categorie_id
                    FROM user_categorie_access
                    WHERE user_id = @userId
                )
                ORDER BY created_at DESC
                LIMIT 5;
            ", conn);

            cmd.Parameters.AddWithValue("@userId", userId);

            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                list.Add(new LecteurRecentDocumentDTO
                {
                    Id = Convert.ToInt32(reader["id"]),
                    Reference = reader["reference"].ToString() ?? "",
                    Objet = reader["objet"].ToString() ?? "",
                    Type = reader["type"].ToString() ?? "",
                    Source = reader["source"].ToString() ?? "",
                    Statut = reader["statut"].ToString() ?? "",
                    DateCourrier = reader["date_courrier"].ToString() ?? ""
                });
            }

            return list;
        }

        private static List<LecteurUpdateDTO> GetRecentUpdates(
            NpgsqlConnection conn,
            int userId)
        {
            var list = new List<LecteurUpdateDTO>();

            using var cmd = new NpgsqlCommand(@"
                SELECT *
                FROM (
                    SELECT
                        ('courrier-' || c.id)::TEXT AS id,
                        'Nouveau courrier disponible'::TEXT AS title,
                        ('Le courrier ' || c.reference || ' a été ajouté.')::TEXT AS message,
                        c.created_at AS created_at,
                        'courrier'::TEXT AS type
                    FROM courrier c
                    WHERE c.categorie_id IN (
                        SELECT categorie_id
                        FROM user_categorie_access
                        WHERE user_id = @userId
                    )

                    UNION ALL

                    SELECT
                        ('status-' || hs.id)::TEXT AS id,
                        'Statut mis à jour'::TEXT AS title,
                        ('Le courrier ' || c.reference || ' est maintenant ' || hs.nouveau_statut || '.')::TEXT AS message,
                        hs.changed_at AS created_at,
                        'status'::TEXT AS type
                    FROM historique_statut hs
                    INNER JOIN courrier c
                        ON c.id = hs.courrier_id
                    WHERE c.categorie_id IN (
                        SELECT categorie_id
                        FROM user_categorie_access
                        WHERE user_id = @userId
                    )
                ) x
                ORDER BY created_at DESC
                LIMIT 5;
            ", conn);

            cmd.Parameters.AddWithValue("@userId", userId);

            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                var createdAt = Convert.ToDateTime(reader["created_at"]);

                list.Add(new LecteurUpdateDTO
                {
                    Id = reader["id"].ToString() ?? "",
                    Title = reader["title"].ToString() ?? "",
                    Message = reader["message"].ToString() ?? "",
                    Type = reader["type"].ToString() ?? "",
                    DateLabel = createdAt.ToString("dd MMM")
                });
            }

            return list;
        }

        private static string GetLastUpdatedAt(
            NpgsqlConnection conn,
            int userId)
        {
            using var cmd = new NpgsqlCommand(@"
                SELECT COALESCE(MAX(updated_at), MAX(created_at))
                FROM courrier
                WHERE categorie_id IN (
                    SELECT categorie_id
                    FROM user_categorie_access
                    WHERE user_id = @userId
                );
            ", conn);

            cmd.Parameters.AddWithValue("@userId", userId);

            var result = cmd.ExecuteScalar();

            if (result == null || result == DBNull.Value)
                return "";

            return Convert
                .ToDateTime(result)
                .ToString("dd MMM yyyy à HH:mm");
        }
    }
}