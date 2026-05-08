using Tesseract;

namespace backend.Services.Ocr
{
    public class TesseractOcrService : IOcrService
    {
        private readonly IWebHostEnvironment _env;

        public TesseractOcrService(IWebHostEnvironment env)
        {
            _env = env;
        }

        public OcrExtractionResult ExtractText(string filePath)
        {
            var extension = Path.GetExtension(filePath).ToLowerInvariant();

            var allowedImageExtensions = new[]
            {
                ".png",
                ".jpg",
                ".jpeg",
                ".bmp",
                ".tiff",
                ".tif"
            };

            if (!allowedImageExtensions.Contains(extension))
            {
                throw new InvalidOperationException(
                    "OCR supporte seulement les images pour le moment."
                );
            }

            var tessDataPath = Path.Combine(
                _env.ContentRootPath,
                "tessdata"
            );

            using var engine = new TesseractEngine(
                tessDataPath,
                "fra+ara+eng",
                EngineMode.Default
            );

            using var img = Pix.LoadFromFile(filePath);
            using var page = engine.Process(img);

            var rawConfidence = page.GetMeanConfidence();

            var confidence = rawConfidence <= 1
                ? rawConfidence * 100
                : rawConfidence;

            return new OcrExtractionResult
            {
                Text = page.GetText()?.Trim() ?? "",
                Confidence = Math.Round(confidence, 2)
            };
        }
    }
}