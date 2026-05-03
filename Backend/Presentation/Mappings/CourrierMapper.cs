
using DTO.Courriers;

namespace Presentation.Mappings
{
    public static class CourrierMapper
    {
        public static CourrierDTO ToCourrierDto(CreateCourrierDto dto, int auteurId)
        {
            var now = DateTime.UtcNow;

            return new CourrierDTO(
                0,
                dto.Reference,
                dto.Type,
                dto.DateCourrier,
                dto.Expediteur,
                dto.Destinataire,
                dto.Objet,
                dto.Description,
                "ATraiter",
                dto.TexteOcr,
                dto.CategorieId,
                auteurId,
                dto.AssigneA,
                now,
                now,
                dto.DateEcheance
            );
        }

        public static CourrierDTO ApplyUpdate(CourrierDTO existing, UpdateCourrierDto dto)
        {
            existing.Reference = dto.Reference;
            existing.Type = dto.Type;
            existing.DateCourrier = dto.DateCourrier;
            existing.Expediteur = dto.Expediteur;
            existing.Destinataire = dto.Destinataire;
            existing.Objet = dto.Objet;
            existing.Description = dto.Description;
            existing.Statut = dto.Statut;
            existing.TexteOcr = dto.TexteOcr;
            existing.CategorieId = dto.CategorieId;
            existing.AssigneA = dto.AssigneA;
            existing.DateEcheance = dto.DateEcheance;
            existing.UpdatedAt = DateTime.UtcNow;

            return existing;
        }

        public static CourrierResponseDto ToResponseDto(CourrierDTO dto)
        {
            return new CourrierResponseDto
            {
                Id = dto.Id,
                Reference = dto.Reference,
                Type = dto.Type,
                DateCourrier = dto.DateCourrier,
                Expediteur = dto.Expediteur,
                Destinataire = dto.Destinataire,
                Objet = dto.Objet,
                Description = dto.Description,
                Statut = dto.Statut,
                TexteOcr = dto.TexteOcr,
                CategorieId = dto.CategorieId,
                AuteurId = dto.AuteurId,
                AssigneA = dto.AssigneA,
                CreatedAt = dto.CreatedAt,
                UpdatedAt = dto.UpdatedAt,
                DateEcheance = dto.DateEcheance
            };
        }

        public static List<CourrierResponseDto> ToResponseDtoList(List<CourrierDTO> courriers)
        {
            return courriers.Select(courriers => ToResponseDto(courriers)).ToList();
        }
    }
}