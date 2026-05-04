import { BaseEntity } from '../../../../core/base/BaseEntity';

export type IncomingMailStatus = 'pending' | 'in_progress' | 'completed';
export type OCRStatus = 'pending' | 'processing' | 'completed' | 'failed';

export class IncomingMail extends BaseEntity {
  constructor(
    Id: string,
    public readonly Reference: string,
    public readonly Type: string,
    public readonly DateCourrier: Date,
    public readonly Expediteur: string | null,
    public readonly Destinataire: string | null,
    public readonly Objet: string,
    public readonly Description: string | null,
    public readonly Statut: string,
    public readonly TexteOcr: string | null,
    public readonly CategorieId: number,
    public readonly AuteurId: number,
    public readonly AssigneA: number | null,
    public readonly CreatedAt: Date,
    public readonly UpdatedAt: Date,
    public readonly DateEcheance: Date | null
  ) {
    super(Id);
  }

  static create(
    reference: string,
    type: string,
    dateCourrier: Date,
    expediteur: string | null,
    destinataire: string | null,
    objet: string,
    description: string | null,
    statut: string,
    texteOcr: string | null,
    categorieId: number,
    auteurId: number,
    assigneA: number | null,
    createdAt: Date,
    updatedAt: Date,
    dateEcheance: Date | null
  ): IncomingMail {
    const id = Math.random().toString(36).substr(2, 9);
    return new IncomingMail(
      id,
      reference,
      type,
      dateCourrier,
      expediteur,
      destinataire,
      objet,
      description,
      statut,
      texteOcr,
      categorieId,
      auteurId,
      assigneA,
      createdAt,
      updatedAt,
      dateEcheance
    );
  }
}
