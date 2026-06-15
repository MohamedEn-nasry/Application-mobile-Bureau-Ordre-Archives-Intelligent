export interface AgentOcrResultResponseModel {
    id: number;
    courrierId: number;
    pieceJointeId: number;
    reference: string;
    objet: string;
    type: string;
    texteExtrait: string;
    Confiance: number;
    createdAt: string;
}