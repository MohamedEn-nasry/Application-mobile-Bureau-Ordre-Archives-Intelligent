using System;
using System.Collections.Generic;

namespace ReportsDTO
{
    public class SummaryStatsDto
    {
        public int TotalUsers { get; set; }
        public int IncomingMail { get; set; }
        public int OutgoingMail { get; set; }
        public int PendingMail { get; set; }
        public int ArchivedMail { get; set; }
    }

    public class MonthlyStatDto
    {
        public string Month { get; set; } = string.Empty;
        public int Entrant { get; set; }
        public int Sortant { get; set; }
    }

    public class CategoryStatDto
    {
        public string Name { get; set; } = string.Empty;
        public int Value { get; set; }
    }
}
