export type MailStatus = 'received' | 'processing' | 'pending' | 'sent' | 'archived' | 'urgent';
export type MailType = 'incoming' | 'outgoing';

export interface Attachment {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'doc';
  size: string;
  pages?: number;
}

export interface TimelineEvent {
  id: string;
  date: string;
  time: string;
  action: string;
  user: string;
  role: string;
}

export interface MailItem {
  id: string;
  ref: string;
  sender?: string;
  recipient?: string;
  subject: string;
  description: string;
  date: string;
  status: MailStatus;
  type: MailType;
  category: string;
  priority: 'normal' | 'high' | 'urgent';
  attachments: Attachment[];
  ocrText?: string;
  timeline: TimelineEvent[];
}

export interface NotificationItem {
  id: string;
  type: 'update' | 'reminder' | 'archive';
  title: string;
  message: string;
  date: string;
  read: boolean;
  relatedId?: string;
}

export interface ArchiveItem {
  id: string;
  ref: string;
  subject: string;
  dateArchived: string;
  originalDate: string;
  category: string;
  type: MailType;
  archivedBy: string;
}
