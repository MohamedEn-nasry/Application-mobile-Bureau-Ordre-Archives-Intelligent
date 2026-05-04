import { Result } from '../../../../core/utils/result';
import { Courrier } from '../entities/Courrier';

export interface CreateCourrierParams {
  reference: string;
  type: string;
  dateCourrier: string;
  expediteur?: string | null;
  destinataire?: string | null;
  objet: string;
  description?: string | null;
  texteOcr?: string | null;
  categorieId?: number | null;
  assigneA?: number | null;
  dateEcheance?: string | null;
}

export interface UpdateCourrierParams {
  id: number;
  reference: string;
  type: string;
  dateCourrier: string;
  expediteur?: string | null;
  destinataire?: string | null;
  objet: string;
  description?: string | null;
  statut: string;
  texteOcr?: string | null;
  categorieId?: number | null;
  assigneA?: number | null;
  dateEcheance?: string | null;
}

export interface CourrierRepository {
  getCourriers(): Promise<Result<Courrier[]>>;
  getCourrierById(id: number): Promise<Result<Courrier>>;
  createCourrier(params: CreateCourrierParams): Promise<Result<Courrier>>;
  updateCourrier(params: UpdateCourrierParams): Promise<Result<boolean>>;
  updateCourrierStatus(id: number, statut: string): Promise<Result<boolean>>;
  archiveCourrier(id: number): Promise<Result<boolean>>;
  deleteCourrier(id: number): Promise<Result<boolean>>;
  getCourriersAssignedToUser(userId: number): Promise<Result<Courrier[]>>;
}