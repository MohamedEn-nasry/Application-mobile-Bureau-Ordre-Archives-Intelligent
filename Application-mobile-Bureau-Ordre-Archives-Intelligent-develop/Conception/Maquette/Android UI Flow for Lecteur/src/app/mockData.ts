import type { MailItem, NotificationItem, ArchiveItem } from './types';

export const currentUser = {
  id: 'u1',
  name: 'Ahmed Benali',
  email: 'ahmed.benali@gov.dz',
  role: 'Lecteur',
  department: 'Direction Générale',
  initials: 'AB',
};

export const mailItems: MailItem[] = [
  {
    id: '1',
    ref: 'BDO-2024-IN-0142',
    sender: "Ministère de l'Intérieur",
    subject: 'Circulaire relative aux nouvelles procédures administratives',
    description:
      "Suite à la réunion du conseil de direction du 10 mars 2024, nous vous prions de bien vouloir prendre connaissance des nouvelles procédures administratives en vigueur à partir du 1er avril 2024. Ces mesures visent à rationaliser le traitement des dossiers et à améliorer l'efficacité des services publics.",
    date: '15 Mar 2024',
    status: 'received',
    type: 'incoming',
    category: 'Circulaire',
    priority: 'normal',
    attachments: [
      { id: 'a1', name: 'Circulaire_N42_2024.pdf', type: 'pdf', size: '1.2 MB', pages: 8 },
      { id: 'a2', name: 'Annexe_Procedures.pdf', type: 'pdf', size: '450 KB', pages: 3 },
    ],
    ocrText:
      "CIRCULAIRE N° 42/2024\n\nObjet : Nouvelles procédures administratives\n\nRéférence : Décret exécutif n° 24-087 du 5 mars 2024\n\nDans le cadre de la modernisation de l'administration publique et conformément aux orientations du Gouvernement, il est demandé à l'ensemble des services concernés de mettre en œuvre les nouvelles procédures administratives décrites ci-après.",
    timeline: [
      { id: 't1', date: '15 Mar 2024', time: '09:15', action: 'Courrier reçu', user: 'Système', role: 'Système' },
      { id: 't2', date: '15 Mar 2024', time: '09:30', action: "Enregistré au bureau d'ordre", user: 'K. Mansouri', role: 'Agent' },
      { id: 't3', date: '15 Mar 2024', time: '10:45', action: 'Distribué au service concerné', user: 'K. Mansouri', role: 'Agent' },
    ],
  },
  {
    id: '2',
    ref: 'BDO-2024-IN-0141',
    sender: "Direction Régionale de l'Habitat",
    subject: "Rapport d'inspection trimestrielle des infrastructures",
    description:
      "Veuillez trouver ci-joint le rapport d'inspection des infrastructures pour le premier trimestre 2024. Ce rapport couvre l'ensemble des bâtiments administratifs de la région et inclut les recommandations du comité technique.",
    date: '14 Mar 2024',
    status: 'processing',
    type: 'incoming',
    category: 'Rapport',
    priority: 'normal',
    attachments: [
      { id: 'a3', name: 'Rapport_Inspection_T1_2024.pdf', type: 'pdf', size: '3.8 MB', pages: 24 },
    ],
    ocrText:
      "RAPPORT D'INSPECTION TRIMESTRIELLE\n\nPériode : Janvier - Mars 2024\n\nDirection Régionale de l'Habitat\n\n1. Résumé exécutif\n\nLe présent rapport fait état de l'inspection de 47 bâtiments administratifs au cours du premier trimestre 2024.",
    timeline: [
      { id: 't1', date: '14 Mar 2024', time: '14:20', action: 'Courrier reçu', user: 'Système', role: 'Système' },
      { id: 't2', date: '14 Mar 2024', time: '14:45', action: "Enregistré au bureau d'ordre", user: 'S. Boudali', role: 'Agent' },
      { id: 't3', date: '15 Mar 2024', time: '08:30', action: 'En cours de traitement', user: 'Admin', role: 'Admin' },
    ],
  },
  {
    id: '3',
    ref: 'BDO-2024-IN-0140',
    sender: 'Tribunal Administratif',
    subject: "Convocation – Audience du 25 mars 2024",
    description:
      "Vous êtes convoqués à comparaître devant le Tribunal Administratif de la wilaya, le lundi 25 mars 2024 à 10h00, dans le cadre de l'affaire n° 2024/TA/087. Votre présence est obligatoire.",
    date: '13 Mar 2024',
    status: 'urgent',
    type: 'incoming',
    category: 'Juridique',
    priority: 'urgent',
    attachments: [
      { id: 'a4', name: 'Convocation_TA_25032024.pdf', type: 'pdf', size: '280 KB', pages: 2 },
    ],
    ocrText:
      "TRIBUNAL ADMINISTRATIF\n\nCONVOCATION N° 087/2024\n\nLe Président du Tribunal Administratif\n\nConvoque: Direction de l'Administration Générale\n\nObjet : Affaire n° 2024/TA/087",
    timeline: [
      { id: 't1', date: '13 Mar 2024', time: '11:00', action: 'Courrier reçu', user: 'Système', role: 'Système' },
      { id: 't2', date: '13 Mar 2024', time: '11:15', action: 'Marqué urgent', user: 'Admin', role: 'Admin' },
      { id: 't3', date: '13 Mar 2024', time: '11:30', action: 'Transmis au service juridique', user: 'Admin', role: 'Admin' },
    ],
  },
  {
    id: '4',
    ref: 'BDO-2024-OUT-0089',
    recipient: 'Direction des Finances',
    subject: 'Transmission du budget prévisionnel 2024-2025',
    description:
      "Nous avons l'honneur de vous transmettre ci-joint le projet de budget prévisionnel pour l'exercice 2024-2025, tel qu'approuvé par le conseil de direction lors de sa séance du 11 mars 2024.",
    date: '12 Mar 2024',
    status: 'sent',
    type: 'outgoing',
    category: 'Budget',
    priority: 'normal',
    attachments: [
      { id: 'a5', name: 'Budget_Previsionnel_2024-2025.xlsx', type: 'doc', size: '890 KB' },
      { id: 'a6', name: 'Note_Explicative.pdf', type: 'pdf', size: '340 KB', pages: 5 },
    ],
    ocrText: undefined,
    timeline: [
      { id: 't1', date: '12 Mar 2024', time: '16:00', action: 'Courrier créé', user: 'S. Boudali', role: 'Agent' },
      { id: 't2', date: '12 Mar 2024', time: '16:30', action: 'Approuvé et envoyé', user: 'Admin', role: 'Admin' },
    ],
  },
  {
    id: '5',
    ref: 'BDO-2024-OUT-0088',
    recipient: "Wilaya d'Alger",
    subject: 'Réponse à la demande de statistiques annuelles',
    description:
      "En réponse à votre courrier référencé W-ALG-2024-0234 du 5 mars 2024, nous vous prions de bien vouloir trouver ci-joint les statistiques annuelles demandées.",
    date: '11 Mar 2024',
    status: 'sent',
    type: 'outgoing',
    category: 'Statistiques',
    priority: 'normal',
    attachments: [
      { id: 'a7', name: 'Statistiques_Annuelles_2023.pdf', type: 'pdf', size: '2.1 MB', pages: 32 },
    ],
    ocrText: undefined,
    timeline: [
      { id: 't1', date: '11 Mar 2024', time: '10:00', action: 'Courrier créé', user: 'K. Mansouri', role: 'Agent' },
      { id: 't2', date: '11 Mar 2024', time: '11:20', action: 'Signé et envoyé', user: 'Admin', role: 'Admin' },
    ],
  },
  {
    id: '6',
    ref: 'BDO-2024-IN-0138',
    sender: 'Ministère des Finances',
    subject: 'Note de service : Nouvelles directives budgétaires',
    description:
      "Par la présente note de service, le Ministère des Finances porte à la connaissance de l'ensemble des services concernés les nouvelles directives relatives à l'exécution budgétaire pour l'exercice 2024.",
    date: '08 Mar 2024',
    status: 'received',
    type: 'incoming',
    category: 'Note de Service',
    priority: 'high',
    attachments: [
      { id: 'a8', name: 'Directives_Budgetaires_2024.pdf', type: 'pdf', size: '1.5 MB', pages: 12 },
    ],
    ocrText:
      "NOTE DE SERVICE N° 15/2024\n\nMinistère des Finances\n\nObjet: Nouvelles directives budgétaires pour l'exercice 2024\n\nDans le cadre du renforcement des mécanismes de contrôle budgétaire...",
    timeline: [
      { id: 't1', date: '08 Mar 2024', time: '09:00', action: 'Courrier reçu', user: 'Système', role: 'Système' },
      { id: 't2', date: '08 Mar 2024', time: '09:30', action: 'Enregistré', user: 'S. Boudali', role: 'Agent' },
    ],
  },
];

