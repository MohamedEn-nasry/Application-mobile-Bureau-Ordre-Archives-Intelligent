import { UseCase, NoParams } from '../../../../core/base/UseCase';
import { Result } from '../../../../core/utils/result';
import { Categorie } from '../entities/Categorie';
import { CategorieRepository } from '../repositories/CategorieRepository';

export class GetCategoriesUseCase implements UseCase<Categorie[], NoParams> {
  constructor(private repo: CategorieRepository) {}

  async execute(): Promise<Result<Categorie[]>> {
    return await this.repo.getCategories();
  }
}