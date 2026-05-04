import { Result, ok, fail } from '../../../../core/utils/result';
import { ServerFailure } from '../../../../core/error/failures';
import { Categorie } from '../../domain/entities/Categorie';
import { CategorieRepository } from '../../domain/repositories/CategorieRepository';
import { CategorieRemoteDataSource } from '../datasources/CategorieRemoteDataSource';
import { CategorieMapper } from '../mappers/CategorieMapper';

export class CategorieRepositoryImpl implements CategorieRepository {
  constructor(private remoteDataSource: CategorieRemoteDataSource) {}

  async getCategories(): Promise<Result<Categorie[]>> {
    try {
      const response = await this.remoteDataSource.getCategories();
      const categories = CategorieMapper.toDomainList(response);

      return ok(categories);
    } catch (error: any) {
      return fail(new ServerFailure(error.message));
    }
  }
}