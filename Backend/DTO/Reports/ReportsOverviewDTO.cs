using System;
using System.Collections.Generic;
using System.Text;

namespace DTO.Reports
{
    public class ReportsOverviewDTO
    {
        public ReportsSummaryDTO Summary { get; set; }
        public List<MonthlyCourrierDTO> MonthlyCourriers { get; set; }
        public List<CategoryReportDTO> CategoryDistribution { get; set; }
        public List<UserActivityDTO> UserActivity { get; set; }
        public List<KeyIndicatorDTO> KeyIndicators { get; set; }

        public ReportsOverviewDTO(
            ReportsSummaryDTO summary,
            List<MonthlyCourrierDTO> monthlyCourriers,
            List<CategoryReportDTO> categoryDistribution,
            List<UserActivityDTO> userActivity,
            List<KeyIndicatorDTO> keyIndicators)
        {
            Summary = summary;
            MonthlyCourriers = monthlyCourriers;
            CategoryDistribution = categoryDistribution;
            UserActivity = userActivity;
            KeyIndicators = keyIndicators;
        }
    }

    public class ReportsSummaryDTO
    {
        public int Entrant { get; set; }
        public int Sortant { get; set; }
        public int EnAttente { get; set; }
        public int Archives { get; set; }

        public ReportsSummaryDTO(int entrant, int sortant, int enAttente, int archives)
        {
            Entrant = entrant;
            Sortant = sortant;
            EnAttente = enAttente;
            Archives = archives;
        }
    }

    public class MonthlyCourrierDTO
    {
        public string Label { get; set; }
        public int Entrant { get; set; }
        public int Sortant { get; set; }

        public MonthlyCourrierDTO(string label, int entrant, int sortant)
        {
            Label = label;
            Entrant = entrant;
            Sortant = sortant;
        }
    }

    public class CategoryReportDTO
    {
        public string Name { get; set; }
        public int Count { get; set; }
        public decimal Percentage { get; set; }

        public CategoryReportDTO(string name, int count, decimal percentage)
        {
            Name = name;
            Count = count;
            Percentage = percentage;
        }
    }

    public class UserActivityDTO
    {
        public string Label { get; set; }
        public int Count { get; set; }

        public UserActivityDTO(string label, int count)
        {
            Label = label;
            Count = count;
        }
    }

    public class KeyIndicatorDTO
    {
        public string Label { get; set; }
        public string Value { get; set; }
        public string Delta { get; set; }
        public bool IsPositive { get; set; }

        public KeyIndicatorDTO(string label, string value, string delta, bool isPositive)
        {
            Label = label;
            Value = value;
            Delta = delta;
            IsPositive = isPositive;
        }
    }
}