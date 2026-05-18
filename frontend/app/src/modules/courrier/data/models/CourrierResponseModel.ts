/**
 * Shared response model for all courrier-related API endpoints.
 * Replaces: AgentIncomingMailResponseModel, AgentOutgoingMailResponseModel, LecteurCourrierResponseModel
 */
export interface CourrierResponseModel {
    id: number;
    reference: string;
    type: string;
    dateCourrier: string;
    expediteur?: string | null;
    destinataire?: string | null;
    objet: string;
    description?: string | null;
    statut: string;
    texteOcr?: string | null;
    categorieId: number;
    auteurId: number;
    assigneA?: number | null;
    createdAt: string;
    updatedAt: string;
    dateEcheance?: string | null;
    pieceJointeCount?: number;
}
