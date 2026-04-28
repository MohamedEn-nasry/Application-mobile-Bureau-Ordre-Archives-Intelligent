// TODO: Implement API integration when backend is ready
// import { apiClient } from '../../../../core/network/apiClient';
// import { endpoints } from '../../../../core/network/endpoints';

import { OutgoingCourrier, CourrierStatus, CourrierPriority } from '../../domain/entities/OutgoingCourrier';
import { CourrierFilter } from '../../domain/entities/CourrierFilter';

export interface IOutgoingCourrierRemoteDataSource {
  getOutgoingCourrier(filter?: CourrierFilter): Promise<OutgoingCourrier[]>;
  getCourrierById(id: string): Promise<OutgoingCourrier>;
  createCourrier(courrier: Omit<OutgoingCourrier, 'id' | 'createdAt' | 'updatedAt'>): Promise<OutgoingCourrier>;
  updateCourrier(id: string, courrier: Partial<OutgoingCourrier>): Promise<OutgoingCourrier>;
  deleteCourrier(id: string): Promise<void>;
  archiveCourrier(id: string): Promise<void>;
  reassignCourrier(id: string, newRecipient: string): Promise<OutgoingCourrier>;
  getTotalCount(filter?: CourrierFilter): Promise<number>;
}

// Mock data for development - replace with actual API calls when backend is ready
const mockCourriers: OutgoingCourrier[] = [
  // Outgoing courriers
  {
    id: '1',
    reference: 'OUT-2024-001',
    recipient: 'Direction Générale',
    subject: 'Rapport trimestriel Q1 2024',
    description: 'Rapport financier et opérationnel pour le premier trimestre 2024',
    dateSent: new Date('2024-01-15T10:30:00'),
    status: CourrierStatus.SENT,
    priority: CourrierPriority.HIGH,
    attachments: ['rapport_q1_2024.pdf', 'annexes_financieres.xlsx'],
    createdBy: 'admin',
    createdAt: new Date('2024-01-15T09:00:00'),
    updatedAt: new Date('2024-01-15T10:30:00'),
    type: 'outgoing'
  },
  {
    id: '2',
    reference: 'OUT-2024-002',
    recipient: 'Service Comptabilité',
    subject: 'Demande de validation budgétaire',
    description: 'Validation nécessaire pour le budget du projet informatique',
    dateSent: new Date('2024-01-20T14:15:00'),
    status: CourrierStatus.PENDING,
    priority: CourrierPriority.NORMAL,
    attachments: ['budget_projet.pdf'],
    createdBy: 'admin',
    createdAt: new Date('2024-01-20T13:00:00'),
    updatedAt: new Date('2024-01-20T14:15:00'),
    type: 'outgoing'
  },
  {
    id: '3',
    reference: 'OUT-2024-003',
    recipient: 'Ressources Humaines',
    subject: 'Plan de formation 2024',
    description: 'Proposition de plan de formation pour les employés',
    dateSent: new Date('2024-01-25T11:00:00'),
    status: CourrierStatus.DELIVERED,
    priority: CourrierPriority.NORMAL,
    attachments: ['plan_formation_2024.pdf', 'calendrier_sessions.xlsx'],
    createdBy: 'admin',
    createdAt: new Date('2024-01-24T16:00:00'),
    updatedAt: new Date('2024-01-25T11:00:00'),
    type: 'outgoing'
  },
  {
    id: '4',
    reference: 'OUT-2024-004',
    recipient: 'Client Important',
    subject: 'Proposition commerciale - Nouveau contrat',
    description: 'Proposition détaillée pour le nouveau contrat de services',
    dateSent: new Date('2024-01-28T16:45:00'),
    status: CourrierStatus.DRAFT,
    priority: CourrierPriority.URGENT,
    attachments: ['proposition_commerciale.pdf', 'terms_conditions.pdf'],
    createdBy: 'admin',
    createdAt: new Date('2024-01-28T15:30:00'),
    updatedAt: new Date('2024-01-28T16:45:00'),
    type: 'outgoing'
  },
  // Incoming courriers
  {
    id: '5',
    reference: 'IN-2024-001',
    recipient: 'Service Juridique',
    subject: 'Contrat de partenariat à valider',
    description: 'Nouveau contrat de partenariat nécessitant validation juridique',
    dateSent: new Date('2024-01-18T09:15:00'),
    status: CourrierStatus.PENDING,
    priority: CourrierPriority.HIGH,
    attachments: ['contrat_partenariat.pdf'],
    createdBy: 'admin',
    createdAt: new Date('2024-01-18T08:00:00'),
    updatedAt: new Date('2024-01-18T09:15:00'),
    type: 'incoming'
  },
  {
    id: '6',
    reference: 'IN-2024-002',
    recipient: 'Direction Marketing',
    subject: 'Rapport d\'analyse de marché',
    description: 'Analyse détaillée du marché concurrentiel pour Q1 2024',
    dateSent: new Date('2024-01-22T14:30:00'),
    status: CourrierStatus.DELIVERED,
    priority: CourrierPriority.NORMAL,
    attachments: ['analyse_marche.pdf', 'graphiques.xlsx'],
    createdBy: 'admin',
    createdAt: new Date('2024-01-22T13:00:00'),
    updatedAt: new Date('2024-01-22T14:30:00'),
    type: 'incoming'
  },
  {
    id: '7',
    reference: 'IN-2024-003',
    recipient: 'Direction Technique',
    subject: 'Spécifications techniques projet X',
    description: 'Document complet des spécifications techniques pour le nouveau projet',
    dateSent: new Date('2024-01-26T11:45:00'),
    status: CourrierStatus.SENT,
    priority: CourrierPriority.URGENT,
    attachments: ['specs_techniques.pdf', 'diagrammes.png'],
    createdBy: 'admin',
    createdAt: new Date('2024-01-26T10:00:00'),
    updatedAt: new Date('2024-01-26T11:45:00'),
    type: 'incoming'
  },
  {
    id: '8',
    reference: 'IN-2024-004',
    recipient: 'Service Achats',
    subject: 'Demande de devis fournisseurs',
    description: 'Demande de devis pour matériel informatique nouveau',
    dateSent: new Date('2024-01-30T16:20:00'),
    status: CourrierStatus.PENDING,
    priority: CourrierPriority.LOW,
    attachments: ['demande_devis.pdf'],
    createdBy: 'admin',
    createdAt: new Date('2024-01-30T15:00:00'),
    updatedAt: new Date('2024-01-30T16:20:00'),
    type: 'incoming'
  }
];

