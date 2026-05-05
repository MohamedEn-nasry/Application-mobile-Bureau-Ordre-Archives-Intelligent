
using Data_Access;
using DTO.Reports;

using System.Collections.Generic;
using Data_Access;


namespace BusinessLayer
{
    public class Reports
    {

        public static ReportsOverviewDTO GetOverview(string period)
        {
            return ReportsData.GetOverview(period);
        }
    

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

