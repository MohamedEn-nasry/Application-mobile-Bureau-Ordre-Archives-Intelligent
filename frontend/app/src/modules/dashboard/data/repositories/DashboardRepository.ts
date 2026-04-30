import { IDashboardRepository, AssignedMailItem, OCRResult } from './IDashboardRepository';
import { DashboardRemoteDataSource } from '../datasources/DashboardRemoteDataSource';
import { SummaryStats, ActivityItem, QuickAction } from '../../domain/entities/DashboardStats';

// IPA: /rI.pAz.I.tOr.i/ - Repository (pronounced "rep-uh-zi-tor-ee")
// IPA: /Im.ple.mEn.teI.SEn/ - Implementation (pronounced "im-ple-men-tay-shen")

export class DashboardRepository implements IDashboardRepository {
  constructor(private readonly remoteDataSource: DashboardRemoteDataSource) {}

  async getSummaryStats(): Promise<SummaryStats> {
    try {
      return await this.remoteDataSource.getSummaryStats();
    } catch (error) {
      console.error('Error fetching summary stats:', error);
      throw error;
    }
  }

  async getRecentActivity(): Promise<ActivityItem[]> {
    try {
      return await this.remoteDataSource.getRecentActivity();
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      throw error;
    }
  }

  async getQuickActions(): Promise<QuickAction[]> {
    try {
      // For now, return static quick actions - this could be fetched from API later
      return [
        {
          id: '1',
          label: 'Add Incoming',
          icon: 'inbox',
          routeName: 'IncomingMail',
          colorScheme: 'blue'
        },
        {
          id: '2',
          label: 'Add Outgoing',
          icon: 'send',
          routeName: 'OutgoingMail',
          colorScheme: 'indigo'
        },
        {
          id: '3',
          label: 'Scan Document',
          icon: 'camera',
          routeName: 'ScanDocument',
          colorScheme: 'amber'
        },
        {
          id: '4',
          label: 'Run OCR',
          icon: 'file-text',
          routeName: 'RunOCR',
          colorScheme: 'violet'
        }
      ];
    } catch (error) {
      console.error('Error fetching quick actions:', error);
      throw error;
    }
  }

  async getAssignedMail(): Promise<AssignedMailItem[]> {
    try {
      // Mock data for now - this should be fetched from API
      return [
        {
          id: '1',
          reference: 'INC-2026-001',
          title: 'Demande de rapport budgétaire annuel',
          sender: 'Ministère des Finances',
          status: 'in-progress',
          date: '2026-03-20',
          importance: 9
        },
        {
          id: '2',
          reference: 'OUT-2026-003',
          title: 'Réponse concernant les subventions',
          sender: 'Direction Générale',
          status: 'pending',
          date: '2026-03-19',
          importance: 7
        },
        {
          id: '3',
          reference: 'INC-2026-002',
          title: 'Documentation projet infrastructure',
          sender: 'Service Technique',
          status: 'completed',
          date: '2026-03-18',
          importance: 5
        }
      ];
    } catch (error) {
      console.error('Error fetching assigned mail:', error);
      throw error;
    }
  }

  async getOCRResults(): Promise<OCRResult[]> {
    try {
      // Mock data for now - this should be fetched from API
      return [
        {
          id: '1',
          reference: 'INC-2026-003',
          title: 'Contract de service - Direction IT',
          completionDate: '2026-03-20',
          content: 'Ce document concerne les termes et conditions du contrat de service entre la Direction IT et le fournisseur externe pour la période 2026-2027...',
          confidence: 95,
          importance: 8
        },
        {
          id: '2',
          reference: 'INC-2026-001',
          title: 'Demande de rapport budgétaire annuel',
          completionDate: '2026-03-19',
          content: 'Le Ministère des Finances demande la soumission du rapport budgétaire annuel pour l\'exercice fiscal 2025-2026 incluant toutes les dépenses...',
          confidence: 87,
          importance: 9
        }
      ];
    } catch (error) {
      console.error('Error fetching OCR results:', error);
      throw error;
    }
  }
}
