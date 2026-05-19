using System;
using System.ComponentModel.DataAnnotations;

namespace DTO.Courriers
{
    public class CreateCourrierDto
    {
        [Required]
        public string Reference { get; set; } = string.Empty;

        [Required]
        public string Type { get; set; } = string.Empty;
        // Entrant أو Sortant

        [Required]
        public DateTime DateCourrier { get; set; }

        public string? Expediteur { get; set; }

        public string? Destinataire { get; set; }

        [Required]
        public string Objet { get; set; } = string.Empty;

        public string? Description { get; set; }

        public string? TexteOcr { get; set; }

        public int? CategorieId { get; set; }

        public int? AssigneA { get; set; }

        public DateTime? DateEcheance { get; set; }
    }
}