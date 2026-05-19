using System;
using System.Collections.Generic;
using System.Text;

namespace DTO.LecteurDashboard
{
    public class LecteurDashboardOverviewDTO
    {
        public string UserFullName { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public string RoleName { get; set; } = "Lecteur";

        public int IncomingCount { get; set; }
        public int OutgoingCount { get; set; }
        public int ArchivedCount { get; set; }
        public int UnreadNotifications { get; set; }

        public List<LecteurRecentDocumentDTO> RecentDocuments { get; set; } = new();
        public List<LecteurUpdateDTO> RecentUpdates { get; set; } = new();

        public string LastUpdatedAt { get; set; } = string.Empty;
        public int WeeklyCourriers { get; set; }
        public int WeeklyArchives { get; set; }
    }

    public class LecteurRecentDocumentDTO
    {
        public int Id { get; set; }
        public string Reference { get; set; } = string.Empty;
        public string Objet { get; set; } = string.Empty;
        public string Source { get; set; } = string.Empty;
        public string Statut { get; set; } = string.Empty;
        public string DateCourrier { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
    }

    public class LecteurUpdateDTO
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string DateLabel { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
    }
}