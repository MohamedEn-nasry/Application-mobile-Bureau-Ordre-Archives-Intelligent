using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BusinessLayer;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/agent/dashboard")]
    [Authorize(Roles = "Agent")]
    public class AgentDashboardController : ControllerBase
    {
        [HttpGet("overview")]
        public IActionResult GetOverview()
        {
            var agentId = GetCurrentUserId();

            if (agentId == null)
                return Unauthorized(new { message = "Utilisateur non authentifié." });

            var data = AgentDashboard.GetOverview(agentId.Value);

            return Ok(data);
        }

        private int? GetCurrentUserId()
        {
            var userIdValue =
                User.FindFirst("id")?.Value ??
                User.FindFirst("userId")?.Value ??
                User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (int.TryParse(userIdValue, out int userId))
                return userId;

            return null;
        }
    }
}