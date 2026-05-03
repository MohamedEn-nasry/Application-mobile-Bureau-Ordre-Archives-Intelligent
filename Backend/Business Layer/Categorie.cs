
using Data_Access;
using DTO.Categories;

namespace BusinessLayer
{
    public class Categorie
    {
        public int Id { get; set; }

        public string Nom { get; set; }

        public string? Description { get; set; }

        public CategorieDTO CDTO
        {
            get
            {
                return new CategorieDTO(
                    this.Id,
                    this.Nom,
                    this.Description
                );
            }
        }

        public Categorie(CategorieDTO dto)
        {
            Id = dto.Id;
            Nom = dto.Nom;
            Description = dto.Description;
        }

        public static List<CategorieDTO> GetAllCategories()
        {
            return CategorieData.GetAllCategories();
        }

        public static Categorie? Find(int id)
        {
            var dto = CategorieData.GetCategorieById(id);

            if (dto == null)
                return null;

            return new Categorie(dto);
        }
    }
}