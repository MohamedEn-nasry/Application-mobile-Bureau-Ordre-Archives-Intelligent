using DTO.Notifications;

using Npgsql;

namespace Data_Access
{
    public class NotificationData
    {
        public static int AddNotification(NotificationDTO notification)
        {
            using (var conn = new NpgsqlConnection(clsSeting._connectionString))
            using (var cmd = new NpgsqlCommand(
                @"SELECT sp_add_notification(
                    @p_user_id,
                    @p_title,
                    @p_message,
                    @p_type,
                    @p_entity_type,
                    @p_entity_id,
                    @p_created_by
                )", conn))
            {
                cmd.Parameters.AddWithValue("@p_user_id", notification.UserId);
                cmd.Parameters.AddWithValue("@p_title", notification.Title);
                cmd.Parameters.AddWithValue("@p_message", notification.Message);
                cmd.Parameters.AddWithValue("@p_type", notification.Type);
                cmd.Parameters.AddWithValue("@p_entity_type", (object?)notification.EntityType ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@p_entity_id", (object?)notification.EntityId ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@p_created_by", (object?)notification.CreatedBy ?? DBNull.Value);

                conn.Open();

                return Convert.ToInt32(cmd.ExecuteScalar());
            }
        }

        public static List<NotificationDTO> GetNotificationsByUser(int userId, bool onlyUnread)
        {
            var list = new List<NotificationDTO>();

            using (var conn = new NpgsqlConnection(clsSeting._connectionString))
            using (var cmd = new NpgsqlCommand(
                @"SELECT * FROM sp_get_notifications_by_user(
                    @p_user_id,
                    @p_only_unread
                )", conn))
            {
                cmd.Parameters.AddWithValue("@p_user_id", userId);
                cmd.Parameters.AddWithValue("@p_only_unread", onlyUnread);

                conn.Open();

                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        list.Add(MapNotification(reader));
                    }
                }
            }

            return list;
        }

        public static int GetUnreadNotificationsCount(int userId)
        {
            using (var conn = new NpgsqlConnection(clsSeting._connectionString))
            using (var cmd = new NpgsqlCommand(
                "SELECT sp_get_unread_notifications_count(@p_user_id)", conn))
            {
                cmd.Parameters.AddWithValue("@p_user_id", userId);

                conn.Open();

                return Convert.ToInt32(cmd.ExecuteScalar());
            }
        }

        public static bool MarkAsRead(int id, int userId)
        {
            using (var conn = new NpgsqlConnection(clsSeting._connectionString))
            using (var cmd = new NpgsqlCommand(
                "SELECT sp_mark_notification_as_read(@p_id, @p_user_id)", conn))
            {
                cmd.Parameters.AddWithValue("@p_id", id);
                cmd.Parameters.AddWithValue("@p_user_id", userId);

                conn.Open();

                return Convert.ToBoolean(cmd.ExecuteScalar());
            }
        }

        public static bool MarkAllAsRead(int userId)
        {
            using (var conn = new NpgsqlConnection(clsSeting._connectionString))
            using (var cmd = new NpgsqlCommand(
                "SELECT sp_mark_all_notifications_as_read(@p_user_id)", conn))
            {
                cmd.Parameters.AddWithValue("@p_user_id", userId);

                conn.Open();

                return Convert.ToBoolean(cmd.ExecuteScalar());
            }
        }

        public static bool DeleteNotification(int id, int userId)
        {
            using (var conn = new NpgsqlConnection(clsSeting._connectionString))
            using (var cmd = new NpgsqlCommand(
                "SELECT sp_delete_notification(@p_id, @p_user_id)", conn))
            {
                cmd.Parameters.AddWithValue("@p_id", id);
                cmd.Parameters.AddWithValue("@p_user_id", userId);

                conn.Open();

                return Convert.ToBoolean(cmd.ExecuteScalar());
            }
        }

     
        public static List<NotificationDTO> GetLecteurOrSuperAgentNotificationsByCategorie(int categorieId, bool onlyUnread = false)
        {
            var list = new List<NotificationDTO>();

            using (
                var conn =
                    new NpgsqlConnection(clsSeting._connectionString)
            )
            {
                string query = @"
                    SELECT
                        n.id, n.user_id, n.title, n.message, n.type, n.entity_type, n.entity_id, n.is_read, n.created_by, n.created_at, n.read_at
                    FROM notifications n
                    INNER JOIN courrier c
                        ON n.entity_id = c.id
                    WHERE
                        n.entity_type = 'Courrier'
                        AND c.categorie_id = @p_categorie_id";

                if (onlyUnread)
                {
                    query += " AND n.is_read = FALSE";
                }

                query += " ORDER BY n.created_at DESC";

                using (
                    var cmd = new NpgsqlCommand(query, conn)
                )
                {
                    cmd.Parameters.AddWithValue(
                        "@p_categorie_id",
                        categorieId
                    );

                    conn.Open();

                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            list.Add(MapNotification(reader));
                        }
                    }
                }
            }

            return list;
        }

       
    public static int getCategorieIdForUser(int userId)
        {
            using (var conn = new NpgsqlConnection(clsSeting._connectionString))
            using (var cmd = new NpgsqlCommand(
                "SELECT categorie_id FROM user_categorie_access WHERE user_id = @p_user_id", conn))
            {
                cmd.Parameters.AddWithValue("@p_user_id", userId);
                conn.Open();
                var resultVal = cmd.ExecuteScalar();
                if (resultVal != null && resultVal != DBNull.Value)
                {
                    return Convert.ToInt32(resultVal);
                }
                else
                {
                    throw new Exception("Aucune catégorie d'accès trouvée pour l'utilisateur.");
                }
            }
        }



        private static NotificationDTO MapNotification(NpgsqlDataReader reader)
        {
            return new NotificationDTO(
                reader.GetInt32(reader.GetOrdinal("id")),
                reader.GetInt32(reader.GetOrdinal("user_id")),
                reader["title"].ToString() ?? string.Empty,
                reader["message"].ToString() ?? string.Empty,
                reader["type"].ToString() ?? string.Empty,
                reader.IsDBNull(reader.GetOrdinal("entity_type")) ? null : reader["entity_type"].ToString(),
                reader.IsDBNull(reader.GetOrdinal("entity_id")) ? null : reader.GetInt32(reader.GetOrdinal("entity_id")),
                reader.GetBoolean(reader.GetOrdinal("is_read")),
                reader.IsDBNull(reader.GetOrdinal("created_by")) ? null : reader.GetInt32(reader.GetOrdinal("created_by")),
                reader.GetDateTime(reader.GetOrdinal("created_at")),
                reader.IsDBNull(reader.GetOrdinal("read_at")) ? null : reader.GetDateTime(reader.GetOrdinal("read_at"))
            );
        }
    }
}