export const notifications: NotificationItem[] = [
  {
    id: 'n1',
    type: 'update',
    title: 'Nouveau courrier disponible',
    message: 'Un courrier urgent du Tribunal Administratif a été enregistré (BDO-2024-IN-0140)',
    date: '15 Mar · 11:15',
    read: false,
    relatedId: '3',
  },
  {
    id: 'n2',
    type: 'update',
    title: 'Statut mis à jour',
    message: 'Le courrier BDO-2024-IN-0141 est maintenant en cours de traitement',
    date: '15 Mar · 08:30',
    read: false,
    relatedId: '2',
  },
  {
    id: 'n3',
    type: 'archive',
    title: 'Archive mise à jour',
    message: 'Nouveaux documents archivés dans la catégorie Finances (3 documents)',
    date: '14 Mar · 16:00',
    read: true,
  },
  {
    id: 'n4',
    type: 'reminder',
    title: 'Rappel : Convocation tribunal',
    message: 'La convocation BDO-2024-IN-0140 est prévue dans 10 jours (25 mars)',
    date: '14 Mar · 09:00',
    read: false,
    relatedId: '3',
  },
  {
    id: 'n5',
    type: 'update',
    title: 'Document numérisé disponible',
    message: 'La Circulaire N° 42/2024 a été scannée et indexée avec OCR',
    date: '15 Mar · 09:30',
    read: true,
    relatedId: '1',
  },
  {
    id: 'n6',
    type: 'reminder',
    title: 'Rapport mensuel en attente',
    message: "Le rapport d'activité mensuel doit être consulté avant le 20 mars",
    date: '13 Mar · 08:00',
    read: true,
  },
];