export class OutgoingCourrierRemoteDataSource implements IOutgoingCourrierRemoteDataSource {
  async getOutgoingCourrier(filter?: CourrierFilter): Promise<OutgoingCourrier[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredCourriers = [...mockCourriers];
    
    // Apply filters
    if (filter) {
      if (filter.recipient) {
        filteredCourriers = filteredCourriers.filter(c => 
          c.recipient.toLowerCase().includes(filter.recipient!.toLowerCase())
        );
      }
      
      if (filter.subject) {
        filteredCourriers = filteredCourriers.filter(c => 
          c.subject.toLowerCase().includes(filter.subject!.toLowerCase())
        );
      }
      
      if (filter.status) {
        filteredCourriers = filteredCourriers.filter(c => c.status === filter.status);
      }
      
      if (filter.priority) {
        filteredCourriers = filteredCourriers.filter(c => c.priority === filter.priority);
      }
      
      if (filter.dateRange) {
        filteredCourriers = filteredCourriers.filter(c => 
          c.dateSent >= filter.dateRange!.startDate && 
          c.dateSent <= filter.dateRange!.endDate
        );
      }
      
      // Apply sorting
      if (filter.sortBy) {
        filteredCourriers.sort((a, b) => {
          const aValue = a[filter.sortBy!];
          const bValue = b[filter.sortBy!];
          
          if (filter.sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });
      }
      
      // Apply pagination
      if (filter.page && filter.limit) {
        const startIndex = (filter.page - 1) * filter.limit;
        filteredCourriers = filteredCourriers.slice(startIndex, startIndex + filter.limit);
      }
    }
    
    return filteredCourriers;
  }

  async getCourrierById(id: string): Promise<OutgoingCourrier> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const courrier = mockCourriers.find(c => c.id === id);
    if (!courrier) {
      throw new Error('Courrier not found');
    }
    
    return courrier;
  }

  async createCourrier(courrier: Omit<OutgoingCourrier, 'id' | 'createdAt' | 'updatedAt'>): Promise<OutgoingCourrier> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newCourrier: OutgoingCourrier = {
      ...courrier,
      id: (mockCourriers.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockCourriers.push(newCourrier);
    return newCourrier;
  }

  async updateCourrier(id: string, courrier: Partial<OutgoingCourrier>): Promise<OutgoingCourrier> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const existingCourrier = mockCourriers.find(c => c.id === id);
    if (!existingCourrier) {
      throw new Error('Courrier not found');
    }
    
    const updatedCourrier = {
      ...existingCourrier,
      ...courrier,
      updatedAt: new Date()
    };
    
    const index = mockCourriers.findIndex(c => c.id === id);
    mockCourriers[index] = updatedCourrier;
    
    return updatedCourrier;
  }

  async deleteCourrier(id: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = mockCourriers.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Courrier not found');
    }
    
    mockCourriers.splice(index, 1);
  }

  async archiveCourrier(id: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const courrier = mockCourriers.find(c => c.id === id);
    if (!courrier) {
      throw new Error('Courrier not found');
    }
    
    courrier.status = CourrierStatus.ARCHIVED;
  }

  async reassignCourrier(id: string, newRecipient: string): Promise<OutgoingCourrier> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const courrier = mockCourriers.find(c => c.id === id);
    if (!courrier) {
      throw new Error('Courrier not found');
    }
    
    courrier.recipient = newRecipient;
    return courrier;
  }

  async getTotalCount(filter?: CourrierFilter): Promise<number> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    let count = mockCourriers.length;
    
    // Apply same filtering logic as getOutgoingCourrier
    if (filter) {
      if (filter.recipient) {
        count = mockCourriers.filter(c => 
          c.recipient.toLowerCase().includes(filter.recipient!.toLowerCase())
        ).length;
      }
      if (filter.subject) {
        count = mockCourriers.filter(c => 
          c.subject.toLowerCase().includes(filter.subject!.toLowerCase())
        ).length;
      }
      if (filter.status) {
        count = mockCourriers.filter(c => c.status === filter.status).length;
      }
      if (filter.priority) {
        count = mockCourriers.filter(c => c.priority === filter.priority).length;
      }
    }
    
    return count;
  }
}
