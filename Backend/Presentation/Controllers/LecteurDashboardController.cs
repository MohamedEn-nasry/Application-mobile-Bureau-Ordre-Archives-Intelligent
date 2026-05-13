using System.Security.Claims;
using BusinessLayer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Lecteur,SuperAgent")]
    public class LecteurDashboardController : ControllerBase
    {
        [HttpGet("overview")]
        public IActionResult GetOverview()
        {
            var userId = GetCurrentUserId();

            var overview = LecteurDashboard.GetOverview(userId);

            overview.UserFullName =
                User.FindFirst(ClaimTypes.Name)?.Value ?? "Lecteur";

            overview.UserEmail =
                User.FindFirst(ClaimTypes.Email)?.Value ?? "";

            overview.RoleName =
                User.FindFirst(ClaimTypes.Role)?.Value ?? "Lecteur";

            return Ok(overview);
        }

        private int GetCurrentUserId()
        {
            var value =
                User.FindFirst(ClaimTypes.NameIdentifier)?.Value ??
                User.FindFirst("userId")?.Value ??
                User.FindFirst("id")?.Value;

            if (!int.TryParse(value, out var userId))
                throw new UnauthorizedAccessException("Utilisateur non authentifié.");

            return userId;
        }
    }
}