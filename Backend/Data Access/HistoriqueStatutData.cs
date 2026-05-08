using Npgsql;
using DTO.Historiques;

namespace Data_Access
{
    public class HistoriqueStatutData
    {
        public static List<HistoriqueStatutDTO> GetByCourrierId(int courrierId)
        {
            var list = new List<HistoriqueStatutDTO>();

            using var conn = new NpgsqlConnection(clsSeting._connectionString);

            using var cmd = new NpgsqlCommand(
                "SELECT * FROM fn_historique_statut_get_by_courrier(@courrierId);",
                conn
            );

            cmd.Parameters.AddWithValue("@courrierId", courrierId);

            conn.Open();

            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                list.Add(new HistoriqueStatutDTO(
                    Convert.ToInt32(reader["id"]),
                    Convert.ToInt32(reader["courrier_id"]),
                    reader["ancien_statut"].ToString() ?? "",
                    reader["nouveau_statut"].ToString() ?? "",
                    Convert.ToInt32(reader["modifie_par"]),
                    reader["commentaire"] == DBNull.Value
                        ? null
                        : reader["commentaire"].ToString(),
                    Convert.ToDateTime(reader["changed_at"])
                ));
            }

            return list;
        }
    }
}