import { apiClient } from '../../../../core/network/apiClient';
import { endpoints } from '../../../../core/network/endpoints';
import { SummaryStats, ActivityItem, ActivityIconType, QuickAction } from '../../domain/entities/DashboardStats';
import { AssignedMailItem, OCRResult } from '../repositories/IDashboardRepository';

export interface IDashboardRemoteDataSource {
    getSummaryStats(): Promise<SummaryStats>;
    getRecentActivity(): Promise<ActivityItem[]>;
    getQuickActions(): Promise<QuickAction[]>;
    getAssignedMail(): Promise<AssignedMailItem[]>;
    getOCRResults(): Promise<OCRResult[]>;
}

interface ActivityResponseDto {
    id: string;
    user: string;
    action: string;
    time: string;
    icon: string;
}

interface QuickActionResponseDto {
    id: string;
    label: string;
    icon: string;
    routeName: string;
    colorScheme: 'blue' | 'indigo' | 'amber' | 'violet';
}

interface AssignedMailResponseDto {
    id: string;
    reference: string;
    title: string;
    sender: string;
    status: 'pending' | 'in-progress' | 'completed';
    date: string;
    importance: number;
}

interface OCRResultResponseDto {
    id: string;
    reference: string;
    title: string;
    completionDate: string;
    content: string;
    confidence: number;
    importance: number;
}

export class DashboardRemoteDataSource implements IDashboardRemoteDataSource {
    async getSummaryStats(): Promise<SummaryStats> {
        const response = await apiClient.get<SummaryStats>(endpoints.dashboard.stats);
        return response;
    }

    async getRecentActivity(): Promise<ActivityItem[]> {
        const response = await apiClient.get<ActivityResponseDto[]>(endpoints.dashboard.activity);

        return response.map(item => new ActivityItem(
            item.id,
            item.user,
            item.action,
            item.time,
            item.icon ? (item.icon as ActivityIconType) : 'eye'
        ));
    }

    async getQuickActions(): Promise<QuickAction[]> {
        const response = await apiClient.get<QuickActionResponseDto[]>(endpoints.dashboard.quickActions);
        return response.map(item => ({
            id: item.id,
            label: item.label,
            icon: item.icon,
            routeName: item.routeName,
            colorScheme: item.colorScheme
        }));
    }

    async getAssignedMail(): Promise<AssignedMailItem[]> {
        const response = await apiClient.get<AssignedMailResponseDto[]>(endpoints.dashboard.assignedMail);
        return response.map(item => ({
            id: item.id,
            reference: item.reference,
            title: item.title,
            sender: item.sender,
            status: item.status,
            date: item.date,
            importance: item.importance
        }));
    }

    async getOCRResults(): Promise<OCRResult[]> {
        const response = await apiClient.get<OCRResultResponseDto[]>(endpoints.dashboard.ocrResults);
        return response.map(item => ({
            id: item.id,
            reference: item.reference,
            title: item.title,
            completionDate: item.completionDate,
            content: item.content,
            confidence: item.confidence,
            importance: item.importance
        }));
    }
}