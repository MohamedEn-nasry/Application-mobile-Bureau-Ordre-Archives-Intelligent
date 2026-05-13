using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace ReportsDTO
{
    public class SummaryStatsDto
    {
        [JsonPropertyName("totalUsers")]
        public int TotalUsers { get; set; }

        [JsonPropertyName("totalAgents")]
        public int TotalAgents { get; set; }

        [JsonPropertyName("totalLecteurs")]
        public int TotalLecteurs { get; set; }

        [JsonPropertyName("totalReports")]
        public int TotalReports { get; set; }

        [JsonPropertyName("incomingMail")]
        public int IncomingMail { get; set; }

        [JsonPropertyName("outgoingMail")]
        public int OutgoingMail { get; set; }

        [JsonPropertyName("pendingMail")]
        public int PendingMail { get; set; }

        [JsonPropertyName("archivedMail")]
        public int ArchivedMail { get; set; }

        [JsonPropertyName("keyMetrics")]
        public KeyMetricsDto KeyMetrics { get; set; } = new KeyMetricsDto();
    }

    public class KeyMetricsDto
    {
        [JsonPropertyName("tauxTraitement")]
        public double TauxTraitement { get; set; }

        [JsonPropertyName("delaiMoyen")]
        public double DelaiMoyen { get; set; }

        [JsonPropertyName("courriersRetard")]
        public int CourriersRetard { get; set; }
    }

    public class MonthlyStatDto
    {
        [JsonPropertyName("month")]
        public string Month { get; set; } = string.Empty;

        [JsonPropertyName("entrant")]
        public int Entrant { get; set; }

        [JsonPropertyName("sortant")]
        public int Sortant { get; set; }
    }

    public class CategoryStatDto
    {
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("value")]
        public int Value { get; set; }
    }
}
