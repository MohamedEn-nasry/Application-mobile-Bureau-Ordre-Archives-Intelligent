using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BusinessLayer;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/Reports")]
    [Authorize(Roles = "Admin")]
    public class ReportsController : ControllerBase
    {
        [HttpGet("overview")]
        public IActionResult GetOverview([FromQuery] string period = "6m")
        {
            var data = Reports.GetOverview(period);
            return Ok(data);
        }
    }
}