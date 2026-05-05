import { Result } from '../../../../core/utils/result';
import { Categorie } from '../entities/Categorie';

export interface CategorieRepository {
  getCategories(): Promise<Result<Categorie[]>>;
}