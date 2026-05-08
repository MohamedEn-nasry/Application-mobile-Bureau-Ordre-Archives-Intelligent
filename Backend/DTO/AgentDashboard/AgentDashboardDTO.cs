using System;
using System.Collections.Generic;
using System.Text;

namespace DTO.AgentDashboard
{
    public class AgentDashboardOverviewDTO
    {
        public string UserName { get; set; } = string.Empty;
        public string UserImage { get; set; } = string.Empty;
        public int UnreadNotifications { get; set; }

        public AgentDashboardStatsDTO Stats { get; set; } = new();

        public List<AssignedMailItemDTO> AssignedMails { get; set; } = new();
        public List<RecentActivityItemDTO> RecentActivities { get; set; } = new();
        public List<RecentOcrResultItemDTO> RecentOcrResults { get; set; } = new();
    }

    public class AgentDashboardStatsDTO
    {
        public int IncomingCount { get; set; }
        public int IncomingPending { get; set; }

        public int OutgoingCount { get; set; }
        public int OutgoingDrafts { get; set; }

        public int PendingTasksCount { get; set; }
        public string PendingTasksLabel { get; set; } = "requires action";

        public int RecentScansCount { get; set; }
        public string RecentScansLabel { get; set; } = "OCR processed";
    }

    public class AssignedMailItemDTO
    {
        public int Id { get; set; }
        public string Reference { get; set; } = string.Empty;
        public string Objet { get; set; } = string.Empty;
        public string Expediteur { get; set; } = string.Empty;
        public string DateCourrier { get; set; } = string.Empty;
        public string Statut { get; set; } = string.Empty;
    }

    public class RecentActivityItemDTO
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string TimeLabel { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
    }

    public class RecentOcrResultItemDTO
    {
        // Id نخليه courrierId باش frontend يقدر يمشي مباشرة للتفاصيل
        public int Id { get; set; }

        public int OcrResultatId { get; set; }

        public string Reference { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Excerpt { get; set; } = string.Empty;
        public double Confidence { get; set; }
        public string DateLabel { get; set; } = string.Empty;
    }
}