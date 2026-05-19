using DTO.PiecesJointes;

namespace backend.Services.Classification
{
    public interface IOcrClassificationService
    {
        OcrClassificationDTO Classify(string texteOcr);
    }
}