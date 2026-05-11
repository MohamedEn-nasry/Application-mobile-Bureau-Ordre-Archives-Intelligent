using System;
using System.Collections.Generic;
using System.Text;

namespace DTO.Courriers
{
    public class CourrierHistoryDTO
    {
        public int Id { get; set; }
        public int CourrierId { get; set; }
        public string AncienStatut { get; set; } = string.Empty;
        public string NouveauStatut { get; set; } = string.Empty;
        public int ModifiePar { get; set; }
        public string ModifieParNom { get; set; } = string.Empty;
        public string? Commentaire { get; set; }
        public DateTime ChangedAt { get; set; }
    }
}