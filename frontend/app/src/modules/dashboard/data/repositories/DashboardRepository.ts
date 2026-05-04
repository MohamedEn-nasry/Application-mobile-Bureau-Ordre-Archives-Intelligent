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
      return await this.remoteDataSource.getQuickActions();
    } catch (error) {
      console.error('Error fetching quick actions:', error);
      throw error;
    }
  }

  async getAssignedMail(): Promise<AssignedMailItem[]> {
    try {
      return await this.remoteDataSource.getAssignedMail();
    } catch (error) {
      console.error('Error fetching assigned mail:', error);
      throw error;
    }
  }

  async getOCRResults(): Promise<OCRResult[]> {
    try {
      return await this.remoteDataSource.getOCRResults();
    } catch (error) {
      console.error('Error fetching OCR results:', error);
      throw error;
    }
  }
}
