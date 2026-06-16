using System;
using Xunit;
using BusinessLayer;
using DTO.Courriers;

namespace Backend.Tests
{
    public class CourrierTests
    {
        private CourrierDTO CreateMockCourrierDTO()
        {
            return new CourrierDTO(
                1,
                "REF-2026-0001",
                "Arrivée",
                DateTime.UtcNow,
                "Expéditeur Externe",
                "Destinataire Interne",
                "Sujet Urgent",
                "Description détaillée du courrier",
                "Nouveau",
                "Texte extrait par OCR",
                10,
                2,
                3,
                DateTime.UtcNow,
                DateTime.UtcNow,
                DateTime.UtcNow.AddDays(7)
            );
        }

        [Fact]
        public void Constructor_WithValidDTO_MapsPropertiesCorrectly()
        {
            // Arrange
            var dto = CreateMockCourrierDTO();

            // Act
            var courrier = new Courrier(dto);

            // Assert
            Assert.Equal(dto.Id, courrier.Id);
            Assert.Equal(dto.Reference, courrier.Reference);
            Assert.Equal(dto.Type, courrier.Type);
            Assert.Equal(dto.DateCourrier, courrier.DateCourrier);
            Assert.Equal(dto.Expediteur, courrier.Expediteur);
            Assert.Equal(dto.Destinataire, courrier.Destinataire);
            Assert.Equal(dto.Objet, courrier.Objet);
            Assert.Equal(dto.Description, courrier.Description);
            Assert.Equal(dto.Statut, courrier.Statut);
            Assert.Equal(dto.TexteOcr, courrier.TexteOcr);
            Assert.Equal(dto.CategorieId, courrier.CategorieId);
            Assert.Equal(dto.AuteurId, courrier.AuteurId);
            Assert.Equal(dto.AssigneA, courrier.AssigneA);
            Assert.Equal(dto.CreatedAt, courrier.CreatedAt);
            Assert.Equal(dto.UpdatedAt, courrier.UpdatedAt);
            Assert.Equal(dto.DateEcheance, courrier.DateEcheance);
        }

        [Fact]
        public void CDTO_Property_ReturnsCorrectDTOMapping()
        {
            // Arrange
            var dto = CreateMockCourrierDTO();
            var courrier = new Courrier(dto);

            // Act
            var resultDto = courrier.CDTO;

            // Assert
            Assert.Equal(courrier.Id, resultDto.Id);
            Assert.Equal(courrier.Reference, resultDto.Reference);
            Assert.Equal(courrier.Type, resultDto.Type);
            Assert.Equal(courrier.DateCourrier, resultDto.DateCourrier);
            Assert.Equal(courrier.Expediteur, resultDto.Expediteur);
            Assert.Equal(courrier.Destinataire, resultDto.Destinataire);
            Assert.Equal(courrier.Objet, resultDto.Objet);
            Assert.Equal(courrier.Description, resultDto.Description);
            Assert.Equal(courrier.Statut, resultDto.Statut);
            Assert.Equal(courrier.TexteOcr, resultDto.TexteOcr);
            Assert.Equal(courrier.CategorieId, resultDto.CategorieId);
            Assert.Equal(courrier.AuteurId, resultDto.AuteurId);
            Assert.Equal(courrier.AssigneA, resultDto.AssigneA);
            Assert.Equal(courrier.CreatedAt, resultDto.CreatedAt);
            Assert.Equal(courrier.UpdatedAt, resultDto.UpdatedAt);
            Assert.Equal(courrier.DateEcheance, resultDto.DateEcheance);
        }
    }
}
