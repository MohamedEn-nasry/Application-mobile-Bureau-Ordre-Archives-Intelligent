
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BusinessLayer;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using BusinessLayer;
using ReportsDTO;


namespace backend.Controllers
{
    [ApiController]
    [Route("api/dashboard")]
    [Authorize(Roles = "Admin")]
    public class DashboardController : ControllerBase
    {
        [HttpGet("stats")]
        public IActionResult GetSummaryStats([FromQuery] int? days)
        {

            var stats = Dashboard.GetSummaryStats();

            var stats = Reports.GetDashboardSummaryStats(days);

            return Ok(stats);
        }

        [HttpGet("charts")]
        public IActionResult GetChartStats([FromQuery] int? days)
        {
            var monthlyStats   = Reports.GetMonthlyStats(days);
            var categoryStats  = Reports.GetCategoryStats(days);

            return Ok(new
            {
                monthlyStats  = monthlyStats,
                categoryStats = categoryStats
            });
        }


        [HttpGet("activity")]
        public IActionResult GetRecentActivity()
        {

            var activities = Dashboard.GetRecentActivity();
            return Ok(activities);
        }
    }

            // Mock data for activity since there is no Activity table yet.
            var activities = new List<ActivityResponseDto>
            {
                new ActivityResponseDto
                {
                    Id = "1",
                    User = "Ahmed",
                    Action = "A envoyé un courrier",
                    Time = "2026-04-23 09:15",
                    Icon = ActivityIcons.Mail
                },
                new ActivityResponseDto
                {
                    Id = "2",
                    User = "Sara",
                    Action = "A archivé un document",
                    Time = "2026-04-23 10:30",
                    Icon = ActivityIcons.Archive
                },
                new ActivityResponseDto
                {
                    Id = "3",
                    User = "Youssef",
                    Action = "A ajouté un utilisateur",
                    Time = "2026-04-23 11:00",
                    Icon = ActivityIcons.UserPlus
                },
                new ActivityResponseDto
                {
                    Id = "4",
                    User = "Admin",
                    Action = "A téléchargé un rapport",
                    Time = "2026-04-23 11:45",
                    Icon = ActivityIcons.Download
                },
                new ActivityResponseDto
                {
                    Id = "5",
                    User = "Lina",
                    Action = "A consulté le courrier",
                    Time = "2026-04-23 12:10",
                    Icon = ActivityIcons.Eye
                }
            };

            return Ok(activities);
        }
    }

    // Keep ActivityResponseDto and ActivityIcons here since they are just for the mock data
    public class ActivityResponseDto
    {
        public string Id { get; set; } = string.Empty;
        public string User { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty;
        public string Time { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
    }

    public static class ActivityIcons
    {
        public const string Mail = "mail";
        public const string Archive = "archive";
        public const string UserPlus = "user-plus";
        public const string Download = "download";
        public const string Eye = "eye";
    }

}