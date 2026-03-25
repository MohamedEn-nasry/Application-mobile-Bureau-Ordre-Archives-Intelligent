import React, { createContext, useContext, useState, ReactNode } from 'react';

export type MailStatus = 'Pending' | 'In Progress' | 'Completed' | 'Archived';
export type OutgoingStatus = 'Draft' | 'Sent' | 'Delivered' | 'Archived';

export interface IncomingMail {
  id: string;
  reference: string;
  sender: string;
  subject: string;
  dateReceived: string;
  description: string;
  status: MailStatus;
  attachments: string[];
  ocrText?: string;
  classification?: { category: string; confidence: number; alternatives: string[] };
}

export interface OutgoingMail {
  id: string;
  reference: string;
  recipient: string;
  subject: string;
  dateSent: string;
  description: string;
  status: OutgoingStatus;
  attachments: string[];
}

export interface Notification {
  id: string;
  type: 'update' | 'ocr' | 'assignment' | 'deadline';
  title: string;
  message: string;
  time: string;
  read: boolean;
  mailId?: string;
}

const initialIncoming: IncomingMail[] = [
  {
    id: 'inc-001',
    reference: 'INC-2026-001',
    sender: 'Ministère des Finances',
    subject: 'Demande de rapport budgétaire annuel',
    dateReceived: '2026-03-20',
    description: 'Suite à notre réunion du 15 mars, nous vous prions de bien vouloir nous faire parvenir le rapport budgétaire annuel pour l\'exercice 2025.',
    status: 'In Progress',
    attachments: ['rapport_budget_2025.pdf'],
    ocrText: 'Ministère des Finances\n\nObjet: Demande de rapport budgétaire annuel\n\nMonsieur le Directeur,\n\nSuite à notre réunion du 15 mars 2026, nous vous prions de bien vouloir nous faire parvenir le rapport budgétaire annuel pour l\'exercice 2025 avant le 30 mars 2026.',
    classification: { category: 'Finance & Budget', confidence: 0.92, alternatives: ['Reporting', 'Administrative'] },
  },
  {
    id: 'inc-002',
    reference: 'INC-2026-002',
    sender: 'Direction Régionale de Casablanca',
    subject: 'Convocation - Réunion de coordination',
    dateReceived: '2026-03-21',
    description: 'Vous êtes convoqué à une réunion de coordination régionale qui se tiendra le 28 mars 2026.',
    status: 'Pending',
    attachments: [],
    classification: { category: 'Coordination & Réunions', confidence: 0.87, alternatives: ['Administrative', 'Planification'] },
  },
  {
    id: 'inc-003',
    reference: 'INC-2026-003',
    sender: 'Cabinet du Ministre',
    subject: 'Note circulaire N°12 - Nouvelles procédures',
    dateReceived: '2026-03-22',
    description: 'Veuillez trouver ci-joint la note circulaire N°12 relative aux nouvelles procédures administratives.',
    status: 'Completed',
    attachments: ['note_circulaire_12.pdf', 'annexe_procedures.docx'],
    ocrText: 'NOTE CIRCULAIRE N°12\n\nRelative aux nouvelles procédures administratives\n\nAux: Directeurs régionaux\n\nDans le cadre de la modernisation de notre système administratif...',
    classification: { category: 'Circulaires & Directives', confidence: 0.95, alternatives: ['Réglementation', 'Procédures'] },
  },
  {
    id: 'inc-004',
    reference: 'INC-2026-004',
    sender: 'Service Ressources Humaines',
    subject: 'Demande de congé - Ref. 2026/RH/045',
    dateReceived: '2026-03-23',
    description: 'Demande de congé annuel pour la période du 5 au 15 avril 2026.',
    status: 'Pending',
    attachments: ['demande_conge.pdf'],
  },
  {
    id: 'inc-005',
    reference: 'INC-2026-005',
    sender: 'Prestataire InfoSys Maroc',
    subject: 'Facture N°FAC-2026-087',
    dateReceived: '2026-03-24',
    description: 'Veuillez trouver ci-joint la facture pour les services de maintenance informatique du mois de mars.',
    status: 'Pending',
    attachments: ['facture_087.pdf'],
    ocrText: 'FACTURE N° FAC-2026-087\n\nDate: 24/03/2026\nClient: Administration Centrale\n\nDescription: Services de maintenance informatique - Mars 2026\nMontant HT: 15,000 MAD\nTVA (20%): 3,000 MAD\nMontant TTC: 18,000 MAD',
    classification: { category: 'Facturation & Comptabilité', confidence: 0.89, alternatives: ['Finance', 'Fournisseurs'] },
  },
];

