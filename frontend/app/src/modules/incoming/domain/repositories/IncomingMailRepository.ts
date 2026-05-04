import { Result } from '../../../../core/utils/result';
import { IncomingMail, IncomingMailStatus, OCRStatus } from '../entities/IncomingMail';

export interface IncomingMailFilter {
  search?: string;
  status?: IncomingMailStatus;
  date?: string;
  sender?: string;
  subject?: string;
}

export interface CreateIncomingMailDTO {
  reference: string;
  dateReceived: Date;
  sender: string;
  subject: string;
  description?: string;
  status: IncomingMailStatus;
  attachments?: number;
}

export interface UpdateIncomingMailDTO {
  status?: IncomingMailStatus;
  ocrStatus?: OCRStatus;
  ocrConfidence?: number;
  ocrText?: string;
  classification?: string;
}

export interface IncomingMailRepository {
  getIncomingMails(filter?: IncomingMailFilter): Promise<Result<IncomingMail[]>>;
  getIncomingMailById(id: string): Promise<Result<IncomingMail>>;
  createIncomingMail(dto: CreateIncomingMailDTO): Promise<Result<IncomingMail>>;
  updateIncomingMail(id: string, dto: UpdateIncomingMailDTO): Promise<Result<IncomingMail>>;
  deleteIncomingMail(id: string): Promise<Result<boolean>>;
  runOCR(id: string): Promise<Result<IncomingMail>>;
  classifyMail(id: string): Promise<Result<IncomingMail>>;
}
