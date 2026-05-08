using Data_Access;
using DTO.PiecesJointes;

namespace BusinessLayer
{
    public class PieceJointe
    {
        public static int Add(PieceJointeDTO dto)
        {
            return PieceJointeData.Add(dto);
        }

        public static List<PieceJointeDTO> GetByCourrierId(int courrierId)
        {
            return PieceJointeData.GetByCourrierId(courrierId);
        }

        public static PieceJointeDTO? Find(int id)
        {
            return PieceJointeData.GetById(id);
        }

        public static bool Delete(int id)
        {
            return PieceJointeData.Delete(id);
        }

        public static ConfirmOcrResponseDTO? ConfirmOcr(
            int pieceJointeId,
            int courrierId,
            string texteOcr,
            double ocrConfiance,
            bool corrigeManuellement,
            int? categorieId,
            double scoreConfiance,
            string methode,
            int? valideePar)
        {
            return PieceJointeData.ConfirmOcr(
                pieceJointeId,
                courrierId,
                texteOcr,
                ocrConfiance,
                corrigeManuellement,
                categorieId,
                scoreConfiance,
                methode,
                valideePar
            );
        }
    }
}