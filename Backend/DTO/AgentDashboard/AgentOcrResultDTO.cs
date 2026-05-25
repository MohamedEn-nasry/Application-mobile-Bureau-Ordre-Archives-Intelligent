using System;
using System.Collections.Generic;
using System.Text;

namespace DTO.AgentDashboard
{
    public class AgentOcrResultDTO
    {
        public int Id { get; set; }
        public int CourrierId { get; set; }
        public int PieceJointeId { get; set; }

        public string Reference { get; set; } = string.Empty;
        public string Objet { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;

        public string TexteExtrait { get; set; } = string.Empty;
        public double Confidence { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}