// src/data/mockData.js

export const USERS = [
  { id: '1', fullName: 'Ahmed Mehdi',    username: 'admin_mehdi', email: 'a.mehdi@bureau.dz',    role: 'Admin',   status: 'Active',   initials: 'AM', lastLogin: "Aujourd'hui, 08:30",  phone: '+213 555 010101' },
  { id: '2', fullName: 'Sara Benali',    username: 's.benali',    email: 's.benali@bureau.dz',    role: 'Agent',   status: 'Active',   initials: 'SB', lastLogin: "Aujourd'hui, 08:45",  phone: '+213 555 020202' },
  { id: '3', fullName: 'Karim Mansouri', username: 'k.mansouri',  email: 'k.mansouri@bureau.dz',  role: 'Agent',   status: 'Active',   initials: 'KM', lastLogin: 'Hier, 17:10',         phone: '+213 555 030303' },
  { id: '4', fullName: 'Leila Hamdi',    username: 'l.hamdi',     email: 'l.hamdi@bureau.dz',     role: 'Lecteur', status: 'Disabled', initials: 'LH', lastLogin: '10 Avr 2026',         phone: '+213 555 040404' },
  { id: '5', fullName: 'Nadia Oussama',  username: 'n.oussama',   email: 'n.oussama@bureau.dz',   role: 'Lecteur', status: 'Active',   initials: 'NO', lastLogin: "Aujourd'hui, 07:55",  phone: '+213 555 050505' },
  { id: '6', fullName: 'Yacine Rahmani', username: 'y.rahmani',   email: 'y.rahmani@bureau.dz',   role: 'Agent',   status: 'Active',   initials: 'YR', lastLogin: 'Hier, 09:00',         phone: '+213 555 060606' },
];

