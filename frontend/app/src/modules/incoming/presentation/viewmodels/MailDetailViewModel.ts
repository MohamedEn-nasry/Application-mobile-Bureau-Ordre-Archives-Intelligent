import { useState, useEffect, useCallback } from 'react';
import { IncomingMail } from '../../domain/entities/IncomingMail';

export const useMailDetailViewModel = (mailId: string) => {
  const [mail, setMail] = useState<IncomingMail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMailDetail = useCallback(async () => {
    try {
      setIsLoading(true);
      // Mock implementation - replace with actual use case when available
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock mail data
      const mockMail: IncomingMail = {
        id: mailId,
        Reference: `INC-2026-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        DateReceived: new Date(),
        Sender: 'Mock Sender',
        Subject: 'Mock Subject',
        Description: 'Mock description',
        Attachments: 2,
        Status: 'pending',
        OCRStatus: 'pending',
        OCRConfidence: 0,
        OCRText: '',
        Classification: '',
        CreatedAt: new Date(),
        UpdatedAt: new Date()
      };
      
      setMail(mockMail);
      setError(null);
    } catch {
      setError('Failed to load mail details');
      setMail(null);
    } finally {
      setIsLoading(false);
    }
  }, [mailId]);

  const runOCR = useCallback(async () => {
    if (!mail) return;
    
    try {
      // Mock implementation - replace with actual use case when available
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setMail(prev => prev ? {
        ...prev,
        OCRStatus: 'completed',
        OCRConfidence: 95,
        OCRText: 'Mock OCR extracted text from document'
      } : null);
      setError(null);
    } catch {
      setError('Failed to run OCR');
    }
  }, [mail]);

  const classifyMail = useCallback(async () => {
    if (!mail) return;
    
    try {
      // Mock implementation - replace with actual use case when available
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setMail(prev => prev ? {
        ...prev,
        Classification: 'Invoice'
      } : null);
      setError(null);
    } catch {
      setError('Failed to classify mail');
    }
  }, [mail]);

  const updateStatus = useCallback(async (newStatus: 'pending' | 'in_progress' | 'completed') => {
    if (!mail) return;
    
    try {
      // Mock implementation - replace with actual use case when available
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setMail(prev => prev ? {
        ...prev,
        Status: newStatus
      } : null);
      setError(null);
    } catch {
      setError('Failed to update status');
    }
  }, [mail]);

  const refresh = useCallback(() => {
    loadMailDetail();
  }, [loadMailDetail]);

  useEffect(() => {
    loadMailDetail();
  }, [loadMailDetail]);

  return {
    mail,
    isLoading,
    error,
    runOCR,
    classifyMail,
    updateStatus,
    refresh
  };
};
