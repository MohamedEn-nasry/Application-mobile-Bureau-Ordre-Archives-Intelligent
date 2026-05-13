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

        public static List<AgentOcrResultDTO> GetOcrResults(int agentId)
        {
            return AgentDashboardData.GetOcrResults(agentId);
        }
    }
}