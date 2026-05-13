using System;
using System.Collections.Generic;
using System.Text;

namespace DTO.PiecesJointes
{
    public class PieceJointeDTO
    {
        public int Id { get; set; }
        public int CourrierId { get; set; }
        public string NomFichier { get; set; }
        public string TypeFichier { get; set; }
        public string CheminFichier { get; set; }
        public string Format { get; set; }
        public long Taille { get; set; }
        public bool EstScan { get; set; }
        public DateTime CreatedAt { get; set; }

        public PieceJointeDTO(
            int id,
            int courrierId,
            string nomFichier,
            string typeFichier,
            string cheminFichier,
            string format,
            long taille,
            bool estScan,
            DateTime createdAt)
        {
            Id = id;
            CourrierId = courrierId;
            NomFichier = nomFichier;
            TypeFichier = typeFichier;
            CheminFichier = cheminFichier;
            Format = format;
            Taille = taille;
            EstScan = estScan;
            CreatedAt = createdAt;
        }
    }

    public class OcrResultDTO
    {
        public int PieceJointeId { get; set; }
        public int CourrierId { get; set; }
        public string TexteOcr { get; set; } = string.Empty;
    }

    public class ConfirmOcrDTO
    {
        public string TexteOcr { get; set; } = string.Empty;

        public double OcrConfiance { get; set; }

        public bool CorrigeManuellement { get; set; }

        public int? CategorieId { get; set; }

        public double ScoreConfiance { get; set; }

        public string Methode { get; set; } = "OCR_RULE_BASED";
    }

    public class ConfirmOcrResponseDTO
    {
        public int OcrResultatId { get; set; }

        public int ClassificationId { get; set; }

        public int PieceJointeId { get; set; }

        public int CourrierId { get; set; }

        public int? CategorieId { get; set; }
    }

    public class OcrClassificationDTO
    {
        public int? SuggestedCategorieId { get; set; }
        public string? SuggestedCategorieName { get; set; }
        public double ScoreConfiance { get; set; }
        public string Methode { get; set; } = "OCR_RULE_BASED";
        public List<string> MatchedKeywords { get; set; } = new();
        public string Message { get; set; } = string.Empty;
    }

    public class OcrPreviewResultDTO
    {
        public int PieceJointeId { get; set; }

        public int CourrierId { get; set; }

        public string TexteOcr { get; set; } = string.Empty;

        public double OcrConfiance { get; set; }

        public OcrClassificationDTO Classification { get; set; } = new();
    }

    public class PieceJointeImageDTO
    {
        public int Id { get; set; }
        public string NomFichier { get; set; } = string.Empty;
        public string TypeFichier { get; set; } = string.Empty;
        public string DataUrl { get; set; } = string.Empty;
    }
}