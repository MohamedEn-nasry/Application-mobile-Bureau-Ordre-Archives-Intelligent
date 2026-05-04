import { useState, useEffect } from 'react';
import { IncomingMail } from '../../domain/entities/IncomingMail';
import { UpdateIncomingMailDTO } from '../../domain/repositories/IncomingMailRepository';

export const useEditIncomingMailViewModel = (mailId: string) => {
  const [mail, setMail] = useState<IncomingMail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UpdateIncomingMailDTO>({});

  // Mock implementation - replace with actual use case when available
  useEffect(() => {
    const loadMail = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock mail data - in real implementation, use GetIncomingMailByIdUseCase
        const mockMail: IncomingMail = {
          id: mailId,
          Reference: 'INC-2026-001',
          DateReceived: new Date('2026-05-01'),
          Sender: 'Ministry of Finance',
          Subject: 'Annual Budget Report 2026',
          Description: 'Official budget report for fiscal year 2026 including detailed allocations and projections for various government departments.',
          Status: 'in_progress',
          Attachments: 3,
          OCRStatus: 'completed',
          OCRConfidence: 95,
          OCRText: 'ANNUAL BUDGET REPORT 2026',
          Classification: 'Official Document',
          CreatedAt: new Date(),
          UpdatedAt: new Date()
        };
        
        setMail(mockMail);
        setFormData({
          status: mockMail.Status,
          ocrStatus: mockMail.OCRStatus,
          ocrConfidence: mockMail.OCRConfidence,
          ocrText: mockMail.OCRText,
          classification: mockMail.Classification
        });
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load mail');
      } finally {
        setIsLoading(false);
      }
    };

    loadMail();
  }, [mailId]);

  const updateFormData = (field: keyof UpdateIncomingMailDTO, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.status) {
      setError('Status is required');
      return false;
    }
    return true;
  };

  const saveMail = async (): Promise<boolean> => {
    if (!validateForm()) {
      return false;
    }

    setIsSaving(true);
    try {
      // Mock implementation - replace with actual use case
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real implementation, use UpdateIncomingMailUseCase
      setError(null);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to update mail');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    if (mail) {
      setFormData({
        status: mail.Status,
        ocrStatus: mail.OCRStatus,
        ocrConfidence: mail.OCRConfidence,
        ocrText: mail.OCRText,
        classification: mail.Classification
      });
    }
    setError(null);
  };

  return {
    mail,
    formData,
    isLoading,
    isSaving,
    error,
    updateFormData,
    saveMail,
    resetForm
  };
};
