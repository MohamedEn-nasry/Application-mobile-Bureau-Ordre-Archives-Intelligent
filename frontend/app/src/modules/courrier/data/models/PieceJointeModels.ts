export interface SelectedFileModel {
    uri: string;
    name: string;
    mimeType: string;
    size?: number;

    file?: File;//import in web
}

export interface OcrClassificationModel {
    suggestedCategorieId?: number | null;
    suggestedCategorieName?: string | null;
    scoreConfiance: number;
    methode: string;
    matchedKeywords: string[];
    message: string;
}

export interface OcrPreviewResultModel {
    pieceJointeId: number;
    courrierId: number;
    texteOcr: string;
    ocrConfiance: number;
    classification: OcrClassificationModel;
}

export interface PieceJointeResponseModel {
    id: number;
    courrierId: number;
    nomFichier: string;
    typeFichier: string;
    cheminFichier: string;
    format: string;
    taille: number;
    estScan: boolean;
    createdAt: string;
}

export interface ConfirmOcrPayloadModel {
    texteOcr: string;
    ocrConfiance: number;
    corrigeManuellement: boolean;
    categorieId?: number | null;
    scoreConfiance: number;
    methode: string;
}