using Data_Access;
using DTO.Reports;

namespace BusinessLayer
{
    public class Reports
    {
        public static ReportsOverviewDTO GetOverview(string period)
        {
            return ReportsData.GetOverview(period);
        }
    }
}