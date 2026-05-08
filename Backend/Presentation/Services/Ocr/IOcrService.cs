namespace backend.Services.Ocr
{
    public class OcrExtractionResult
    {
        public string Text { get; set; } = string.Empty;
        public double Confidence { get; set; }
    }

    public interface IOcrService
    {
        OcrExtractionResult ExtractText(string filePath);
    }
}