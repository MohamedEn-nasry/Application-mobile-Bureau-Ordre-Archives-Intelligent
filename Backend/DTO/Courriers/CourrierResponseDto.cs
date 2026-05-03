using System;

namespace DTO.Courriers
{
    public class CourrierResponseDto
    {
        public int Id { get; set; }

        public string Reference { get; set; } = string.Empty;

        public string Type { get; set; } = string.Empty;

        public DateTime DateCourrier { get; set; }

        public string? Expediteur { get; set; }

        public string? Destinataire { get; set; }

        public string Objet { get; set; } = string.Empty;

        public string? Description { get; set; }

        public string Statut { get; set; } = string.Empty;

        public string? TexteOcr { get; set; }

        public int? CategorieId { get; set; }

        public int AuteurId { get; set; }

        public int? AssigneA { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public DateTime? DateEcheance { get; set; }
    }
}