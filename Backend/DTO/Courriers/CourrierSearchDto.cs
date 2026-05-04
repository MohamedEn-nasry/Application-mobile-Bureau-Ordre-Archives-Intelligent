using System;

namespace DTO.Courriers
{
    public class CourrierSearchDto
    {
        public string? Keyword { get; set; }

        public string? Type { get; set; }

        public string? Statut { get; set; }

        public int? CategorieId { get; set; }

        public int? AuteurId { get; set; }

        public int? AssigneA { get; set; }

        public DateTime? DateDebut { get; set; }

        public DateTime? DateFin { get; set; }
    }
}