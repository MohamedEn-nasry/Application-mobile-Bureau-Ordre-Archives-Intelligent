using System;
using System.Collections.Generic;
using System.Text;

namespace CourriersDTO
{
    public class CourrierDTO
    {
       
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
            public int CategorieId { get; set; }
            public int AuteurId { get; set; }
            public int? AssigneA { get; set; }
            public DateTime CreatedAt { get; set; }
            public DateTime UpdatedAt { get; set; }
            public DateTime? DateEcheance { get; set; }

            public CourrierDTO(
                int id,
                string reference,
                string type,
                DateTime dateCourrier,
                string? expediteur,
                string? destinataire,
                string objet,
                string? description,
                string statut,
                string? texteOcr,
                int categorieId,
                int auteurId,
                int? assigneA,
                DateTime createdAt,
                DateTime updatedAt,
                DateTime? dateEcheance)
            {
                Id = id;
                Reference = reference;
                Type = type;
                DateCourrier = dateCourrier;
                Expediteur = expediteur;
                Destinataire = destinataire;
                Objet = objet;
                Description = description;
                Statut = statut;
                TexteOcr = texteOcr;
                CategorieId = categorieId;
                AuteurId = auteurId;
                AssigneA = assigneA;
                CreatedAt = createdAt;
                UpdatedAt = updatedAt;
                DateEcheance = dateEcheance;
            }
        
    }
}