const initialOutgoing: OutgoingMail[] = [
  {
    id: 'out-001',
    reference: 'OUT-2026-001',
    recipient: 'Direction Provinciale de Rabat',
    subject: 'Réponse à la demande de données statistiques',
    dateSent: '2026-03-19',
    description: 'En réponse à votre demande du 10 mars, veuillez trouver ci-joint les données statistiques demandées.',
    status: 'Delivered',
    attachments: ['statistiques_q1_2026.xlsx'],
  },
  {
    id: 'out-002',
    reference: 'OUT-2026-002',
    recipient: 'Ministère de l\'Intérieur',
    subject: 'Rapport mensuel d\'activités - Mars 2026',
    dateSent: '2026-03-22',
    description: 'Veuillez trouver ci-joint le rapport mensuel d\'activités pour le mois de mars 2026.',
    status: 'Sent',
    attachments: ['rapport_mars_2026.pdf'],
  },
  {
    id: 'out-003',
    reference: 'OUT-2026-003',
    recipient: 'Tous les Chefs de Service',
    subject: 'Note interne - Mise à jour des procédures de sécurité',
    dateSent: '2026-03-23',
    description: 'Objet: Mise à jour des procédures de sécurité informatique suite au rapport d\'audit.',
    status: 'Delivered',
    attachments: ['procedures_securite_v2.pdf'],
  },
  {
    id: 'out-004',
    reference: 'OUT-2026-004',
    recipient: 'InfoSys Maroc',
    subject: 'Accusé de réception - Facture FAC-2026-087',
    dateSent: '2026-03-24',
    description: 'Nous accusons réception de votre facture N°FAC-2026-087.',
    status: 'Draft',
    attachments: [],
  },
];

const initialNotifications: Notification[] = [
  {
    id: 'notif-001',
    type: 'assignment',
    title: 'Nouveau courrier assigné',
    message: 'Le courrier INC-2026-005 (Facture InfoSys) vous a été assigné pour traitement.',
    time: '09:15',
    read: false,
    mailId: 'inc-005',
  },
  {
    id: 'notif-002',
    type: 'ocr',
    title: 'OCR terminé',
    message: 'L\'extraction de texte du document INC-2026-003 est complète. Veuillez vérifier les résultats.',
    time: '08:42',
    read: false,
    mailId: 'inc-003',
  },
  {
    id: 'notif-003',
    type: 'update',
    title: 'Statut mis à jour',
    message: 'Le courrier OUT-2026-001 a été marqué comme "Livré" par le système.',
    time: 'Hier, 16:30',
    read: true,
    mailId: 'out-001',
  },
  {
    id: 'notif-004',
    type: 'deadline',
    title: 'Rappel d\'échéance',
    message: 'Le rapport budgétaire (INC-2026-001) doit être traité avant le 30 mars 2026.',
    time: 'Hier, 09:00',
    read: false,
    mailId: 'inc-001',
  },
  {
    id: 'notif-005',
    type: 'update',
    title: 'Classification confirmée',
    message: 'La classification du courrier INC-2026-002 a été confirmée avec succès.',
    time: '21 Mars, 14:20',
    read: true,
    mailId: 'inc-002',
  },
  {
    id: 'notif-006',
    type: 'deadline',
    title: 'Échéance proche',
    message: 'Le courrier INC-2026-004 (Demande de congé) attend votre action depuis 24h.',
    time: '20 Mars, 11:00',
    read: true,
    mailId: 'inc-004',
  },
];

interface AppContextType {
  incomingMail: IncomingMail[];
  outgoingMail: OutgoingMail[];
  notifications: Notification[];
  addIncomingMail: (mail: Omit<IncomingMail, 'id'>) => void;
  addOutgoingMail: (mail: Omit<OutgoingMail, 'id'>) => void;
  updateIncomingStatus: (id: string, status: MailStatus) => void;
  updateOutgoingStatus: (id: string, status: OutgoingStatus) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  unreadCount: number;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [incomingMail, setIncomingMail] = useState<IncomingMail[]>(initialIncoming);
  const [outgoingMail, setOutgoingMail] = useState<OutgoingMail[]>(initialOutgoing);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const addIncomingMail = (mail: Omit<IncomingMail, 'id'>) => {
    const id = `inc-${Date.now()}`;
    setIncomingMail(prev => [{ ...mail, id }, ...prev]);
  };

  const addOutgoingMail = (mail: Omit<OutgoingMail, 'id'>) => {
    const id = `out-${Date.now()}`;
    setOutgoingMail(prev => [{ ...mail, id }, ...prev]);
  };

  const updateIncomingStatus = (id: string, status: MailStatus) => {
    setIncomingMail(prev => prev.map(m => m.id === id ? { ...m, status } : m));
  };

  const updateOutgoingStatus = (id: string, status: OutgoingStatus) => {
    setOutgoingMail(prev => prev.map(m => m.id === id ? { ...m, status } : m));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      incomingMail, outgoingMail, notifications,
      addIncomingMail, addOutgoingMail,
      updateIncomingStatus, updateOutgoingStatus,
      markNotificationRead, markAllRead, unreadCount,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
