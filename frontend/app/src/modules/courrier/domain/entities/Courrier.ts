import { BaseEntity } from '../../../../core/base/BaseEntity';

export type CourrierType = 'Entrant' | 'Sortant';

export type CourrierStatus =
  | 'ATraiter'
  | 'EnTraitement'
  | 'Traite'
  | 'Archive'
  | 'Brouillon'
  | 'Pret'
  | 'Envoye'
  | 'Recu';

export interface CourrierAttachment {
  id: number;
  fileName: string;
  mimeType: string;
  size: string;
  url?: string;
}

export interface CourrierTimelineItem {
  label: string;
  date?: string;
  done: boolean;
}

export class Courrier extends BaseEntity {
  constructor(
    Id: string,
    public readonly Reference: string,
    public readonly Type: CourrierType | string,
    public readonly DateCourrier: Date,
    public readonly Expediteur: string | null,
    public readonly Destinataire: string | null,
    public readonly Objet: string,
    public readonly Description: string | null,
    public readonly Statut: CourrierStatus | string,
    public readonly TexteOcr: string | null,
    public readonly CategorieId: number | null,
    public readonly AuteurId: number,
    public readonly AssigneA: number | null,
    public readonly CreatedAt: Date,
    public readonly UpdatedAt: Date,
    public readonly DateEcheance: Date | null,
    public readonly PieceJointeCount: number = 0,
  ) {
    super(Id);
  }

  get PersonName(): string {
    return this.Type === 'Entrant'
      ? this.Expediteur || ''
      : this.Destinataire || '';
  }

  get IsEntrant(): boolean {
    return this.Type === 'Entrant';
  }

  get IsSortant(): boolean {
    return this.Type === 'Sortant';
  }
}