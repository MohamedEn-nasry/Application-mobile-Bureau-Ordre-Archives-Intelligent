import { Categorie } from '../../domain/entities/Categorie';
import { CategorieResponseModel } from '../datasources/CategorieRemoteDataSource';

export class CategorieMapper {
  static toDomain(model: CategorieResponseModel): Categorie {
    return new Categorie(
      model.id.toString(),
      model.nom,
      model.description ?? null
    );
  }

  static toDomainList(models: CategorieResponseModel[]): Categorie[] {
    return models.map(this.toDomain);
  }
}