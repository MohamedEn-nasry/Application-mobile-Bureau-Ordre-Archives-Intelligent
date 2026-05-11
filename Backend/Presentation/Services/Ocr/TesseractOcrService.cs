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
                ".png", ".jpg", ".jpeg", ".bmp", ".tiff", ".tif"
            };

            if (!allowedImageExtensions.Contains(extension))
                throw new InvalidOperationException("OCR supporte seulement les images.");

            var tessDataPath = Path.Combine(_env.ContentRootPath, "tessdata");

            if (!Directory.Exists(tessDataPath))
                throw new DirectoryNotFoundException($"Dossier tessdata introuvable: {tessDataPath}");

            EnsureTrainedDataExists(tessDataPath, "fra");
            EnsureTrainedDataExists(tessDataPath, "eng");

            // ara optional حاليا حتى تتأكد أن الملف صحيح
            var language = File.Exists(Path.Combine(tessDataPath, "ara.traineddata"))
                ? "fra+eng+ara"
                : "fra+eng";

            using var engine = CreateEngineWithFallback(tessDataPath, language);

            engine.SetVariable("user_defined_dpi", "300");

            using var img = Pix.LoadFromFile(filePath);
            using var page = engine.Process(img);

            var rawConfidence = page.GetMeanConfidence();
            var confidence = rawConfidence <= 1 ? rawConfidence * 100 : rawConfidence;

            return new OcrExtractionResult
            {
                Text = page.GetText()?.Trim() ?? "",
                Confidence = Math.Round(confidence, 2)
            };
        }

        private static TesseractEngine CreateEngineWithFallback(
            string tessDataPath,
            string language)
        {
            try
            {
                return new TesseractEngine(
                    tessDataPath,
                    language,
                    EngineMode.Default
                );
            }
            catch
            {
                // إذا fra+eng+ara فشل، نخدم مؤقتاً بالفرنسية والإنجليزية
                return new TesseractEngine(
                    tessDataPath,
                    "fra+eng",
                    EngineMode.Default
                );
            }
        }

        private static void EnsureTrainedDataExists(string tessDataPath, string language)
        {
            var filePath = Path.Combine(tessDataPath, $"{language}.traineddata");

            if (!File.Exists(filePath))
                throw new FileNotFoundException($"{language}.traineddata introuvable: {filePath}");

            if (new FileInfo(filePath).Length < 1024 * 1024)
            {
                throw new InvalidOperationException(
                    $"{language}.traineddata semble invalide ou trop petit: {filePath}"
                );
            }
        }
    }
}