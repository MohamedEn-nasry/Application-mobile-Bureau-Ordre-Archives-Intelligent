using Npgsql;
using DTO.PiecesJointes;

namespace Data_Access
{
    public class PieceJointeData
    {
        public static int Add(PieceJointeDTO dto)
        {
            using var conn = new NpgsqlConnection(clsSeting._connectionString);

            using var cmd = new NpgsqlCommand(
                @"SELECT fn_piece_jointe_add(
                    @courrierId,
                    @nomFichier,
                    @typeFichier,
                    @cheminFichier,
                    @format,
                    @taille,
                    @estScan
                );",
                conn
            );

            cmd.Parameters.AddWithValue("@courrierId", dto.CourrierId);
            cmd.Parameters.AddWithValue("@nomFichier", dto.NomFichier);
            cmd.Parameters.AddWithValue("@typeFichier", dto.TypeFichier);
            cmd.Parameters.AddWithValue("@cheminFichier", dto.CheminFichier);
            cmd.Parameters.AddWithValue("@format", dto.Format);
            cmd.Parameters.AddWithValue("@taille", dto.Taille);
            cmd.Parameters.AddWithValue("@estScan", dto.EstScan);

            conn.Open();

            var result = cmd.ExecuteScalar();

            return result == null ? -1 : Convert.ToInt32(result);
        }

        public static List<PieceJointeDTO> GetByCourrierId(int courrierId)
        {
            var list = new List<PieceJointeDTO>();

            using var conn = new NpgsqlConnection(clsSeting._connectionString);

            using var cmd = new NpgsqlCommand(
                "SELECT * FROM fn_piece_jointe_get_by_courrier_id(@courrierId);",
                conn
            );

            cmd.Parameters.AddWithValue("@courrierId", courrierId);

            conn.Open();

            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                list.Add(Map(reader));
            }

            return list;
        }

        public static PieceJointeDTO? GetById(int id)
        {
            using var conn = new NpgsqlConnection(clsSeting._connectionString);

            using var cmd = new NpgsqlCommand(
                "SELECT * FROM fn_piece_jointe_get_by_id(@id);",
                conn
            );

            cmd.Parameters.AddWithValue("@id", id);

            conn.Open();

            using var reader = cmd.ExecuteReader();

            if (reader.Read())
                return Map(reader);

            return null;
        }

        public static bool Delete(int id)
        {
            using var conn = new NpgsqlConnection(clsSeting._connectionString);

            using var cmd = new NpgsqlCommand(
                "SELECT fn_piece_jointe_delete(@id);",
                conn
            );

            cmd.Parameters.AddWithValue("@id", id);

            conn.Open();

            var result = cmd.ExecuteScalar();

            return result != null && Convert.ToBoolean(result);
        }

        public static ConfirmOcrResponseDTO? ConfirmOcr(
            int pieceJointeId,
            int courrierId,
            string texteOcr,
            double ocrConfiance,
            bool corrigeManuellement,
            int? categorieId,
            double scoreConfiance,
            string methode,
            int? valideePar)
        {
            using var conn = new NpgsqlConnection(clsSeting._connectionString);

            using var cmd = new NpgsqlCommand(
                @"SELECT * FROM fn_piece_jointe_confirm_ocr(
            @pieceJointeId,
            @courrierId,
            @texteOcr,
            @ocrConfiance,
            @corrigeManuellement,
            @categorieId,
            @scoreConfiance,
            @methode,
            @valideePar
        );",
                conn
            );

            cmd.Parameters.AddWithValue("@pieceJointeId", pieceJointeId);
            cmd.Parameters.AddWithValue("@courrierId", courrierId);
            cmd.Parameters.AddWithValue("@texteOcr", texteOcr);
            cmd.Parameters.AddWithValue("@ocrConfiance", ocrConfiance);
            cmd.Parameters.AddWithValue("@corrigeManuellement", corrigeManuellement);

            if (categorieId.HasValue)
                cmd.Parameters.AddWithValue("@categorieId", categorieId.Value);
            else
                cmd.Parameters.AddWithValue("@categorieId", DBNull.Value);

            cmd.Parameters.AddWithValue("@scoreConfiance", scoreConfiance);
            cmd.Parameters.AddWithValue("@methode", string.IsNullOrWhiteSpace(methode) ? "OCR_RULE_BASED" : methode);

            if (valideePar.HasValue)
                cmd.Parameters.AddWithValue("@valideePar", valideePar.Value);
            else
                cmd.Parameters.AddWithValue("@valideePar", DBNull.Value);

            conn.Open();

            using var reader = cmd.ExecuteReader();

            if (!reader.Read())
                return null;

            var ocrResultatId = Convert.ToInt32(reader["ocr_resultat_id"]);
            var classificationId = Convert.ToInt32(reader["classification_id"]);

            if (ocrResultatId == -1 || classificationId == -1)
                return null;

            return new ConfirmOcrResponseDTO
            {
                OcrResultatId = ocrResultatId,
                ClassificationId = classificationId,
                PieceJointeId = pieceJointeId,
                CourrierId = courrierId,
                CategorieId = categorieId
            };
        }

        private static PieceJointeDTO Map(NpgsqlDataReader reader)
        {
            return new PieceJointeDTO(
                Convert.ToInt32(reader["id"]),
                Convert.ToInt32(reader["courrier_id"]),
                reader["nom_fichier"].ToString() ?? "",
                reader["type_fichier"].ToString() ?? "",
                reader["chemin_fichier"].ToString() ?? "",
                reader["format"].ToString() ?? "",
                Convert.ToInt64(reader["taille"]),
                Convert.ToBoolean(reader["est_scan"]),
                Convert.ToDateTime(reader["created_at"])
            );
        }
    }
}