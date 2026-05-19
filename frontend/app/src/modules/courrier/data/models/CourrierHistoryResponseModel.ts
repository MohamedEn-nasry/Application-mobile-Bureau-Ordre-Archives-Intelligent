export interface CourrierHistoryResponseModel {
    id: number;
    courrierId: number;
    ancienStatut: string;
    nouveauStatut: string;
    modifiePar: number;
    modifieParNom: string;
    commentaire?: string | null;
    changedAt: string;
}