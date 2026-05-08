using Data_Access;
using DTO.AgentDashboard;

namespace BusinessLayer
{
    public class AgentDashboard
    {
        public static AgentDashboardOverviewDTO GetOverview(int agentId)
        {
            return AgentDashboardData.GetOverview(agentId);
        }
    }
}