export const INCOMING_MAIL = [
  {
    id: 'in1', reference: 'IN-2026-0892',
    sender: 'Ministère des Finances', subject: "Demande d'allocation budgétaire – T2 2026",
    description: "Demande d'allocation budgétaire T2 2026 conformément à la directive n°22/2026. Nécessite examen et approbation avant transmission aux départements concernés.",
    dateReceived: '14 Avr 2026', status: 'Pending', category: 'Finance / Budget', confidence: 84,
    attachments: [{ name: 'Requête_Budget.pdf', type: 'pdf', size: '1.2 Mo' }, { name: 'Tableau_Budget.xlsx', type: 'xlsx', size: '340 Ko' }],
    ocrText: "Direction des Finances – République Algérienne\nRéf: MF/DG/2026-0892\nObjet: Demande d'allocation budgétaire T2 2026\nConformément à la directive n°22/2026, nous sollicitons l'allocation des crédits budgétaires pour le second trimestre.\nMontant demandé : 4 500 000,00 DZD\nÉchéance de réponse : 20 Avril 2026",
    alternativeCategories: [{ label: 'Administratif / Général', confidence: 51 }, { label: 'Juridique / Conformité', confidence: 22 }],
    timeline: [
      { label: 'Reçu et enregistré', date: '14 Avr 2026, 09:00', color: 'blue' },
      { label: 'OCR traité', date: '14 Avr 2026, 09:03', color: 'teal' },
      { label: 'En attente de revue', date: 'Statut actuel', color: 'amber' },
    ],
    assignedTo: 'Sara Benali',
  },
  {
    id: 'in2', reference: 'IN-2026-0891',
    sender: "Direction des Travaux Publics", subject: 'Avis de maintenance infrastructure',
    description: "Maintenance préventive planifiée sur l'infrastructure du bâtiment. Accès au site requis du 20 au 22 Avr 2026.",
    dateReceived: '13 Avr 2026', status: 'Processed', category: 'Technique / Infrastructure', confidence: 91,
    attachments: [{ name: 'Plan_Maintenance.pdf', type: 'pdf', size: '870 Ko' }],
    ocrText: "Direction des Travaux Publics\nRéf: DTP/2026-0891\nObjet: Maintenance préventive infrastructure\nNous informons que des travaux de maintenance seront effectués du 20 au 22 avril 2026...",
    alternativeCategories: [{ label: 'Administratif / Général', confidence: 32 }],
    timeline: [
      { label: 'Reçu et enregistré', date: '13 Avr 2026, 10:15', color: 'blue' },
      { label: 'OCR traité', date: '13 Avr 2026, 10:18', color: 'teal' },
      { label: 'Traité', date: '13 Avr 2026, 14:00', color: 'green' },
    ],
    assignedTo: 'Karim Mansouri',
  },
  {
    id: 'in3', reference: 'IN-2026-0890',
    sender: 'Direction des Ressources Humaines', subject: "Programme de formation du personnel – Mai 2026",
    description: "Programme de formation obligatoire pour l'ensemble du personnel administratif. Date limite d'inscription : 20 Avril 2026.",
    dateReceived: '12 Avr 2026', status: 'Urgent', category: 'RH / Personnel', confidence: 78,
    attachments: [
      { name: 'Calendrier_Formation.pdf', type: 'pdf', size: '620 Ko' },
      { name: 'Formulaire_Inscription.docx', type: 'docx', size: '210 Ko' },
      { name: 'Détails_Programme.pdf', type: 'pdf', size: '1.5 Mo' },
    ],
    ocrText: "Direction des Ressources Humaines\nRéf: DRH/2026-0890\nObjet: Programme de formation – Mai 2026\nNous portons à votre connaissance le programme de formation obligatoire pour l'ensemble du personnel administratif...",
    alternativeCategories: [{ label: 'Administratif / Général', confidence: 45 }],
    timeline: [
      { label: 'Reçu et enregistré', date: '12 Avr 2026, 08:30', color: 'blue' },
      { label: 'Marqué URGENT', date: '12 Avr 2026, 09:00', color: 'red' },
      { label: 'En attente d\'action', date: 'Statut actuel', color: 'amber' },
    ],
    assignedTo: 'Sara Benali',
  },
  {
    id: 'in4', reference: 'IN-2026-0889',
    sender: 'Cour des Comptes', subject: "Demande de soumission du rapport annuel 2025",
    description: "Demande de rapport annuel pour l'exercice fiscal 2025. Date limite : 30 Avril 2026.",
    dateReceived: '11 Avr 2026', status: 'Archived', category: 'Finance / Audit', confidence: 88,
    attachments: [
      { name: 'Demande_Audit.pdf', type: 'pdf', size: '540 Ko' },
      { name: 'Directives_2025.pdf', type: 'pdf', size: '1.1 Mo' },
      { name: 'Modèle.xlsx', type: 'xlsx', size: '280 Ko' },
      { name: 'Rapport_Précédent.pdf', type: 'pdf', size: '3.2 Mo' },
      { name: 'Checklist.docx', type: 'docx', size: '90 Ko' },
    ],
    ocrText: "Cour des Comptes – République Algérienne\nRéf: CC/2026-0889\nObjet: Soumission rapport annuel exercice 2025\nConformément aux dispositions légales...",
    alternativeCategories: [],
    timeline: [
      { label: 'Reçu et enregistré', date: '11 Avr 2026, 11:00', color: 'blue' },
      { label: 'Traité', date: '11 Avr 2026, 15:00', color: 'teal' },
      { label: 'Archivé', date: '11 Avr 2026, 17:30', color: 'gray' },
    ],
    assignedTo: 'Yacine Rahmani',
  },
  {
    id: 'in5', reference: 'IN-2026-0888',
    sender: 'Mairie d\'Alger', subject: 'Demande de documents administratifs',
    description: "Demande de copies certifiées de documents administratifs pour dossier municipal.",
    dateReceived: '10 Avr 2026', status: 'Pending', category: 'Administratif / Général', confidence: 72,
    attachments: [{ name: 'Demande_Mairie.pdf', type: 'pdf', size: '450 Ko' }],
    ocrText: "Mairie d'Alger – Service Administratif\nRéf: MA/2026-0888\nObjet: Demande de documents administratifs...",
    alternativeCategories: [{ label: 'Juridique / Conformité', confidence: 38 }],
    timeline: [
      { label: 'Reçu et enregistré', date: '10 Avr 2026, 14:00', color: 'blue' },
      { label: 'En attente de traitement', date: 'Statut actuel', color: 'amber' },
    ],
    assignedTo: 'Karim Mansouri',
  },
];

