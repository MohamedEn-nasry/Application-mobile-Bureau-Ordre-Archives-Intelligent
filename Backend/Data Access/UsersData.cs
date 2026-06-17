using System;
using System.Collections.Generic;
using Npgsql;
using DTO.Users;

namespace Data_Access
{
    public class UsersData
    {
        public static List<UserDTO> GetAllUsers()
        {
            var usersList = new List<UserDTO>();

            using (var conn = new NpgsqlConnection(clsSeting._connectionString))
            {
                conn.Open();

                using (var cmd = new NpgsqlCommand("SELECT * FROM sp_get_all_users()", conn))
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        usersList.Add(new UserDTO(
                            reader.GetInt32(reader.GetOrdinal("id")),
                            reader["firstname"].ToString(),
                            reader["lastname"].ToString(),
                            reader["email"].ToString(),
                            reader.IsDBNull(reader.GetOrdinal("password_hash"))
                                ? null
                                : reader["password_hash"].ToString(),
                            reader["role_name"].ToString(),
                            reader.GetBoolean(reader.GetOrdinal("isactif")),
                            reader.GetDateTime(reader.GetOrdinal("created_at")),
                            reader.GetDateTime(reader.GetOrdinal("updated_at")),
                            reader.IsDBNull(reader.GetOrdinal("image_path"))
                                ? null
                                : reader["image_path"].ToString()
                        ));
                    }
                }

                // Batch load category mappings
                var categoryMappings = new Dictionary<int, int>();
                using (var cmdCat = new NpgsqlCommand("SELECT user_id, categorie_id FROM user_categorie_access", conn))
                using (var readerCat = cmdCat.ExecuteReader())
                {
                    while (readerCat.Read())
                    {
                        int userId = readerCat.GetInt32(0);
                        int catId = readerCat.GetInt32(1);
                        categoryMappings[userId] = catId;
                    }
                }

                foreach (var user in usersList)
                {
                    if (categoryMappings.TryGetValue(user.Id, out int catId))
                    {
                        user.CategorieId = catId;
                    }
                }
            }

