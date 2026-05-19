using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BusinessLayer;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/dashboard")]
    [Authorize(Roles = "Admin")]
    public class DashboardController : ControllerBase
    {
        [HttpGet("stats")]
        public IActionResult GetSummaryStats()
        {
            var stats = Dashboard.GetSummaryStats();
            return Ok(stats);
        }

        [HttpGet("activity")]
        public IActionResult GetRecentActivity()
        {
            var activities = Dashboard.GetRecentActivity();
            return Ok(activities);
        }
    }
}