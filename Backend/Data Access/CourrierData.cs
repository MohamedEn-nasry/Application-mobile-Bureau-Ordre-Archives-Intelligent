using Npgsql;
using System;
using System.Collections.Generic;
using System.Text;
using DTO.Courriers;


namespace Data_Access
{
    public class CourrierData
    {
        public static List<CourrierDTO> GetAllCourriers()
        {
            var list = new List<CourrierDTO>();

            using (var conn = new NpgsqlConnection(clsSeting._connectionString))
            using (var cmd = new NpgsqlCommand("SELECT * FROM sp_get_all_courriers()", conn))
            {
                conn.Open();

                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        list.Add(MapCourrier(reader));
                    }
                }
            }

            return list;
        }

        public static CourrierDTO? GetCourrierById(int id)
        {
            using (var conn = new NpgsqlConnection(clsSeting._connectionString))
            using (var cmd = new NpgsqlCommand("SELECT * FROM sp_get_courrier_by_id(@p_id)", conn))
            {
                cmd.Parameters.AddWithValue("@p_id", id);

                conn.Open();

                using (var reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                        return MapCourrier(reader);
                }
            }

            return null;
        }

        public static int AddCourrier(CourrierDTO courrier)
        {
            using (var conn = new NpgsqlConnection(clsSeting._connectionString))
            using (var cmd = new NpgsqlCommand(
                @"SELECT sp_add_courrier(
                    @p_reference,
                    @p_type,
                    @p_date_courrier,
                    @p_expediteur,
                    @p_destinataire,
                    @p_objet,
                    @p_description,
                    @p_statut,
                    @p_texte_ocr,
                    @p_categorie_id,
                    @p_auteur_id,
                    @p_assigne_a,
                    @p_date_echeance
                )", conn))
            {
                AddCourrierParameters(cmd, courrier);

                conn.Open();

                return Convert.ToInt32(cmd.ExecuteScalar());
            }
        }
        public static bool UpdateCourrier(CourrierDTO courrier)
        {
            using (var conn = new NpgsqlConnection(clsSeting._connectionString))
            using (var cmd = new NpgsqlCommand(
                @"SELECT sp_update_courrier(
                    @p_id,
                    @p_reference,
                    @p_type,
                    @p_date_courrier,
                    @p_expediteur,
                    @p_destinataire,
                    @p_objet,
                    @p_description,
                    @p_statut,
                    @p_texte_ocr,
                    @p_categorie_id,
                    @p_auteur_id,
                    @p_assigne_a,
                    @p_date_echeance
                )", conn))
            {
                cmd.Parameters.AddWithValue("@p_id", courrier.Id);
                AddCourrierParameters(cmd, courrier);

                conn.Open();

                return Convert.ToBoolean(cmd.ExecuteScalar());
            }
        }

        public static bool DeleteCourrier(int id)
        {
            using (var conn = new NpgsqlConnection(clsSeting._connectionString))
            using (var cmd = new NpgsqlCommand("SELECT sp_delete_courrier(@p_id)", conn))
            {
                cmd.Parameters.AddWithValue("@p_id", id);

                conn.Open();

                return Convert.ToBoolean(cmd.ExecuteScalar());
            }
        }

        public static List<CourrierDTO> GetCourriersByAssigneA(int userId)
        {
            var list = new List<CourrierDTO>();

            using (var conn = new NpgsqlConnection(clsSeting._connectionString))
            using (var cmd = new NpgsqlCommand("SELECT * FROM sp_get_courriers_by_assigne_a(@p_user_id)", conn))
            {
                cmd.Parameters.AddWithValue("@p_user_id", userId);

                conn.Open();

                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        list.Add(MapCourrier(reader));
                    }
                }
            }

            return list;
        }

        //public static bool UpdateCourrierStatut(int id, string statut)
        //{
        //    using (var conn = new NpgsqlConnection(clsSeting._connectionString))
        //    using (var cmd = new NpgsqlCommand("SELECT sp_update_courrier_statut(@p_id, @p_statut)", conn))
        //    {
        //        cmd.Parameters.AddWithValue("@p_id", id);
        //        cmd.Parameters.AddWithValue("@p_statut", statut);

        //        conn.Open();

        //        return Convert.ToBoolean(cmd.ExecuteScalar());
        //    }
        //}

        public static bool UpdateCourrierStatutWithHistory(
    int courrierId,
    string nouveauStatut,
    int? modifiePar,
    string? commentaire)
        {
            using var conn = new NpgsqlConnection(clsSeting._connectionString);

            using var cmd = new NpgsqlCommand(
                @"SELECT fn_courrier_update_statut_with_history(
            @courrierId,
            @nouveauStatut,
            @modifiePar,
            @commentaire
        );",
                conn
            );

            cmd.Parameters.AddWithValue("@courrierId", courrierId);
            cmd.Parameters.AddWithValue("@nouveauStatut", nouveauStatut);
            if (modifiePar.HasValue)
            {
                cmd.Parameters.AddWithValue("@modifiePar", modifiePar);
            } else {
                cmd.Parameters.AddWithValue("@modifiePar", DBNull.Value);
            }

            if (string.IsNullOrWhiteSpace(commentaire))
                cmd.Parameters.AddWithValue("@commentaire", DBNull.Value);
            else
                cmd.Parameters.AddWithValue("@commentaire", commentaire);

            conn.Open();

            var result = cmd.ExecuteScalar();

            return result != null && Convert.ToBoolean(result);
        }

        public static List<CourrierDTO> GetCourriersByAuteurId(int userId)
        {
            var list = new List<CourrierDTO>();

            using var conn = new NpgsqlConnection(clsSeting._connectionString);

            using var cmd = new NpgsqlCommand(@"
    SELECT * FROM get_courriers_by_auteur_id(@userId);
", conn);

            cmd.Parameters.AddWithValue("@userId", userId);

          

            conn.Open();

            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                list.Add(
                  MapCourrier(reader));
            }

            return list;
        }

        private static CourrierDTO MapCourrier(NpgsqlDataReader reader)
        {
            return new CourrierDTO(
                reader.GetInt32(reader.GetOrdinal("id")),
                reader["reference"].ToString(),
                reader["type"].ToString(),
                reader.GetDateTime(reader.GetOrdinal("date_courrier")),
                reader.IsDBNull(reader.GetOrdinal("expediteur")) ? null : reader["expediteur"].ToString(),
                reader.IsDBNull(reader.GetOrdinal("destinataire")) ? null : reader["destinataire"].ToString(),
                reader["objet"].ToString(),
                reader.IsDBNull(reader.GetOrdinal("description")) ? null : reader["description"].ToString(),
                reader["statut"].ToString(),
                reader.IsDBNull(reader.GetOrdinal("texte_ocr")) ? null : reader["texte_ocr"].ToString(),
                reader.IsDBNull(reader.GetOrdinal("categorie_id"))
                ? null
                : reader.GetInt32(reader.GetOrdinal("categorie_id")),
                reader.GetInt32(reader.GetOrdinal("auteur_id")),
                reader.IsDBNull(reader.GetOrdinal("assigne_a")) ? null : reader.GetInt32(reader.GetOrdinal("assigne_a")),
                reader.GetDateTime(reader.GetOrdinal("created_at")),
                reader.GetDateTime(reader.GetOrdinal("updated_at")),
                reader.IsDBNull(reader.GetOrdinal("date_echeance")) ? null : reader.GetDateTime(reader.GetOrdinal("date_echeance"))
            );
        }

        private static void AddCourrierParameters(NpgsqlCommand cmd, CourrierDTO courrier)
        {
            cmd.Parameters.AddWithValue("@p_reference", courrier.Reference);
            cmd.Parameters.AddWithValue("@p_type", courrier.Type);
            cmd.Parameters.AddWithValue("@p_date_courrier", courrier.DateCourrier);
            cmd.Parameters.AddWithValue("@p_expediteur", (object?)courrier.Expediteur ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@p_destinataire", (object?)courrier.Destinataire ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@p_objet", courrier.Objet);
            cmd.Parameters.AddWithValue("@p_description", (object?)courrier.Description ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@p_statut", courrier.Statut);
            cmd.Parameters.AddWithValue("@p_texte_ocr", (object?)courrier.TexteOcr ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@p_categorie_id", (object?)courrier.CategorieId ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@p_auteur_id", courrier.AuteurId);
            cmd.Parameters.AddWithValue("@p_assigne_a", (object?)courrier.AssigneA ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@p_date_echeance", (object?)courrier.DateEcheance ?? DBNull.Value);
        }

    }
}
