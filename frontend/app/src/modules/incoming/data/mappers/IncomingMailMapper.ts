import { IncomingMail } from '../../domain/entities/IncomingMail';
import { CreateIncomingMailDTO } from '../../domain/repositories/IncomingMailRepository';
import { IncomingMailResponse, CreateIncomingMailRequest, UpdateIncomingMailRequest } from '../datasources/IncomingMailRemoteDataSource';

export class IncomingMailMapper {
  static toDomain(response: IncomingMailResponse): IncomingMail {
    return new IncomingMail(
      response.id.toString(),
      response.reference,
      response.type,
      new Date(response.dateCourrier),
      response.expediteur,
      response.destinataire,
      response.objet,
      response.description,
      response.statut,
      response.texteOcr,
      response.categorieId,
      response.auteurId,
      response.assigneA,
      new Date(response.createdAt),
      new Date(response.updatedAt),
      response.dateEcheance ? new Date(response.dateEcheance) : null
    );
  }

  static toDomainList(responses: IncomingMailResponse[]): IncomingMail[] {
    return responses.map(response => this.toDomain(response));
  }

  static toCreateRequest(dto: CreateIncomingMailDTO): CreateIncomingMailRequest {
    return {
      reference: dto.reference,
      type: 'incoming', // Default type for incoming mails
      dateCourrier: dto.dateReceived instanceof Date ? dto.dateReceived.toISOString().split('T')[0] : dto.dateReceived,
      expediteur: dto.sender,
      destinataire: null,
      objet: dto.subject,
      description: dto.description || null,
      statut: dto.status,
      texteOcr: null,
      categorieId: 1, // Default category
      auteurId: 1, // This should come from current user
      assigneA: null,
      dateEcheance: null
    };
  }

  static toUpdateRequest(dto: any): UpdateIncomingMailRequest {
    const request: UpdateIncomingMailRequest = {};
    
    if (dto.reference !== undefined) request.reference = dto.reference;
    if (dto.type !== undefined) request.type = dto.type;
    if (dto.dateCourrier !== undefined) request.dateCourrier = dto.dateCourrier;
    if (dto.expediteur !== undefined) request.expediteur = dto.expediteur;
    if (dto.destinataire !== undefined) request.destinataire = dto.destinataire;
    if (dto.objet !== undefined) request.objet = dto.objet;
    if (dto.description !== undefined) request.description = dto.description;
    if (dto.statut !== undefined) request.statut = dto.statut;
    if (dto.texteOcr !== undefined) request.texteOcr = dto.texteOcr;
    if (dto.categorieId !== undefined) request.categorieId = dto.categorieId;
    if (dto.assigneA !== undefined) request.assigneA = dto.assigneA;
    if (dto.dateEcheance !== undefined) request.dateEcheance = dto.dateEcheance;
    
    return request;
  }
}