export const OUTGOING_MAIL = [
  {
    id: 'out1', reference: 'OUT-2026-0234',
    recipient: 'Ministère des Finances', subject: 'Réponse à la demande budgétaire – T2 2026',
    description: "Réponse officielle à la demande d'allocation budgétaire soumise le 14 Avr 2026.",
    dateSent: '13 Avr 2026', status: 'Sent',
    attachments: [{ name: 'Réponse_Budget.pdf', type: 'pdf', size: '980 Ko' }],
    timeline: [
      { label: 'Créé', date: '13 Avr 2026, 09:00', color: 'blue' },
      { label: 'Approuvé', date: '13 Avr 2026, 11:00', color: 'teal' },
      { label: 'Envoyé', date: '13 Avr 2026, 14:00', color: 'green' },
    ],
  },
  {
    id: 'out2', reference: 'OUT-2026-0233',
    recipient: 'Cour des Comptes', subject: "Rapport d'activité mensuel – Mars 2026",
    description: "Rapport d'activité et de performance mensuel pour Mars 2026.",
    dateSent: '11 Avr 2026', status: 'Sent',
    attachments: [
      { name: 'Rapport_Mars.pdf', type: 'pdf', size: '2.1 Mo' },
      { name: 'Statistiques.xlsx', type: 'xlsx', size: '460 Ko' },
    ],
    timeline: [
      { label: 'Créé', date: '10 Avr 2026, 14:00', color: 'blue' },
      { label: 'Révisé', date: '11 Avr 2026, 09:00', color: 'teal' },
      { label: 'Envoyé', date: '11 Avr 2026, 10:30', color: 'green' },
    ],
  },
  {
    id: 'out3', reference: 'OUT-2026-0232',
    recipient: 'Direction des RH', subject: 'Mise à jour affectation personnel – T2',
    description: "Mise à jour des affectations et planifications du personnel pour le T2 2026.",
    dateSent: '10 Avr 2026', status: 'Sent',
    attachments: [{ name: 'Affectation_Personnel.pdf', type: 'pdf', size: '340 Ko' }],
    timeline: [
      { label: 'Créé', date: '09 Avr 2026', color: 'blue' },
      { label: 'Envoyé', date: '10 Avr 2026', color: 'green' },
    ],
  },
  {
    id: 'out4', reference: 'OUT-2026-0231',
    recipient: 'Mairie d\'Alger', subject: 'Documents administratifs certifiés',
    description: 'Transmission des copies certifiées demandées par la mairie.',
    dateSent: '09 Avr 2026', status: 'Archived',
    attachments: [{ name: 'Documents_Certifiés.pdf', type: 'pdf', size: '1.8 Mo' }],
    timeline: [
      { label: 'Créé', date: '08 Avr 2026', color: 'blue' },
      { label: 'Envoyé', date: '09 Avr 2026', color: 'green' },
      { label: 'Archivé', date: '12 Avr 2026', color: 'gray' },
    ],
  },
];

