using Microsoft.AspNetCore.Mvc;

namespace YourProject.Controllers
{
    [ApiController]
    [Route("api/dashboard")]
    public class DashboardController : ControllerBase
    {
        [HttpGet("stats")]
        public IActionResult GetSummaryStats()
        {
            var stats = new SummaryStatsDto
            {
                TotalUsers = 120,
                TotalAgents = 25,
                TotalLecteurs = 18,
                TotalReports = 42,
                IncomingMail = 230,
                OutgoingMail = 150,
                PendingMail = 12,
                ArchivedMail = 88
            };

            return Ok(stats);
        }

        [HttpGet("activity")]
        public IActionResult GetRecentActivity()
        {
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

    public class SummaryStatsDto
    {
        public int TotalUsers { get; set; }
        public int TotalAgents { get; set; }
        public int TotalLecteurs { get; set; }
        public int TotalReports { get; set; }
        public int IncomingMail { get; set; }
        public int OutgoingMail { get; set; }
        public int PendingMail { get; set; }
        public int ArchivedMail { get; set; }
    }

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