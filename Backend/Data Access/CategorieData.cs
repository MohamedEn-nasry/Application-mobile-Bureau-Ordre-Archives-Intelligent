
using DTO.Categories;
using Npgsql;

namespace Data_Access
{
    public class CategorieData
    {
        public static List<CategorieDTO> GetAllCategories()
        {
            var list = new List<CategorieDTO>();

            using (var conn = new NpgsqlConnection(clsSeting._connectionString))
            using (var cmd = new NpgsqlCommand(
                @"SELECT id, nom, description
                  FROM categorie
                  ORDER BY nom", conn))
            {
                conn.Open();

                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        list.Add(MapCategorie(reader));
                    }
                }
            }

            return list;
        }

        public static CategorieDTO? GetCategorieById(int id)
        {
            using (var conn = new NpgsqlConnection(clsSeting._connectionString))
            using (var cmd = new NpgsqlCommand(
                @"SELECT id, nom, description
                  FROM categorie
                  WHERE id = @p_id", conn))
            {
                cmd.Parameters.AddWithValue("@p_id", id);

                conn.Open();

                using (var reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                        return MapCategorie(reader);
                }
            }

            return null;
        }

        private static CategorieDTO MapCategorie(NpgsqlDataReader reader)
        {
            return new CategorieDTO(
                reader.GetInt32(reader.GetOrdinal("id")),
                reader["nom"].ToString() ?? string.Empty,
                reader.IsDBNull(reader.GetOrdinal("description"))
                    ? null
                    : reader["description"].ToString()
            );
        }
    }
}