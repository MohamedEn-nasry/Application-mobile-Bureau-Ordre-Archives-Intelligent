using System.Collections.Generic;
using Data_Access;
using DTO.AgentDashboard;

namespace BusinessLayer
{
    public class SuperAgentDashboard
    {
        public static AgentDashboardOverviewDTO GetOverview(int superAgentId)
        {
            return SuperAgentDashboardData.GetOverview(superAgentId);
        }

        public static List<AgentOcrResultDTO> GetOcrResults(int superAgentId)
        {
            return SuperAgentDashboardData.GetOcrResults(superAgentId);
        }
    }
}
