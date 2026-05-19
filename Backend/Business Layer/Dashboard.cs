using System;
using System.Collections.Generic;
using System.Text;

using Data_Access;
using DTO.Dashboard;

namespace BusinessLayer
{
    public class Dashboard
    {
        public static SummaryStatsDto GetSummaryStats()
        {
            return DashboardData.GetSummaryStats();
        }

        public static List<ActivityResponseDto> GetRecentActivity()
        {
            return DashboardData.GetRecentActivity();
        }
    }
}