using DTO.Courriers;
using Microsoft.Data.SqlClient;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Text;


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


        public static List<CourrierDTO> GetCourriersForLecteurByCategories( int lecteurId, string? type = null,int? categorieId = null,string? search = null)
        {
                    var list = new List<CourrierDTO>();

                    using var conn = new NpgsqlConnection(clsSeting._connectionString);

                    using var cmd = new NpgsqlCommand(@"
                SELECT
                    c.id,
                    c.reference,
                    c.type,
                    c.date_courrier,
                    c.expediteur,
                    c.destinataire,
                    c.objet,
                    c.description,
                    c.statut,
                    c.texte_ocr,
                    c.categorie_id,
                    c.auteur_id,
                    c.assigne_a,
                    c.created_at,
                    c.updated_at,
                    c.date_echeance
                FROM courrier c
                WHERE c.categorie_id IN (
                    SELECT uca.categorie_id
                    FROM user_categorie_access uca
                    WHERE uca.user_id = @lecteurId
                )
                AND (
                    @type IS NULL
                    OR LOWER(c.type) = LOWER(@type)
                )
                AND (
                    @categorieId IS NULL
                    OR c.categorie_id = @categorieId
                )
                AND (
                    @search IS NULL
                    OR LOWER(c.reference) LIKE LOWER('%' || @search || '%')
                    OR LOWER(c.objet) LIKE LOWER('%' || @search || '%')
                    OR LOWER(COALESCE(c.expediteur, '')) LIKE LOWER('%' || @search || '%')
                    OR LOWER(COALESCE(c.destinataire, '')) LIKE LOWER('%' || @search || '%')
                )
                ORDER BY c.date_courrier DESC, c.created_at DESC;
            ", conn);

            cmd.Parameters.AddWithValue("@lecteurId", lecteurId);

            cmd.Parameters.AddWithValue(
                "@type",
                NpgsqlTypes.NpgsqlDbType.Text,
                (object?)type ?? DBNull.Value
            );

            cmd.Parameters.AddWithValue(
                "@categorieId",
                NpgsqlTypes.NpgsqlDbType.Integer,
                (object?)categorieId ?? DBNull.Value
            );

            cmd.Parameters.AddWithValue(
                "@search",
                NpgsqlTypes.NpgsqlDbType.Text,
                (object?)search ?? DBNull.Value
            );

            conn.Open();

                    using var reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {
                        list.Add(MapCourrier(reader
                            //new CourrierDTO(  
                            //Convert.ToInt32(reader["id"]),
                            //reader["reference"].ToString() ?? "",
                            //reader["type"].ToString() ?? "",
                            //Convert.ToDateTime(reader["date_courrier"]),
                            //reader["expediteur"] == DBNull.Value ? null : reader["expediteur"].ToString(),
                            //reader["destinataire"] == DBNull.Value ? null : reader["destinataire"].ToString(),
                            //reader["objet"].ToString() ?? "",
                            //reader["description"] == DBNull.Value ? null : reader["description"].ToString(),
                            //reader["statut"].ToString() ?? "",
                            //reader["texte_ocr"] == DBNull.Value ? null : reader["texte_ocr"].ToString(),
                            //Convert.ToInt32(reader["categorie_id"]),
                            //Convert.ToInt32(reader["auteur_id"]),
                            //reader["assigne_a"] == DBNull.Value ? null : Convert.ToInt32(reader["assigne_a"]),
                            //Convert.ToDateTime(reader["created_at"]),
                            //Convert.ToDateTime(reader["updated_at"]),
                            //reader["date_echeance"] == DBNull.Value ? null : Convert.ToDateTime(reader["date_echeance"])
                        ));
                    }

                    return list;
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

        public static bool UpdateCourrierStatutWithHistory( int courrierId,  string nouveauStatut,int? modifiePar, string? commentaire)
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


        public static List<CourrierDTO> GetCourriersByAssigneAOrAuteurId(int userId)
        {
            var list = new List<CourrierDTO>();

            using var conn = new NpgsqlConnection(clsSeting._connectionString);

            using var cmd = new NpgsqlCommand(@"
        SELECT *
        FROM courrier
        WHERE assigne_a = @p_user_id
           OR auteur_id = @p_user_id
        ORDER BY created_at DESC;
    ", conn);

            cmd.Parameters.AddWithValue("@p_user_id", userId);

            conn.Open();

            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                list.Add(MapCourrier(reader));
            }

            return list;
        }

        public static List<CourrierDTO> GetCourriersForSuperAgent(int userId)
        {
            var list = new List<CourrierDTO>();

            using var conn = new NpgsqlConnection(clsSeting._connectionString);

            using var cmd = new NpgsqlCommand(@"
        SELECT *
        FROM courrier
        WHERE categorie_id IN (
                    SELECT uca.categorie_id
                    FROM user_categorie_access uca
                    WHERE uca.user_id = @p_user_id)
        ORDER BY created_at DESC;
    ", conn);

            cmd.Parameters.AddWithValue("@p_user_id", userId);

            conn.Open();

            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                list.Add(MapCourrier(reader));
            }

            return list;
        }



    public static bool ReassignCourrier(int courrierId, int newAssigneA, int modifiedBy, string? commentaire, bool isAdmin, bool isSuperAgent)
    {

            using var conn = new NpgsqlConnection(clsSeting._connectionString);
            conn.Open();

            using var tx = conn.BeginTransaction();

            try
            {
                using var checkUserCmd = new NpgsqlCommand(@"
                SELECT COUNT(*)
                FROM users
                WHERE id = @userId
                  AND is_actif = TRUE;
            ", conn, tx);

                checkUserCmd.Parameters.AddWithValue("@userId", newAssigneA);

                var userExists = Convert.ToInt32(checkUserCmd.ExecuteScalar()) > 0;

                if (!userExists)
                {
                    tx.Rollback();
                    return false;
                }

                int? oldAssigneA = null;
                string currentStatus = string.Empty;

                using (var selectCmd = new NpgsqlCommand(@"
                SELECT assigne_a, statut
                FROM courrier
                WHERE id = @courrierId
                FOR UPDATE;
            ", conn, tx))
                {
                    selectCmd.Parameters.AddWithValue("@courrierId", courrierId);

                    using var reader = selectCmd.ExecuteReader();

                    if (!reader.Read())
                    {
                        tx.Rollback();
                        return false;
                    }

                    oldAssigneA = reader["assigne_a"] == DBNull.Value
                        ? null
                        : Convert.ToInt32(reader["assigne_a"]);

                    currentStatus = reader["statut"].ToString() ?? "";
                }

                using (var updateCmd = new NpgsqlCommand(@"
                UPDATE courrier
                SET assigne_a = @newAssigneA,
                    updated_at = NOW()
                WHERE id = @courrierId
                  AND (
                      @isAdmin = TRUE
                      OR 
                      (
                          @isSuperAgent = TRUE
                          AND EXISTS (SELECT 1 FROM user_categorie_access uca WHERE uca.user_id = @modifiedBy AND uca.categorie_id = courrier.categorie_id)
                          AND EXISTS (SELECT 1 FROM user_categorie_access uca2 WHERE uca2.user_id = @newAssigneA AND uca2.categorie_id = courrier.categorie_id)
                      )
                      OR
                      (
                          @isAdmin = FALSE AND @isSuperAgent = FALSE
                          AND assigne_a = @modifiedBy
                          AND EXISTS (SELECT 1 FROM user_categorie_access uca2 WHERE uca2.user_id = @newAssigneA AND uca2.categorie_id = courrier.categorie_id)
                      )
                  );
            ", conn, tx))
                {
                    updateCmd.Parameters.AddWithValue("@newAssigneA", newAssigneA);
                    updateCmd.Parameters.AddWithValue("@courrierId", courrierId);
                    updateCmd.Parameters.AddWithValue("@isAdmin", isAdmin);
                    updateCmd.Parameters.AddWithValue("@isSuperAgent", isSuperAgent);
                    updateCmd.Parameters.AddWithValue("@modifiedBy", modifiedBy);

                    int rowsAffected = updateCmd.ExecuteNonQuery();
                    if (rowsAffected == 0)
                    {
                        tx.Rollback();
                        return false;
                    }
                }

                var finalCommentaire =
                    $"Réassignation: ancien agent #{oldAssigneA?.ToString() ?? "aucun"} vers agent #{newAssigneA}";

                if (!string.IsNullOrWhiteSpace(commentaire))
                    finalCommentaire += $" - {commentaire.Trim()}";

                using (var historyCmd = new NpgsqlCommand(@"
                INSERT INTO historique_statut
                (
                    courrier_id,
                    ancien_statut,
                    nouveau_statut,
                    modifie_par,
                    commentaire,
                    changed_at
                )
                VALUES
                (
                    @courrierId,
                    @ancienStatut,
                    @nouveauStatut,
                    @modifiePar,
                    @commentaire,
                    NOW()
                );
            ", conn, tx))
                {
                    historyCmd.Parameters.AddWithValue("@courrierId", courrierId);
                    historyCmd.Parameters.AddWithValue("@ancienStatut", currentStatus);
                    historyCmd.Parameters.AddWithValue("@nouveauStatut", currentStatus);
                    historyCmd.Parameters.AddWithValue("@modifiePar", modifiedBy);
                    historyCmd.Parameters.AddWithValue("@commentaire", finalCommentaire);

                    historyCmd.ExecuteNonQuery();
                }

                tx.Commit();
                return true;
            }
            catch
            {
                tx.Rollback();
                throw;
            }
    }

    public static List<CourrierHistoryDTO> GetCourrierHistory(int courrierId)
    {
        var list = new List<CourrierHistoryDTO>();

        using var conn = new NpgsqlConnection(clsSeting._connectionString);

        using var cmd = new NpgsqlCommand(@"
        SELECT
            hs.id,
            hs.courrier_id,
            hs.ancien_statut,
            hs.nouveau_statut,
            hs.modifie_par,
            COALESCE(
                NULLIF(TRIM(u.firstname || ' ' || u.lastname), ''),
                u.email,
                'Utilisateur #' || hs.modifie_par
            ) AS modifie_par_nom,
            hs.commentaire,
            hs.changed_at
        FROM historique_statut hs
        LEFT JOIN users u ON u.id = hs.modifie_par
        WHERE hs.courrier_id = @courrierId
        ORDER BY hs.changed_at DESC;
    ", conn);

        cmd.Parameters.AddWithValue("@courrierId", courrierId);

        conn.Open();

        using var reader = cmd.ExecuteReader();

        while (reader.Read())
        {
            list.Add(new CourrierHistoryDTO
            {
                Id = Convert.ToInt32(reader["id"]),
                CourrierId = Convert.ToInt32(reader["courrier_id"]),
                AncienStatut = reader["ancien_statut"].ToString() ?? "",
                NouveauStatut = reader["nouveau_statut"].ToString() ?? "",
                ModifiePar = Convert.ToInt32(reader["modifie_par"]),
                ModifieParNom = reader["modifie_par_nom"].ToString() ?? "",
                Commentaire = reader["commentaire"] == DBNull.Value
                    ? null
                    : reader["commentaire"].ToString(),
                ChangedAt = Convert.ToDateTime(reader["changed_at"])
            });
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