export const archiveItems: ArchiveItem[] = [
  {
    id: 'ar1',
    ref: 'BDO-2023-IN-0892',
    subject: 'Accord de coopération interministérielle',
    dateArchived: '30 Déc 2023',
    originalDate: '15 Nov 2023',
    category: 'Convention',
    type: 'incoming',
    archivedBy: 'Admin',
  },
  {
    id: 'ar2',
    ref: 'BDO-2023-OUT-0456',
    subject: "Rapport annuel d'activité 2023",
    dateArchived: '28 Déc 2023',
    originalDate: '20 Déc 2023',
    category: 'Rapport',
    type: 'outgoing',
    archivedBy: 'K. Mansouri',
  },
  {
    id: 'ar3',
    ref: 'BDO-2023-IN-0871',
    subject: 'Note budgétaire rectificative T4 2023',
    dateArchived: '20 Déc 2023',
    originalDate: '01 Déc 2023',
    category: 'Budget',
    type: 'incoming',
    archivedBy: 'Admin',
  },
  {
    id: 'ar4',
    ref: 'BDO-2023-IN-0845',
    subject: 'Circulaire relative aux congés annuels',
    dateArchived: '15 Nov 2023',
    originalDate: '05 Nov 2023',
    category: 'Circulaire',
    type: 'incoming',
    archivedBy: 'S. Boudali',
  },
  {
    id: 'ar5',
    ref: 'BDO-2023-OUT-0412',
    subject: 'Compte-rendu réunion de coordination',
    dateArchived: '30 Oct 2023',
    originalDate: '28 Oct 2023',
    category: 'Compte-rendu',
    type: 'outgoing',
    archivedBy: 'K. Mansouri',
  },
  {
    id: 'ar6',
    ref: 'BDO-2023-IN-0789',
    subject: 'Instructions relatives à la sécurité informatique',
    dateArchived: '20 Oct 2023',
    originalDate: '10 Oct 2023',
    category: 'Sécurité',
    type: 'incoming',
    archivedBy: 'Admin',
  },
];
