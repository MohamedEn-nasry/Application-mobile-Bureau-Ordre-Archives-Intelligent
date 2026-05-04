using System.Collections.Generic;
using Data_Access;
using ReportsDTO;

namespace BusinessLayer
{
    public class Reports
    {
        public static SummaryStatsDto GetDashboardSummaryStats(int? days = null)
        {
            return ReportsData.GetDashboardSummaryStats(days);
        }

        public static List<MonthlyStatDto> GetMonthlyStats(int? days = null)
        {
            return ReportsData.GetMonthlyStats(days);
        }

        public static List<CategoryStatDto> GetCategoryStats(int? days = null)
        {
            return ReportsData.GetCategoryStats(days);
        }
    }
}
