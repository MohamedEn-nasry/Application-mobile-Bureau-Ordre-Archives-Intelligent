using System;
using System.Collections.Generic;
using System.Text;

namespace DTO.Dashboard
{
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
}