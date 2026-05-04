import { IDashboardRepository, AssignedMailItem, OCRResult } from './IDashboardRepository';
import { SummaryStats, ActivityItem, QuickAction } from '../../domain/entities/DashboardStats';
import { ServerFailure } from '../../../../core/error/failures';
import { IDashboardRemoteDataSource } from '../datasources/DashboardRemoteDataSource';

export class DashboardRepositoryImpl implements IDashboardRepository {
  constructor(private readonly remoteDataSource: IDashboardRemoteDataSource) {}

  async getSummaryStats(): Promise<SummaryStats> {
    try {
      const stats = await this.remoteDataSource.getSummaryStats();
      return stats;
    } catch (e: any) {
      console.error('Error fetching summary stats:', e);
      throw new ServerFailure(e.message || 'Erreur lors du chargement des statistiques');
    }
  }

  async getRecentActivity(): Promise<ActivityItem[]> {
    try {
      const activities = await this.remoteDataSource.getRecentActivity();
      return activities;
    } catch (e: any) {
      console.error('Error fetching recent activity:', e);
      throw new ServerFailure(e.message || 'Erreur lors du chargement de l\'activité récente');
    }
  }

  async getQuickActions(): Promise<QuickAction[]> {
    try {
      const quickActions = await this.remoteDataSource.getQuickActions();
      return quickActions;
    } catch (e: any) {
      console.error('Error fetching quick actions:', e);
      throw new ServerFailure(e.message || 'Erreur lors du chargement des actions rapides');
    }
  }

  async getAssignedMail(): Promise<AssignedMailItem[]> {
    try {
      const assignedMail = await this.remoteDataSource.getAssignedMail();
      return assignedMail;
    } catch (e: any) {
      console.error('Error fetching assigned mail:', e);
      throw new ServerFailure(e.message || 'Erreur lors du chargement du courrier assigné');
    }
  }

  async getOCRResults(): Promise<OCRResult[]> {
    try {
      const ocrResults = await this.remoteDataSource.getOCRResults();
      return ocrResults;
    } catch (e: any) {
      console.error('Error fetching OCR results:', e);
      throw new ServerFailure(e.message || 'Erreur lors du chargement des résultats OCR');
    }
  }
}
