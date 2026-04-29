using System.Collections.Generic;
using Data_Access;
using ReportsDTO;

namespace BusinessLayer
{
    public class Reports
    {
        public static SummaryStatsDto GetDashboardSummaryStats()
        {
            return ReportsData.GetDashboardSummaryStats();
        }

        public static List<MonthlyStatDto> GetMonthlyStats()
        {
            return ReportsData.GetMonthlyStats();
        }

        public static List<CategoryStatDto> GetCategoryStats()
        {
            return ReportsData.GetCategoryStats();
        }
    }
}
