import { Result } from '../../../../core/utils/result';
import { Courrier } from '../entities/Courrier';

export interface LecteurCourrierFilters {
    type?: string;
    categorieId?: number;
    search?: string;
}

export interface LecteurCourrierRepository {
    getCourriers(filters?: LecteurCourrierFilters): Promise<Result<Courrier[]>>;
}
