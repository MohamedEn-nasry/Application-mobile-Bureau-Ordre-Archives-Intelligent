namespace DTO.Historiques
{
    public class HistoriqueStatutDTO
    {
        public int Id { get; set; }
        public int CourrierId { get; set; }
        public string AncienStatut { get; set; }
        public string NouveauStatut { get; set; }
        public int ModifiePar { get; set; }
        public string? Commentaire { get; set; }
        public DateTime ChangedAt { get; set; }

        public HistoriqueStatutDTO(
            int id,
            int courrierId,
            string ancienStatut,
            string nouveauStatut,
            int modifiePar,
            string? commentaire,
            DateTime changedAt)
        {
            Id = id;
            CourrierId = courrierId;
            AncienStatut = ancienStatut;
            NouveauStatut = nouveauStatut;
            ModifiePar = modifiePar;
            Commentaire = commentaire;
            ChangedAt = changedAt;
        }
    }
}