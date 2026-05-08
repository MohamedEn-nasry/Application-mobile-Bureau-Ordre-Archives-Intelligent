using System.ComponentModel.DataAnnotations;

namespace DTO.Courriers
{
    public class UpdateCourrierStatusDto
    {
        [Required]
        public string Statut { get; set; } = string.Empty;
        public string? Commentaire { get; set; }

        public int? AssigneA { get; set; }
    }

}