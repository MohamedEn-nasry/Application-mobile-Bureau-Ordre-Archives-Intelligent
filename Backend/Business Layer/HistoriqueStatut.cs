using Data_Access;
using DTO.Historiques;

namespace BusinessLayer
{
    public class HistoriqueStatut
    {
        public static List<HistoriqueStatutDTO> GetByCourrierId(int courrierId)
        {
            return HistoriqueStatutData.GetByCourrierId(courrierId);
        }
    }
}