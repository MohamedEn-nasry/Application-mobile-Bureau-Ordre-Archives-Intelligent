using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BusinessLayer;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/superagent/dashboard")]
    [Authorize(Roles = "SuperAgent")]
    public class SuperAgentDashboardController : ControllerBase
    {
        [HttpGet("overview")]
        public IActionResult GetOverview()
        {
            var superAgentId = GetCurrentUserId();

            if (superAgentId == null)
                return Unauthorized(new { message = "Utilisateur non authentifié." });

            var data = SuperAgentDashboard.GetOverview(superAgentId.Value);

            return Ok(data);
        }

        [HttpGet("ocr-results")]
        public IActionResult GetOcrResults()
        {
            var superAgentId = GetCurrentUserId();

            if (superAgentId == null)
                return Unauthorized(new { message = "Utilisateur non authentifié." });

            var results = SuperAgentDashboard.GetOcrResults(superAgentId.Value);

            return Ok(results);
        }

        private int? GetCurrentUserId()
        {
            var userIdValue =
                User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (int.TryParse(userIdValue, out int userId))
                return userId;

            return null;
        }
    }
}
