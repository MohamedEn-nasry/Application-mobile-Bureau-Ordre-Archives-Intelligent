using Data_Access;
using DTO.Courriers;

namespace BusinessLayer
{
    public class Courrier
    {
        public enum enMode { AddNew = 0, Update = 1 }
        enMode Mode = enMode.AddNew;

        public CourrierDTO CDTO
        {
            get
            {
                return new CourrierDTO
                 (
                    this.Id,
                    this.Reference,
                    this.Type,
                    this.DateCourrier,
                    this.Expediteur,
                    this.Destinataire,
                    this.Objet,
                    this.Description,
                    this.Statut,
                    this.TexteOcr,
                    this.CategorieId,
                    this.AuteurId,
                    this.AssigneA,
                    this.CreatedAt,
                    this.UpdatedAt,
                    this.DateEcheance
                );
            }
        }

        public int Id { get; set; }
        public string Reference { get; set; }
        public string Type { get; set; }
        public DateTime DateCourrier { get; set; }

        public string? Expediteur { get; set; }
        public string? Destinataire { get; set; }

        public string Objet { get; set; }
        public string? Description { get; set; }

        public string Statut { get; set; }
        public string? TexteOcr { get; set; }

        public int? CategorieId { get; set; }
        public int AuteurId { get; set; }
        public int? AssigneA { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime? DateEcheance { get; set; }

        public Courrier(CourrierDTO courrierDto, enMode cMode = enMode.AddNew)
        {
            this.Id = courrierDto.Id;
            this.Reference = courrierDto.Reference;
            this.Type = courrierDto.Type;
            this.DateCourrier = courrierDto.DateCourrier;
            this.Expediteur = courrierDto.Expediteur;
            this.Destinataire = courrierDto.Destinataire;
            this.Objet = courrierDto.Objet;
            this.Description = courrierDto.Description;
            this.Statut = courrierDto.Statut;
            this.TexteOcr = courrierDto.TexteOcr;
            this.CategorieId = courrierDto.CategorieId;
            this.AuteurId = courrierDto.AuteurId;
            this.AssigneA = courrierDto.AssigneA;
            this.CreatedAt = courrierDto.CreatedAt;
            this.UpdatedAt = courrierDto.UpdatedAt;
            this.DateEcheance = courrierDto.DateEcheance;

            this.Mode = cMode;
        }

        private bool _AddNewCourrier()
        {
            this.Id = CourrierData.AddCourrier(this.CDTO);
            return this.Id != -1;
        }

        private bool _UpdateCourrier()
        {
            return CourrierData.UpdateCourrier(this.CDTO);
        }

        public bool Save()
        {
            switch (this.Mode)
            {
                case enMode.AddNew:
                    if (_AddNewCourrier())
                    {
                        this.Mode = enMode.Update;
                        return true;
                    }
                    return false;

                case enMode.Update:
                    return _UpdateCourrier();
            }

            return false;
        }

        public static List<CourrierDTO> GetAllCourriers()
        {
            return CourrierData.GetAllCourriers();
        }

        public static Courrier? Find(int id)
        {
            CourrierDTO? courrierDto = CourrierData.GetCourrierById(id);

            if (courrierDto != null)
                return new Courrier(courrierDto, enMode.Update);

            return null;
        }

        public static List<CourrierDTO> GetCourriersByAssigneA(int userId)
        {
            return CourrierData.GetCourriersByAssigneA(userId);
        }

        public static List<CourrierDTO> GetCourriersByAuteurId(int userId)
        {
            return CourrierData.GetCourriersByAuteurId(userId);
        }

        public static bool UpdateStatutWithHistory(
    int id,
    string statut,
    int? modifiePar,
    string? commentaire)
        {
            return CourrierData.UpdateCourrierStatutWithHistory(
                id,
                statut,
                modifiePar,
                commentaire
            );
        }

        public static bool Delete(int id)
        {
            return CourrierData.DeleteCourrier(id);
        }
    }
}