export const NOTIFICATIONS = {
  admin: [
    { id: 'n1', type: 'security', title: 'Alerte sécurité : Tentative de connexion échouée', subtitle: 'IP: 196.62.45.18 — 3 tentatives bloquées', time: "Aujourd'hui, 08:47", read: false, tab: 'Security' },
    { id: 'n2', type: 'system',   title: 'Sauvegarde système planifiée', subtitle: 'Sauvegarde automatique à 02:00 cette nuit', time: "Aujourd'hui, 09:00", read: false, tab: 'System' },
    { id: 'n3', type: 'success',  title: 'Nouvel utilisateur créé', subtitle: 'Karim Mansouri — Rôle : Agent', time: 'Hier, 14:30', read: true, tab: 'System' },
    { id: 'n4', type: 'mail',     title: 'Statut courrier mis à jour', subtitle: 'IN-2026-0889 → Archivé', time: 'Hier, 11:15', read: true, tab: 'Mail Updates' },
    { id: 'n5', type: 'system',   title: 'OCR : 14 documents traités', subtitle: 'Classification appliquée automatiquement', time: '13 Avr, 16:00', read: true, tab: 'System' },
    { id: 'n6', type: 'security', title: 'Rôle modifié', subtitle: "Leila Hamdi : Agent → Lecteur", time: '12 Avr, 10:20', read: true, tab: 'Security' },
  ],
  agent: [
    { id: 'n1', type: 'success',  title: 'OCR terminé avec succès', subtitle: 'Document IN-2026-0892 traité', time: "Aujourd'hui, 09:15", read: false, tab: 'Updates' },
    { id: 'n2', type: 'mail',     title: 'Nouveau courrier assigné', subtitle: 'IN-2026-0890 – URGENT : Formation RH', time: "Aujourd'hui, 08:50", read: false, tab: 'Updates' },
    { id: 'n3', type: 'security', title: 'Rappel échéance', subtitle: 'IN-2026-0888 à traiter sous 2 jours', time: 'Hier, 17:00', read: true, tab: 'Deadlines' },
    { id: 'n4', type: 'mail',     title: 'Statut courrier mis à jour', subtitle: 'OUT-2026-0234 marqué Envoyé', time: 'Hier, 14:20', read: true, tab: 'Updates' },
    { id: 'n5', type: 'security', title: 'Rappel échéance', subtitle: 'IN-2026-0892 à traiter avant 20 Avr', time: '13 Avr, 09:00', read: true, tab: 'Deadlines' },
  ],
  lecteur: [
    { id: 'n1', type: 'success',  title: 'Nouveau document disponible', subtitle: 'IN-2026-0892 ajouté à votre accès', time: "Aujourd'hui, 09:05", read: false, tab: 'Updates' },
    { id: 'n2', type: 'mail',     title: 'Statut modifié', subtitle: 'IN-2026-0891 → Traité', time: 'Hier, 16:30', read: true, tab: 'Updates' },
    { id: 'n3', type: 'system',   title: 'Archive mise à jour', subtitle: '3 nouveaux documents archivés', time: '13 Avr, 14:00', read: true, tab: 'Reminders' },
  ],
};

export const CREDENTIALS = {
  'a.mehdi@bureau.dz': { password: 'Admin123!', role: 'Admin',   userId: '1' },
  'admin_mehdi':        { password: 'Admin123!', role: 'Admin',   userId: '1' },
  's.benali@bureau.dz': { password: 'Agent123!', role: 'Agent',   userId: '2' },
  's.benali':           { password: 'Agent123!', role: 'Agent',   userId: '2' },
  'l.hamdi@bureau.dz':  { password: 'Lecteur123!', role: 'Lecteur', userId: '5' }, // routes to Nadia (active)
  'n.oussama':          { password: 'Lecteur123!', role: 'Lecteur', userId: '5' },
};

export const ANALYTICS = {
  monthlyMail: [
    { month: 'Jan', incoming: 52, outgoing: 38 },
    { month: 'Fév', incoming: 44, outgoing: 51 },
    { month: 'Mar', incoming: 68, outgoing: 35 },
    { month: 'Avr', incoming: 49, outgoing: 28 },
  ],
  categories: [
    { name: 'Finance',     percent: 38, color: '#378ADD' },
    { name: 'RH',          percent: 27, color: '#1D9E75' },
    { name: 'Technique',   percent: 20, color: '#BA7517' },
    { name: 'Juridique',   percent: 15, color: '#7F77DD' },
  ],
  userActivity: [
    { name: 'Sara Benali',    actions: 47, role: 'Agent' },
    { name: 'Karim Mansouri', actions: 31, role: 'Agent' },
    { name: 'Yacine Rahmani', actions: 18, role: 'Agent' },
    { name: 'Nadia Oussama',  actions: 12, role: 'Lecteur' },
  ],
  summary: { totalIncoming: 148, totalOutgoing: 93, pending: 27, archived: 312, totalUsers: 6 },
};
