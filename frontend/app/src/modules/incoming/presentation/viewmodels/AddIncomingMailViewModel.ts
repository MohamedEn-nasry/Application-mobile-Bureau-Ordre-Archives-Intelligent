import { useState } from 'react';
import { CreateIncomingMailDTO } from '../../domain/repositories/IncomingMailRepository';

export const useAddIncomingMailViewModel = () => {
  const [formData, setFormData] = useState<CreateIncomingMailDTO>({
    reference: '',
    dateReceived: new Date(),
    sender: '',
    subject: '',
    description: undefined,
    status: 'pending',
    attachments: 0
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<string[]>([]);

  const updateFormData = (field: keyof CreateIncomingMailDTO, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

  const addAttachment = (filename: string) => {
    setAttachments(prev => [...prev, filename]);
    updateFormData('attachments', attachments.length + 1);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
    updateFormData('attachments', Math.max(0, attachments.length - 1));
  };

  const validateForm = (): boolean => {
    if (!formData.reference.trim()) {
      setError('Reference is required');
      return false;
    }
    if (!formData.sender.trim()) {
      setError('Sender is required');
      return false;
    }
    if (!formData.subject.trim()) {
      setError('Subject is required');
      return false;
    }
    return true;
  };

  const generateReference = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const reference = `INC-${year}-${random}`;
    updateFormData('reference', reference);
  };

  const saveMail = async (): Promise<boolean> => {
    if (!validateForm()) {
      return false;
    }

    try {
      setIsLoading(true);
      
      // Mock implementation - replace with actual use case when available
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsLoading(false);
      return true;
    } catch {
      setError('Failed to save incoming mail');
      setIsLoading(false);
      return false;
    }
  };

  const resetForm = () => {
    setFormData({
      reference: '',
      dateReceived: new Date(),
      sender: '',
      subject: '',
      description: undefined,
      status: 'pending',
      attachments: 0
    });
    setAttachments([]);
    setError(null);
  };

  return {
    formData,
    isLoading,
    error,
    attachments,
    updateFormData,
    addAttachment,
    removeAttachment,
    generateReference,
    saveMail,
    resetForm
  };
};
