import { Result } from '../../../../core/utils/result';
import { Courrier } from '../entities/Courrier';
import { LecteurCourrierRepository, LecteurCourrierFilters } from '../repositories/LecteurCourrierRepository';

export class GetLecteurCourriersUseCase {
    constructor(
        private repo: LecteurCourrierRepository
    ) { }

    async execute(filters?: LecteurCourrierFilters): Promise<Result<Courrier[]>> {
        return await this.repo.getCourriers(filters);
    }
}
