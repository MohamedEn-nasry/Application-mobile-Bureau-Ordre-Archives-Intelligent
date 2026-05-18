using Business_Layer;
using BusinessLayer;
using DTO.Courriers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Presentation.Mappings;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/Courriers")]
    [Authorize]
    public class CourrierAPIController : ControllerBase
    {

        private readonly IAuthorizationService _authorizationService;

        public CourrierAPIController(IAuthorizationService authorizationService)
        {
            _authorizationService = authorizationService;
        }




        // GET: api/Courriers
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public IActionResult GetAll()
        {
            var courriers = Courrier.GetAllCourriers();

            var response = CourrierMapper.ToResponseDtoList(courriers);

            return Ok(response);
        }

        // GET: api/Courriers/5
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var courrier = Courrier.Find(id);

            if (courrier == null)
                return NotFound(new { message = "Courrier introuvable." });

            bool isLecteur = User.Claims.Any(c =>
                                        c.Type == ClaimTypes.Role &&
                                        c.Value.Equals("LECTEUR", StringComparison.OrdinalIgnoreCase)
                                    );

            if (!isLecteur)
            {
                var authorizationResult = await _authorizationService.AuthorizeAsync(
                   User,
                   courrier.CDTO,
                   "CourrierOwnerOrAdmin"
               );

                if (!authorizationResult.Succeeded)
                    return Forbid();
            }


            var response = CourrierMapper.ToResponseDto(courrier.CDTO);

            return Ok(response);
        }

        // GET: api/Courriers/assigned/me
        [HttpGet("assigned/me")]
        public IActionResult GetMyAssignedCourriers()
        {
            var currentUserIdValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!int.TryParse(currentUserIdValue, out int currentUserId))
                return Unauthorized();

            var courriers = Courrier.GetCourriersByAssigneA(currentUserId);

            var response = CourrierMapper.ToResponseDtoList(courriers);

            return Ok(response);
        }

        // POST: api/Courriers
        [HttpPost]
        [Authorize(Roles = "Admin,Agent")]
        public IActionResult Create([FromBody] CreateCourrierDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var auteurId = GetCurrentUserId();

            if (auteurId == null)
                return Unauthorized(new { message = "Utilisateur non authentifié." });

            var courrierDto = CourrierMapper.ToCourrierDto(dto, auteurId.Value);

            var courrier = new Courrier(courrierDto);

            if (!courrier.Save())
                return BadRequest(new { message = "Erreur lors de la création du courrier." });

            if (courrier.AssigneA.HasValue)
            {
                Notification.CreateForUser(
                    courrier.AssigneA.Value,
                    "Nouveau courrier assigné",
                    $"Le courrier {courrier.Reference} vous a été assigné.",
                    "CourrierAssigned",
                    "Courrier",
                    courrier.Id,
                    auteurId.Value
                );
            }

            var response = CourrierMapper.ToResponseDto(courrier.CDTO);

            return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
        }

        // PUT: api/Courriers/5
        [HttpPut("{id:int}")]
        [Authorize(Roles = "Agent")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateCourrierDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingCourrier = Courrier.Find(id);

            if (existingCourrier == null)
                return NotFound(new { message = "Courrier introuvable." });

            var authorizationResult = await _authorizationService.AuthorizeAsync(
                User,
                existingCourrier.CDTO,
                "CourrierOwnerOrAdmin"
            );

            if (!authorizationResult.Succeeded)
                return Forbid();

            var currentUserId = GetCurrentUserId();

            var oldStatut = existingCourrier.Statut;
            var oldAssigneA = existingCourrier.AssigneA;
            var oldReference = existingCourrier.Reference;

            var updatedDto = CourrierMapper.ApplyUpdate(existingCourrier.CDTO, dto);

            var courrierToUpdate = new Courrier(updatedDto, Courrier.enMode.Update);

            if (!courrierToUpdate.Save())
                return BadRequest(new { message = "Erreur lors de la modification du courrier." });

            // 1) Notification إذا تبدل statut
            if (!string.Equals(oldStatut, dto.Statut, StringComparison.OrdinalIgnoreCase))
            {
                if (updatedDto.AssigneA.HasValue)
                {
                    Notification.CreateForUser(
                        updatedDto.AssigneA.Value,
                        "Statut du courrier modifié",
                        $"Le statut du courrier {oldReference} est maintenant {dto.Statut}.",
                        "CourrierStatusChanged",
                        "Courrier",
                        id,
                        currentUserId
                    );
                }
            }

            // 2) Notification إذا تبدل assigneA
            if (oldAssigneA != updatedDto.AssigneA && updatedDto.AssigneA.HasValue)
            {
                Notification.CreateForUser(
                    updatedDto.AssigneA.Value,
                    "Nouveau courrier assigné",
                    $"Le courrier {oldReference} vous a été assigné.",
                    "CourrierAssigned",
                    "Courrier",
                    id,
                    currentUserId
                );
            }

            return NoContent();
        }

        // PUT: api/Courriers/5/status
        [HttpPut("{id:int}/status")]
        [Authorize(Roles = "Agent")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateCourrierStatusDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingCourrier = Courrier.Find(id);

            if (existingCourrier == null)
                return NotFound(new { message = "Courrier introuvable." });

            var authorizationResult = await _authorizationService.AuthorizeAsync(
                User,
                existingCourrier.CDTO,
                "CourrierOwnerOrAdmin"
            );

            if (!authorizationResult.Succeeded)
                return Forbid();

            var oldStatut = existingCourrier.Statut;
            var oldReference = existingCourrier.Reference;
            var currentUserId = GetCurrentUserId();



            var updated = Courrier.UpdateStatutWithHistory(
                                                            id,
                                                            dto.Statut,
                                                            currentUserId,
                                                            dto.Commentaire
                                                        );

        

            if (!updated)
                return BadRequest(new { message = "Erreur lors du changement de statut." });

            // Créer notification فقط إذا تبدل statut فعلاً
            if (!string.Equals(oldStatut, dto.Statut, StringComparison.OrdinalIgnoreCase))
            {
                // إرسال notification للمستخدم المعيّن له courrier
                if (existingCourrier.AssigneA.HasValue)
                {
                    Notification.CreateForUser(
                        existingCourrier.AssigneA.Value,
                        "Statut du courrier modifié",
                        $"Le statut du courrier {oldReference} est maintenant {dto.Statut}.",
                        "CourrierStatusChanged",
                        "Courrier",
                        id,
                        currentUserId
                    );
                }

                // اختياري: إرسال notification لصاحب courrier إذا كان مختلف عن الشخص المعيّن
                if (existingCourrier.AuteurId != existingCourrier.AssigneA)
                {
                    Notification.CreateForUser(
                        existingCourrier.AuteurId,
                        "Statut du courrier modifié",
                        $"Le statut du courrier {oldReference} est maintenant {dto.Statut}.",
                        "CourrierStatusChanged",
                        "Courrier",
                        id,
                        currentUserId
                    );
                }
            }

            return NoContent();
        }

        // DELETE: api/Courriers/5
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        public IActionResult Delete(int id)
        {
            var existingCourrier = Courrier.Find(id);

            if (existingCourrier == null)
                return NotFound(new { message = "Courrier introuvable." });

            var deleted = Courrier.Delete(id);

            if (!deleted)
                return BadRequest(new { message = "Erreur lors de la suppression du courrier." });

            return NoContent();
        }

        // GET: api/Courriers/search?keyword=test&type=Entrant&statut=ATraiter
        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] CourrierSearchDto search)
        {
            var courriers = Courrier.GetAllCourriers();

            if (!User.IsInRole("Admin"))
            { 
                var userIdValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value; 
                if (!int.TryParse(userIdValue, out int currentUserId)) return Unauthorized();
                courriers = courriers.Where(c => c.AuteurId == currentUserId || c.AssigneA == currentUserId).ToList();
            }

            if (!string.IsNullOrWhiteSpace(search.Keyword))
            {
                string keyword = search.Keyword.ToLower();

                courriers = courriers
                    .Where(c =>
                        (!string.IsNullOrEmpty(c.Reference) && c.Reference.ToLower().Contains(keyword)) ||
                        (!string.IsNullOrEmpty(c.Objet) && c.Objet.ToLower().Contains(keyword)) ||
                        (!string.IsNullOrEmpty(c.Description) && c.Description.ToLower().Contains(keyword)) ||
                        (!string.IsNullOrEmpty(c.Expediteur) && c.Expediteur.ToLower().Contains(keyword)) ||
                        (!string.IsNullOrEmpty(c.Destinataire) && c.Destinataire.ToLower().Contains(keyword)) ||
                        (!string.IsNullOrEmpty(c.TexteOcr) && c.TexteOcr.ToLower().Contains(keyword))
                    )
                    .ToList();
            }

            if (!string.IsNullOrWhiteSpace(search.Type))
            {
                courriers = courriers
                    .Where(c => c.Type.Equals(search.Type, StringComparison.OrdinalIgnoreCase))
                    .ToList();
            }

            if (!string.IsNullOrWhiteSpace(search.Statut))
            {
                courriers = courriers
                    .Where(c => c.Statut.Equals(search.Statut, StringComparison.OrdinalIgnoreCase))
                    .ToList();
            }

            if (search.CategorieId.HasValue)
            {
                courriers = courriers
                    .Where(c => c.CategorieId == search.CategorieId.Value)
                    .ToList();
            }

            if (search.AuteurId.HasValue)
            {
                courriers = courriers
                    .Where(c => c.AuteurId == search.AuteurId.Value)
                    .ToList();
            }

            if (search.AssigneA.HasValue)
            {
                courriers = courriers
                    .Where(c => c.AssigneA == search.AssigneA.Value)
                    .ToList();
            }

            if (search.DateDebut.HasValue)
            {
                courriers = courriers
                    .Where(c => c.DateCourrier.Date >= search.DateDebut.Value.Date)
                    .ToList();
            }

            if (search.DateFin.HasValue)
            {
                courriers = courriers
                    .Where(c => c.DateCourrier.Date <= search.DateFin.Value.Date)
                    .ToList();
            }

            var response = CourrierMapper.ToResponseDtoList(courriers);

            return Ok(response);
        }


        [HttpGet("{id:int}/historique-statut")]
        [Authorize(Roles = "Admin,Agent,Lecteur")]
        public async Task<IActionResult> GetHistoriqueStatut(int id)
        {
            var existingCourrier = Courrier.Find(id);

            if (existingCourrier == null)
                return NotFound(new { message = "Courrier introuvable." });

            var authorizationResult = await _authorizationService.AuthorizeAsync(
                User,
                existingCourrier.CDTO,
                "CourrierOwnerOrAdmin"
            );

            if (!authorizationResult.Succeeded)
                return Forbid();

            var historique = HistoriqueStatut.GetByCourrierId(id);

            return Ok(historique);
        }

        [HttpGet("agent/incoming")]
        [Authorize(Roles = "Agent")]
        public IActionResult GetAgentIncomingCourriers()
        {
            int? currentUserId;

            try
            {
                currentUserId = GetCurrentUserId();
            }
            catch
            {
                return Unauthorized(new { message = "Utilisateur non authentifié." });
            }

            if (!currentUserId.HasValue)
            {
                return Unauthorized(new { message = "Utilisateur non authentifié." });
            }

            var courriers = Courrier.GetCourriersByAssigneAOrAuteurId(currentUserId.Value)
                .Where(c => string.Equals(c.Type, "Entrant", StringComparison.OrdinalIgnoreCase))
                .OrderByDescending(c => c.DateCourrier)
                .ToList();

            return Ok(courriers);
        }

        [HttpGet("agent/outgoing")]
        [Authorize(Roles = "Agent")]
        public IActionResult GetAgentOutgoingCourriers()
        {
            int? currentUserId;

            try
            {
                currentUserId = GetCurrentUserId();
            }
            catch
            {
                return Unauthorized(new { message = "Utilisateur non authentifié." });
            }

            if (!currentUserId.HasValue)
            {
                return Unauthorized(new { message = "Utilisateur non authentifié." });
            }

            var courriers = Courrier.GetCourriersByAssigneAOrAuteurId(currentUserId.Value)
                .Where(c => string.Equals(c.Type, "Sortant", StringComparison.OrdinalIgnoreCase))
                .OrderByDescending(c => c.DateCourrier)
                .ToList();

            return Ok(courriers);
        }



        [HttpPut("{id:int}/reassign")]
        [Authorize(Roles = "Admin,Agent")]
        public IActionResult ReassignCourrier(int id, [FromBody] ReassignCourrierDTO dto)
        {
            if (dto.AssigneA <= 0)
                return BadRequest(new { message = "Utilisateur assigné invalide." });

            var currentUserId = GetCurrentUserId();
        
                if(!currentUserId.HasValue) {
                    return Unauthorized(new { message = "Utilisateur non authentifié." });
                }

            var success = Courrier.ReassignCourrier(
                id,
                dto.AssigneA,
                currentUserId.Value,
                dto.Commentaire
            );

            if (!success)
                return BadRequest(new { message = "Réassignation impossible. Vérifiez le courrier ou l'utilisateur." });

            return NoContent();
        }

        [HttpGet("{id:int}/history")]
        [Authorize(Roles = "Admin,Agent,Lecteur")]
        public IActionResult GetCourrierHistory(int id)
        {
            var history = Courrier.GetCourrierHistory(id);
            return Ok(history);
        }


        private int? GetCurrentUserId()
        {
            var userIdValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (int.TryParse(userIdValue, out int userId))
                return userId;

            return null;
        }


        [HttpGet("lecteur")]
        [Authorize(Roles = "Lecteur,SuperAgent")]
        public IActionResult GetCourriersForLecteur([FromQuery] string? type,[FromQuery] int? categorieId, [FromQuery] string? search)
        {
            int? lecteurId = GetCurrentUserId();

            if (!lecteurId.HasValue)
            {
                return Unauthorized(new { message = "Utilisateur non authentifié." });
            }

            var courriers = Courrier.GetCourriersForLecteurByCategories(
                lecteurId.Value,
                type,
                categorieId,
                search
            );

            return Ok(courriers);
        }

     

    }
}