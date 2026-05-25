using Data_Access;
using DTO.LecteurDashboard;

namespace BusinessLayer
{
    public class LecteurDashboard
    {
        public static LecteurDashboardOverviewDTO GetOverview(int lecteurId)
        {
            return LecteurDashboardData.GetOverview(lecteurId);
        }
    }
}