using backend.Services.Ocr;
using BusinessLayer;
using DTO.PiecesJointes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using backend.Services.Classification;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/PiecesJointes")]
    public class PiecesJointesController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;
        private readonly IOcrService _ocrService;
        private readonly IAuthorizationService _authorizationService;
        private readonly IOcrClassificationService _classificationService;
        public PiecesJointesController(
            IWebHostEnvironment env,
            IOcrService ocrService,
            IAuthorizationService authorizationService,
            IOcrClassificationService classificationService)
        {
            _env = env;
            _ocrService = ocrService;
            _authorizationService = authorizationService;
            _classificationService = classificationService;
        }

        [HttpGet("courrier/{courrierId:int}")]
        [Authorize(Roles = "Admin,Agent,Lecteur")]
        public async Task<IActionResult> GetByCourrier(int courrierId)
        {
            var courrier = Courrier.Find(courrierId);

            if (courrier == null)
                return NotFound(new { message = "Courrier introuvable." });

            var authorizationResult = await _authorizationService.AuthorizeAsync(
             User,
             courrier.CDTO,
             "CourrierOwnerOrAdmin"
         );

            if (!authorizationResult.Succeeded)
                return Forbid();

            var pieces = PieceJointe.GetByCourrierId(courrierId);

            return Ok(pieces);
        }

        [HttpPost("courrier/{courrierId:int}")]
        [Authorize(Roles = "Agent")]
        public async Task<IActionResult> Upload(int courrierId, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "Fichier obligatoire." });

            var courrier = Courrier.Find(courrierId);

            if (courrier == null)
                return NotFound(new { message = "Courrier introuvable." });

            var authorizationResult = await _authorizationService.AuthorizeAsync(
                User,
                courrier.CDTO,
                "CourrierOwnerOrAdmin"
            );

            if (!authorizationResult.Succeeded)
                return Forbid();

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

            //var allowedExtensions = new[]
            //{
            //    ".pdf",
            //    ".png",
            //    ".jpg",
            //    ".jpeg",
            //    ".bmp",
            //    ".tiff",
            //    ".tif"
            //};

            //if (!allowedExtensions.Contains(extension))
            //{
            //    return BadRequest(new
            //    {
            //        message = "Format de fichier non autorisé."
            //    });
            //}
            var allowedContentTypes = new[]
                                            {
                                                "application/pdf",
                                                "image/png",
                                                "image/jpeg",
                                                "image/bmp",
                                                "image/tiff"
                                            };

            if (!allowedContentTypes.Contains(file.ContentType))
            {
                return BadRequest(new { message = "Type MIME non autorisé." });
            }

            var safeFileName = Path.GetFileName(file.FileName);

            var relativeDirectory = Path.Combine(
                "uploads",
                "courriers",
                courrierId.ToString()
            );

            var absoluteDirectory = Path.Combine(
                _env.ContentRootPath,
                relativeDirectory
            );

            Directory.CreateDirectory(absoluteDirectory);

            var storedFileName = $"{Guid.NewGuid()}{extension}";

            var absolutePath = Path.Combine(
                absoluteDirectory,
                storedFileName
            );

            try
            {
                await using var stream = new FileStream(absolutePath, FileMode.CreateNew);
                await file.CopyToAsync(stream);
            }
            catch
            {
                return StatusCode(500, new { message = "Erreur lors de l'enregistrement du fichier." });
            }

            var relativePath = Path.Combine(
                relativeDirectory,
                storedFileName
            ).Replace("\\", "/");

            var dto = new PieceJointeDTO(
                0,
                courrierId,
                safeFileName,
                file.ContentType,
                relativePath,
                extension.Replace(".", ""),
                file.Length,
                false,
                DateTime.UtcNow
            );

            var newId = PieceJointe.Add(dto);

            if (newId == -1)
            {
                try
                {
                    if (System.IO.File.Exists(absolutePath))
                        System.IO.File.Delete(absolutePath);
                }
                catch
                {
                    
                }

                return BadRequest(new
                {
                    message = "Erreur lors de l'ajout de la pièce jointe."
                });
            }

            var created = PieceJointe.Find(newId);

            return CreatedAtAction(   //return CreatedAtRoute("GetPiecesByCourrier",new { courrierId }, created);
                nameof(GetByCourrier),
                new { courrierId },
                created
            );
        }

        [HttpGet("{id:int}/download")]
        [Authorize(Roles = "Admin,Agent,Lecteur")]
        public async Task<IActionResult> Download(int id)
        {
            var piece = PieceJointe.Find(id);

            if (piece == null)
                return NotFound(new { message = "Pièce jointe introuvable." });

            var courrier = Courrier.Find(piece.CourrierId);

            if (courrier == null)
                return NotFound(new { message = "Courrier introuvable." });

            var authorizationResult = await _authorizationService.AuthorizeAsync(
                User,
                courrier.CDTO,
                "CourrierOwnerOrAdmin"
            );

            if (!authorizationResult.Succeeded)
                return Forbid();

            //var absolutePath = Path.Combine(
            //    _env.ContentRootPath,
            //    piece.CheminFichier.Replace(
            //        "/",
            //        Path.DirectorySeparatorChar.ToString()
            //    )
            //);

            //NOteeeeeeeeeeeeeeeeeeeeeeeee!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            //أي مسار موجود في قاعدة البيانات سيتم الوثوق به مباشرة.
            //إذا كان المسار خبيثًا أو خاطئًا مثل.. / .. / appsettings.json،
            //فقد يستطيع المستخدم تحميل ملفات خارج مجلد uploads.
            //هذا يسمى Path Traversal، وقد يؤدي إلى كشف ملفات حساسة من السيرفر.

            var uploadsRoot = Path.GetFullPath(
                                Path.Combine(_env.ContentRootPath, "uploads")
                            );

            var absolutePath = Path.GetFullPath(
                Path.Combine(
                    _env.ContentRootPath,
                    piece.CheminFichier.Replace(
                        "/",
                        Path.DirectorySeparatorChar.ToString()
                    )
                )
            );

                //StringComparison.OrdinalIgnoreCase

                //فمعناه أن المقارنة لا تهتم بحالة الحروف، مثل:
            if (!absolutePath.StartsWith(
                    uploadsRoot + Path.DirectorySeparatorChar,
                    StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest(new
                {
                    message = "Chemin de fichier invalide."
                });
            }
            // Security check:
            // نتأكد أن المسار النهائي للملف موجود داخل مجلد uploads فقط.
            // نستعمل Path.GetFullPath لأن المسار المخزن في قاعدة البيانات قد يحتوي على
            // قيم خطيرة مثل ../../appsettings.json، وهذا يمكن أن يخرج من uploads.
            // إذا لم نتحقق من ذلك، يمكن للمستخدم تحميل ملفات حساسة من السيرفر.
            // هذا يحمي التطبيق من هجوم Path Traversal.

            // ملاحظة:
            // نحفظ المسار في قاعدة البيانات باستعمال "/" وليس "\" لأنه أكثر توافقًا.
            // الرمز "\" خاص غالبًا بـ Windows، أما "/" فيُستعمل في الويب ويشتغل بشكل أفضل
            // عند نقل التطبيق بين Windows و Linux.
            // لذلك عند القراءة نحول "/" إلى Path.DirectorySeparatorChar حسب نظام التشغيل.




            if (!System.IO.File.Exists(absolutePath))
            {
                return NotFound(new
                {
                    message = "Fichier introuvable sur le serveur."
                });
            }

            var bytes = System.IO.File.ReadAllBytes(absolutePath);

            return File(
                bytes,
                piece.TypeFichier,
                piece.NomFichier
            );
        }

        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Agent")]
        public async Task<IActionResult> Delete(int id)
        {
            var piece = PieceJointe.Find(id);

            if (piece == null)
                return NotFound(new { message = "Pièce jointe introuvable." });

            var courrier = Courrier.Find(piece.CourrierId);

            if (courrier == null)
                return NotFound(new { message = "Courrier introuvable." });

            var authorizationResult = await _authorizationService.AuthorizeAsync(
                User,
                courrier.CDTO,
                "CourrierOwnerOrAdmin"
            );

            if (!authorizationResult.Succeeded)
                return Forbid();

            if (string.IsNullOrWhiteSpace(piece.CheminFichier))
                return BadRequest(new { message = "Chemin du fichier invalide." });

            var uploadsRoot = Path.GetFullPath(
                Path.Combine(_env.ContentRootPath, "uploads")
            );

            var relativePath = piece.CheminFichier.Replace(
                "/",
                Path.DirectorySeparatorChar.ToString()
            );

            var absolutePath = Path.GetFullPath(
                Path.Combine(_env.ContentRootPath, relativePath)
            );

            if (!absolutePath.StartsWith(
                    uploadsRoot + Path.DirectorySeparatorChar,
                    StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest(new { message = "Chemin du fichier invalide." });
            }

            var deleted = PieceJointe.Delete(id);

            if (!deleted)
                return BadRequest(new { message = "Erreur lors de la suppression." });

            try
            {
                if (System.IO.File.Exists(absolutePath))
                    System.IO.File.Delete(absolutePath);
            }
            catch
            {
                return StatusCode(500, new { message = "Pièce supprimée, mais erreur lors de la suppression du fichier physique." });
            }

            return NoContent();
        }

        [HttpPost("{id:int}/ocr/preview")]
        [Authorize(Roles = "Agent")]
        public async Task<IActionResult> PreviewOcr(int id)
        {
            var piece = PieceJointe.Find(id);

            if (piece == null)
                return NotFound(new { message = "Pièce jointe introuvable." });

            var courrier = Courrier.Find(piece.CourrierId);

            if (courrier == null)
                return NotFound(new { message = "Courrier introuvable." });

            var authorizationResult = await _authorizationService.AuthorizeAsync(
                User,
                courrier.CDTO,
                "CourrierOwnerOrAdmin"
            );

            if (!authorizationResult.Succeeded)
                return Forbid();



            if (string.IsNullOrWhiteSpace(piece.CheminFichier))
                return BadRequest(new { message = "Chemin du fichier invalide." });

            var uploadsRoot = Path.GetFullPath(
                Path.Combine(_env.ContentRootPath, "uploads")
            );

            var relativePath = piece.CheminFichier.Replace(
                "/",
                Path.DirectorySeparatorChar.ToString()
            );

            var absolutePath = Path.GetFullPath(
                Path.Combine(_env.ContentRootPath, relativePath)
            );

            if (!absolutePath.StartsWith(
                    uploadsRoot + Path.DirectorySeparatorChar,
                    StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest(new { message = "Chemin du fichier invalide." });
            }

            if (!System.IO.File.Exists(absolutePath))
            {
                return NotFound(new
                {
                    message = "Fichier introuvable sur le serveur."
                });
            }
            OcrExtractionResult ocrResult;

            try
            {
                ocrResult = _ocrService.ExtractText(absolutePath);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }

            var classification = _classificationService.Classify(ocrResult.Text);

            return Ok(new OcrPreviewResultDTO
            {
                PieceJointeId = id,
                CourrierId = piece.CourrierId,
                TexteOcr = ocrResult.Text,
                OcrConfiance = ocrResult.Confidence,
                Classification = classification
            });
        }


        [HttpPost("ocr/preview-file")]
        [Authorize(Roles = "Agent")]
        public async Task<IActionResult> PreviewOcrFile( IFormFile file)
        {
           
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "Fichier obligatoire." });

            const long maxFileSize = 5 * 1024 * 1024;

            if (file.Length > maxFileSize)
                return BadRequest(new { message = "Fichier trop volumineux." });

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

            var allowedExtensions = new[]
            {
        ".png", ".jpg", ".jpeg", ".bmp", ".tiff", ".tif"
    };

            if (!allowedExtensions.Contains(extension))
                return BadRequest(new { message = "OCR supporte seulement les images." });

            var allowedContentTypes = new[]
            {
        "image/png",
        "image/jpeg",
        "image/bmp",
        "image/tiff"
    };

            if (!allowedContentTypes.Contains(file.ContentType.ToLowerInvariant()))
                return BadRequest(new { message = "Type de fichier invalide." });

            var tempRoot = Path.GetFullPath(
                Path.Combine(_env.ContentRootPath, "temp", "ocr")
            );

            Directory.CreateDirectory(tempRoot);

            var tempFileName = $"{Guid.NewGuid()}{extension}";

            var tempPath = Path.GetFullPath(
                Path.Combine(tempRoot, tempFileName)
            );

            try
            {
                await using (var stream = new FileStream(tempPath, FileMode.CreateNew))
                {
                    await file.CopyToAsync(stream);
                }

                var ocrResult = _ocrService.ExtractText(tempPath);
                var classification = _classificationService.Classify(ocrResult.Text);

                return Ok(new OcrPreviewResultDTO
                {
                    PieceJointeId = 0,
                    CourrierId = 0,
                    TexteOcr = ocrResult.Text,
                    OcrConfiance = ocrResult.Confidence,
                    Classification = classification
                });
            }
            finally
            {
                if (System.IO.File.Exists(tempPath))
                    System.IO.File.Delete(tempPath);
            }
        }

        [HttpPost("{id:int}/ocr/confirm")]
        [Authorize(Roles = "Agent")]
        public async Task<IActionResult> ConfirmOcr(
            int id,
            [FromBody] ConfirmOcrDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (string.IsNullOrWhiteSpace(dto.TexteOcr))
                return BadRequest(new { message = "Le texte OCR est obligatoire." });

            if (dto.OcrConfiance < 0 || dto.OcrConfiance > 100)
                return BadRequest(new { message = "La confiance OCR doit être entre 0 et 100." });

            if (dto.ScoreConfiance < 0 || dto.ScoreConfiance > 100)
                return BadRequest(new { message = "Le score de classification doit être entre 0 et 100." });

            var piece = PieceJointe.Find(id);

            if (piece == null)
                return NotFound(new { message = "Pièce jointe introuvable." });

            var courrier = Courrier.Find(piece.CourrierId);

            if (courrier == null)
                return NotFound(new { message = "Courrier introuvable." });

            var authorizationResult = await _authorizationService.AuthorizeAsync(
                User,
                courrier.CDTO,
                "CourrierOwnerOrAdmin"
            );

            if (!authorizationResult.Succeeded)
                return Forbid();

            int? currentUserId;

            try
            {
                currentUserId = GetCurrentUserId();
            }
            catch
            {
                return Unauthorized(new { message = "Utilisateur non authentifié." });
            }

            var result = PieceJointe.ConfirmOcr(
                id,
                piece.CourrierId,
                dto.TexteOcr.Trim(),
                dto.OcrConfiance,
                dto.CorrigeManuellement,
                dto.CategorieId,
                dto.ScoreConfiance,
                dto.Methode,
                currentUserId
            );

            if (result == null)
            {
                return BadRequest(new
                {
                    message = "Erreur lors de la confirmation OCR et classification."
                });
            }

            return Ok(new
            {
                message = "OCR et classification confirmés avec succès.",
                result.OcrResultatId,
                result.ClassificationId,
                result.PieceJointeId,
                result.CourrierId,
                result.CategorieId
            });
        }

        private int? GetCurrentUserId()
        {
            var userIdValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (int.TryParse(userIdValue, out int userId))
                return userId;

            return null;
        }
    }
}