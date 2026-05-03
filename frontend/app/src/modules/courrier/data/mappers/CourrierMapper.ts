import { Courrier } from '../../domain/entities/Courrier';
import { CourrierResponseModel } from '../datasources/CourrierRemoteDataSource';

const categoryMap: Record<number, string> = {
  1: 'RH',
  2: 'Finance',
  3: 'Juridique',
  4: 'Rapports',
};

export class CourrierMapper {
  static toDomain(model: CourrierResponseModel): Courrier {
    const categorieLabel =
      model.categorieId !== null && model.categorieId !== undefined
        ? categoryMap[model.categorieId] || 'Catégorie'
        : 'Catégorie';

    const attachments =
      model.type === 'Entrant'
        ? [
            {
              id: 1,
              fileName: 'demande_conge_benali.pdf',
              mimeType: 'PDF',
              size: '245 KB',
            },
            {
              id: 2,
              fileName: 'justificatif_medical.pdf',
              mimeType: 'PDF',
              size: '245 KB',
            },
          ]
        : [
            {
              id: 1,
              fileName: 'rapport_activite_mars2026.pdf',
              mimeType: 'PDF',
              size: '1.2 MB',
            },
          ];

    const timeline =
      model.type === 'Sortant'
        ? [
            {
              label: 'Rédigé',
              date: '23 Mar 2026 — 14:30',
              done: true,
            },
            {
              label: 'Validé par Admin',
              date: '24 Mar 2026 — 08:00',
              done: true,
            },
            {
              label: 'Envoyé',
              date: '24 Mar 2026 — 08:45',
              done: true,
            },
            {
              label: 'Accusé de réception',
              date: 'En attente',
              done: false,
            },
          ]
        : [];

    return new Courrier(
      model.id.toString(),
      model.reference,
      model.type,
      new Date(model.dateCourrier),
      model.expediteur ?? null,
      model.destinataire ?? null,
      model.objet,
      model.description ?? null,
      model.statut,
      model.texteOcr ?? null,
      model.categorieId ?? null,
      model.auteurId,
      model.assigneA ?? null,
      new Date(model.createdAt),
      new Date(model.updatedAt),
      model.dateEcheance ? new Date(model.dateEcheance) : null,
      categorieLabel,
      attachments,
      timeline
    );
  }

  static toDomainList(models: CourrierResponseModel[]): Courrier[] {
    return models.map(this.toDomain);
  }
}