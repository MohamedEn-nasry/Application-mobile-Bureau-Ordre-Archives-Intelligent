import { Courrier } from '../../domain/entities/Courrier';
import { CourrierResponseModel } from '../datasources/CourrierRemoteDataSource';

export class CourrierMapper {
  static toDomain(model: CourrierResponseModel): Courrier {
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
      model.dateEcheance ? new Date(model.dateEcheance) : null
    );
  }

  static toDomainList(models: CourrierResponseModel[]): Courrier[] {
    return models.map(this.toDomain);
  }
}