            return usersList;
        }

        public static List<UserDTO> GetActiveUsers()
        {
            var usersList = new List<UserDTO>();

            using (var conn = new NpgsqlConnection(clsSeting._connectionString))
            using (var cmd = new NpgsqlCommand("SELECT * FROM sp_get_active_users()", conn))
            {
                conn.Open();

                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        usersList.Add(new UserDTO(
                            reader.GetInt32(reader.GetOrdinal("id")),
                            reader["firstname"].ToString(),
                            reader["lastname"].ToString(),
                            reader["email"].ToString(),
                            reader["password_hash"].ToString(),
                            reader["role_name"].ToString(),
                            reader.GetBoolean(reader.GetOrdinal("isactif")),
                            reader.GetDateTime(reader.GetOrdinal("created_at")),
                            reader.GetDateTime(reader.GetOrdinal("updated_at")),
                            reader.IsDBNull(reader.GetOrdinal("image_path"))
                                ? null
                                : reader["image_path"].ToString()
                        ));
                    }
                }
            }

            return usersList;
        }

        public static int GetActiveUsersCount()
        {
            int count = 0;

            using (var conn = new NpgsqlConnection(clsSeting._connectionString))
            using (var cmd = new NpgsqlCommand("SELECT sp_get_active_users_count()", conn))
            {
                conn.Open();

                object result = cmd.ExecuteScalar();
                if (result != DBNull.Value && result != null)
                    count = Convert.ToInt32(result);
            }

            return count;
        }

        public static UserDTO GetUserById(int userId)
        {
            UserDTO user = null;

            using (var conn = new NpgsqlConnection(clsSeting._connectionString))
            {
                conn.Open();

                using (var cmd = new NpgsqlCommand("SELECT * FROM sp_get_user_by_id(@p_user_id)", conn))
                {
                    cmd.Parameters.AddWithValue("p_user_id", userId);

                    using (var reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            user = new UserDTO(
                                reader.GetInt32(reader.GetOrdinal("id")),
                                reader["firstname"].ToString(),
                                reader["lastname"].ToString(),
                                reader["email"].ToString(),
                                reader.IsDBNull(reader.GetOrdinal("password_hash")) ? null : reader["password_hash"].ToString(),
                                reader["role_name"].ToString(),
                                reader.GetBoolean(reader.GetOrdinal("isactif")),
                                reader.GetDateTime(reader.GetOrdinal("created_at")),
                                reader.GetDateTime(reader.GetOrdinal("updated_at")),
                                reader.IsDBNull(reader.GetOrdinal("image_path"))
                                    ? null
                                    : reader["image_path"].ToString()
                            )
                            {
                                RefreshTokenHash = reader.IsDBNull(reader.GetOrdinal("refresh_token_hash")) ? null : reader["refresh_token_hash"].ToString(),
                                RefreshTokenExpiresAt = reader.IsDBNull(reader.GetOrdinal("refresh_token_expires_at")) ? null : (DateTime?)reader.GetDateTime(reader.GetOrdinal("refresh_token_expires_at")),
                                RefreshTokenRevokedAt = reader.IsDBNull(reader.GetOrdinal("refresh_token_revoked_at")) ? null : (DateTime?)reader.GetDateTime(reader.GetOrdinal("refresh_token_revoked_at"))
                            };
                        }
                    }
                }

                if (user != null)
                {
                    using (var cmdCat = new NpgsqlCommand("SELECT categorie_id FROM user_categorie_access WHERE user_id = @p_user_id", conn))
                    {
                        cmdCat.Parameters.AddWithValue("p_user_id", userId);
                        var catResult = cmdCat.ExecuteScalar();
                        if (catResult != null && catResult != DBNull.Value)
                        {
                            user.CategorieId = Convert.ToInt32(catResult);
                        }
                    }
                }
            }

            return user;
        }

        public static UserDTO GetUserByEmail(string email)
        {
            using (var conn = new NpgsqlConnection(clsSeting._connectionString))
            using (var cmd = new NpgsqlCommand("SELECT * FROM sp_get_user_by_email(@p_email)", conn))
            {
                cmd.Parameters.AddWithValue("p_email", email);
                conn.Open();
                using (var reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        return new UserDTO(
                            reader.GetInt32(reader.GetOrdinal("id")),
                            reader["firstname"].ToString(),
                            reader["lastname"].ToString(),
                            reader["email"].ToString(),
                            reader["password_hash"].ToString(),
                            reader["role_name"].ToString(),
                            reader.GetBoolean(reader.GetOrdinal("isactif")),
                            reader.GetDateTime(reader.GetOrdinal("created_at")),
                            reader.GetDateTime(reader.GetOrdinal("updated_at")),
                            reader.IsDBNull(reader.GetOrdinal("image_path"))
                                ? ""
                                : reader["image_path"].ToString()
                        )
                        {
                            RefreshTokenHash = reader.IsDBNull(reader.GetOrdinal("refresh_token_hash")) ? null : reader["refresh_token_hash"].ToString(),
                            RefreshTokenExpiresAt = reader.IsDBNull(reader.GetOrdinal("refresh_token_expires_at")) ? null : (DateTime?)reader.GetDateTime(reader.GetOrdinal("refresh_token_expires_at")),
                            RefreshTokenRevokedAt = reader.IsDBNull(reader.GetOrdinal("refresh_token_revoked_at")) ? null : (DateTime?)reader.GetDateTime(reader.GetOrdinal("refresh_token_revoked_at"))
                        };
                    }
                    else
                    {
                        return null;
                    }
                }
            }
        }

        public static int AddUser(UserDTO userDTO)
        {
            using (var conn = new NpgsqlConnection(clsSeting._connectionString))
            using (var cmd = new NpgsqlCommand(
                @"SELECT sp_add_user(
                    @p_firstname,
                    @p_lastname,
                    @p_email,
                    @p_password_hash,
                    @p_role_name,
                    @p_isactif,
                    @p_image_path
                )", conn))
            {
                cmd.Parameters.AddWithValue("p_firstname", userDTO.Firstname);
                cmd.Parameters.AddWithValue("p_lastname", userDTO.Lastname);
                cmd.Parameters.AddWithValue("p_email", userDTO.Email);
                cmd.Parameters.AddWithValue("p_password_hash", userDTO.Password);
                cmd.Parameters.AddWithValue("p_role_name", userDTO.RoleName);
                cmd.Parameters.AddWithValue("p_isactif", userDTO.IsActif);
                cmd.Parameters.AddWithValue("p_image_path", (object?)userDTO.ImagePath ?? DBNull.Value);

                conn.Open();

                return Convert.ToInt32(cmd.ExecuteScalar());
            }
        }

        public static bool DeleteUser(int userId)
        {
            using (var conn = new NpgsqlConnection(clsSeting._connectionString))
            using (var cmd = new NpgsqlCommand("SELECT sp_delete_user(@p_user_id)", conn))
            {
                cmd.Parameters.AddWithValue("p_user_id", userId);

                conn.Open();

                int rowsAffected = Convert.ToInt32(cmd.ExecuteScalar());
                return rowsAffected == 1;
            }
        }

        public static bool UpdateUser(UserDTO userDTO)
        {
            using (var conn = new NpgsqlConnection(clsSeting._connectionString))
            using (var cmd = new NpgsqlCommand(
                @"CALL sp_update_user(
                    @p_user_id,
                    @p_firstname,
                    @p_lastname,
                    @p_email,
                    @p_password_hash,
                    @p_role_name,
                    @p_isactif,
                    @p_image_path,
                    @p_refresh_token_hash,
                    @p_refresh_token_expires_at,
                    @p_refresh_token_revoked_at
                )", conn))
            {
                cmd.Parameters.AddWithValue("p_user_id", userDTO.Id);
                cmd.Parameters.AddWithValue("p_firstname", userDTO.Firstname);
                cmd.Parameters.AddWithValue("p_lastname", userDTO.Lastname);
                cmd.Parameters.AddWithValue("p_email", userDTO.Email);
                cmd.Parameters.AddWithValue(
                                         "p_password_hash",
                                         string.IsNullOrWhiteSpace(userDTO.Password)
                                             ? DBNull.Value
                                             : userDTO.Password
                                     );
                cmd.Parameters.AddWithValue("p_role_name", userDTO.RoleName);
                cmd.Parameters.AddWithValue("p_isactif", userDTO.IsActif);
                cmd.Parameters.AddWithValue("p_image_path", (object?)userDTO.ImagePath ?? DBNull.Value);
                cmd.Parameters.AddWithValue("p_refresh_token_hash", (object?)userDTO.RefreshTokenHash ?? DBNull.Value);
                cmd.Parameters.AddWithValue("p_refresh_token_expires_at", (object?)userDTO.RefreshTokenExpiresAt ?? DBNull.Value);
                cmd.Parameters.AddWithValue("p_refresh_token_revoked_at", (object?)userDTO.RefreshTokenRevokedAt ?? DBNull.Value);

                conn.Open();
                cmd.ExecuteNonQuery();

                return true;
            }
        }




        public static void UpdateRefreshToken(int userId, string tokenHash, DateTime expiresAt, DateTime? revokedAt = null)
        {
            using var conn = new NpgsqlConnection(clsSeting._connectionString);
            using var cmd = new NpgsqlCommand(
                "CALL sp_update_refresh_token(@p_user_id, @p_hash, @p_expires, @p_revoked)", conn);

            cmd.Parameters.AddWithValue("p_user_id", userId);
            cmd.Parameters.AddWithValue("p_hash", tokenHash);

            // تحويل إلى Unspecified لتجنب "timestamp with time zone"
            cmd.Parameters.Add(new NpgsqlParameter("p_expires", NpgsqlTypes.NpgsqlDbType.Timestamp)
            { Value = DateTime.SpecifyKind(expiresAt, DateTimeKind.Unspecified) });

            cmd.Parameters.Add(new NpgsqlParameter("p_revoked", NpgsqlTypes.NpgsqlDbType.Timestamp)
            {
                Value = revokedAt.HasValue
                    ? DateTime.SpecifyKind(revokedAt.Value, DateTimeKind.Unspecified)
                    : DBNull.Value
            });

            conn.Open();
            cmd.ExecuteNonQuery();
        }



        public static List<UserEmailLookupDTO> SearchUsersByEmail(string email, int limit = 8)
        {
            var list = new List<UserEmailLookupDTO>();

            using var conn = new NpgsqlConnection(clsSeting._connectionString);

            using var cmd = new NpgsqlCommand(@"
       SELECT
            u.id,
            u.firstname,
            u.lastname,
            u.email,
            COALESCE(r.nom, '') AS role_name
        FROM users u
        LEFT JOIN roles r ON r.id = u.role_id
        WHERE u.isactif = TRUE
          AND LOWER(u.email) LIKE LOWER(@emailPattern)
        ORDER BY u.email
        LIMIT @limit;
    ", conn);

            cmd.Parameters.AddWithValue("@emailPattern", $"%{email}%");
            cmd.Parameters.AddWithValue("@limit", limit);

            conn.Open();

            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                list.Add(new UserEmailLookupDTO
                {
                    Id = Convert.ToInt32(reader["id"]),
                    Firstname = reader["firstname"].ToString() ?? "",
                    Lastname = reader["lastname"].ToString() ?? "",
                    Email = reader["email"].ToString() ?? "",
                    RoleName = reader["role_name"].ToString() ?? ""
                });
            }

            return list;
        }

        //public static bool AssignLecteurOrSuperAgentCategory(int userId, int categorieId)
        //{
        //    using var conn = new NpgsqlConnection(clsSeting._connectionString);
        //    using var cmd = new NpgsqlCommand(@"
        //        DELETE FROM user_categorie_access WHERE user_id = @p_user_id;
        //        INSERT INTO user_categorie_access (user_id, categorie_id) VALUES (@p_user_id, @p_categorie_id);
        //    ", conn);

        //    cmd.Parameters.AddWithValue("p_user_id", userId);
        //    cmd.Parameters.AddWithValue("p_categorie_id", categorieId);

        //    conn.Open();
        //    int rows = cmd.ExecuteNonQuery();
        //    return rows > 0;
        //}

        public static bool AssignLecteurOrSuperAgentCategory(int userId, int categorieId)
        {
            using var conn = new NpgsqlConnection(clsSeting._connectionString);
            conn.Open();

            using var transaction = conn.BeginTransaction();

            try
            {
                using var cmdDelete = new NpgsqlCommand(
                    "DELETE FROM user_categorie_access WHERE user_id = @p_user_id", conn, transaction);
                cmdDelete.Parameters.AddWithValue("p_user_id", userId);
                cmdDelete.ExecuteNonQuery();

                using var cmdInsert = new NpgsqlCommand(
                    "INSERT INTO user_categorie_access (user_id, categorie_id) VALUES (@p_user_id, @p_categorie_id)", conn, transaction);
                cmdInsert.Parameters.AddWithValue("p_user_id", userId);
                cmdInsert.Parameters.AddWithValue("p_categorie_id", categorieId);
                int rows = cmdInsert.ExecuteNonQuery();

                transaction.Commit();
                return rows > 0;
            }
            catch
            {
                transaction.Rollback();
                return false;
            }
        }
    }
    }
