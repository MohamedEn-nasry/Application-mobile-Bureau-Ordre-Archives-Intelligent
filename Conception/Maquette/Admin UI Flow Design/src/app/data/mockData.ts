export const adminUser = {
  id: 'u001',
  name: 'Ahmed Benali',
  email: 'admin@bureau-ordre.gov.dz',
  username: 'admin.ahmed',
  role: 'Admin',
  avatar: 'AB',
  phone: '+213 21 74 55 30',
  department: 'Direction Générale',
  lastLogin: '24 Mars 2026, 08:15',
};

export const users = [
  { id: 'u002', name: 'Fatima Zohra Haddad', email: 'f.haddad@bureau.gov.dz', username: 'f.haddad', role: 'Agent', status: 'active', avatar: 'FH', lastActive: '24 Mar 2026', department: 'Secrétariat' },
  { id: 'u003', name: 'Karim Messaoud', email: 'k.messaoud@bureau.gov.dz', username: 'k.messaoud', role: 'Agent', status: 'active', avatar: 'KM', lastActive: '23 Mar 2026', department: 'Courrier' },
  { id: 'u004', name: 'Nadia Brahimi', email: 'n.brahimi@bureau.gov.dz', username: 'n.brahimi', role: 'Lecteur', status: 'active', avatar: 'NB', lastActive: '22 Mar 2026', department: 'Juridique' },
  { id: 'u005', name: 'Yacine Oukil', email: 'y.oukil@bureau.gov.dz', username: 'y.oukil', role: 'Lecteur', status: 'disabled', avatar: 'YO', lastActive: '10 Mar 2026', department: 'Finance' },
  { id: 'u006', name: 'Samira Khelil', email: 's.khelil@bureau.gov.dz', username: 's.khelil', role: 'Agent', status: 'active', avatar: 'SK', lastActive: '24 Mar 2026', department: 'Logistique' },
  { id: 'u007', name: 'Omar Taleb', email: 'o.taleb@bureau.gov.dz', username: 'o.taleb', role: 'Lecteur', status: 'active', avatar: 'OT', lastActive: '20 Mar 2026', department: 'RH' },
];

export const incomingMail = [
  {
    id: 'IM001', ref: 'BO-IN-2026-0247',
    sender: 'Direction des Ressources Humaines',
    subject: 'Demande de congé urgent - M. Benali',
    date: '24 Mar 2026', status: 'Pending', category: 'RH',
    description: "Suite à la demande formulée par M. Benali Ahmed, employé au service technique, nous vous prions de bien vouloir étudier sa demande de congé exceptionnel pour raisons familiales, du 25 au 30 mars 2026.",
    attachments: ['demande_conge_benali.pdf', 'justificatif_medical.pdf'],
    ocrText: "Monsieur le Directeur, J'ai l'honneur de vous soumettre ma demande de congé exceptionnel pour une période de 6 jours ouvrables...",
    classification: 'RH - Congés', confidence: 94, assignedTo: 'f.haddad',
  },
  {
    id: 'IM002', ref: 'BO-IN-2026-0246',
    sender: 'Ministère des Finances',
    subject: 'Circulaire budgétaire T2 2026',
    date: '23 Mar 2026', status: 'Received', category: 'Finance',
    description: "Veuillez trouver ci-joint la circulaire relative à l'exécution du budget pour le deuxième trimestre 2026. Merci de prendre les dispositions nécessaires.",
    attachments: ['circulaire_budget_T2_2026.pdf'],
    ocrText: "Dans le cadre de l'exécution budgétaire, les directions sont tenues de...",
    classification: 'Finance - Budget', confidence: 97, assignedTo: 'k.messaoud',
  },
  {
    id: 'IM003', ref: 'BO-IN-2026-0245',
    sender: 'Inspection Générale',
    subject: 'Rapport d\'audit Q1 2026',
    date: '22 Mar 2026', status: 'Archived', category: 'Juridique',
    description: "Rapport complet de l'audit interne du premier trimestre 2026. Ce document est confidentiel et destiné uniquement à la direction.",
    attachments: ['rapport_audit_Q1_2026.pdf', 'annexes_audit.xlsx'],
    ocrText: "L'audit du premier trimestre révèle une conformité globale de 87%...",
    classification: 'Juridique - Audit', confidence: 89, assignedTo: 'n.brahimi',
  },
  {
    id: 'IM004', ref: 'BO-IN-2026-0244',
    sender: 'Direction Logistique',
    subject: 'Bon de commande - Matériel informatique',
    date: '21 Mar 2026', status: 'Pending', category: 'Logistique',
    description: "Demande d'acquisition de matériel informatique pour le renouvellement du parc machines des agents du bureau d'ordre.",
    attachments: ['bon_commande_materiel.pdf'],
    ocrText: "Bon de commande N° LOG-2026-0089 pour l'acquisition de 15 ordinateurs...",
    classification: 'Logistique - Achats', confidence: 91, assignedTo: 's.khelil',
  },
];

export const outgoingMail = [
  {
    id: 'OM001', ref: 'BO-OUT-2026-0183',
    recipient: 'Ministère de l\'Intérieur',
    subject: 'Rapport d\'activité mensuel - Mars 2026',
    date: '24 Mar 2026', status: 'Sent', category: 'Rapports',
    description: "Envoi du rapport d'activité mensuel conformément aux exigences réglementaires. Ce rapport couvre l'ensemble des activités du mois de mars 2026.",
    attachments: ['rapport_activite_mars2026.pdf'],
    assignedTo: 'admin.ahmed',
  },
  {
    id: 'OM002', ref: 'BO-OUT-2026-0182',
    recipient: 'Direction Provinciale des Impôts',
    subject: 'Déclaration fiscale annuelle 2025',
    date: '23 Mar 2026', status: 'Sent', category: 'Finance',
    description: "Transmission de la déclaration fiscale annuelle pour l'exercice 2025, accompagnée des pièces justificatives requises.",
    attachments: ['declaration_fiscale_2025.pdf', 'bilans_comptables.xlsx'],
    assignedTo: 'k.messaoud',
  },
  {
    id: 'OM003', ref: 'BO-OUT-2026-0181',
    recipient: 'Fournisseur TechEquip SARL',
    subject: 'Accusé de réception - Commande 2026-089',
    date: '22 Mar 2026', status: 'Pending', category: 'Logistique',
    description: "Accusé de réception de la commande de matériel informatique, en attente de validation budgétaire.",
    attachments: ['accuse_reception_commande.pdf'],
    assignedTo: 's.khelil',
  },
];

export const notifications = [
  { id: 'n001', type: 'security', title: 'Tentative de connexion suspecte', message: 'Connexion échouée depuis une adresse IP inconnue (192.168.100.55)', time: 'Il y a 5 min', read: false },
  { id: 'n002', type: 'system', title: 'Mise à jour système planifiée', message: 'Une maintenance est prévue le 25 Mars 2026 de 22h00 à 00h00', time: 'Il y a 30 min', read: false },
  { id: 'n003', type: 'mail', title: 'Nouveau courrier entrant', message: 'REF: BO-IN-2026-0247 — Demande de congé urgent de la DRH', time: 'Il y a 1h', read: false },
  { id: 'n004', type: 'user', title: 'Utilisateur créé', message: 'Le compte de Samira Khelil (Agent) a été créé avec succès', time: 'Il y a 2h', read: true },
  { id: 'n005', type: 'mail', title: 'Statut courrier mis à jour', message: 'BO-IN-2026-0246 a été marqué comme "Reçu" par k.messaoud', time: 'Il y a 3h', read: true },
  { id: 'n006', type: 'user', title: 'Rôle modifié', message: 'Le rôle de Yacine Oukil a été changé de Agent à Lecteur', time: 'Hier, 17:30', read: true },
  { id: 'n007', type: 'system', title: 'Sauvegarde automatique effectuée', message: 'Sauvegarde quotidienne réussie — 3.2 GB archivés', time: 'Hier, 02:00', read: true },
  { id: 'n008', type: 'security', title: 'Réinitialisation de mot de passe', message: 'Mot de passe réinitialisé pour l\'utilisateur n.brahimi', time: 'Hier, 09:15', read: true },
];

export const recentActivity = [
  { id: 'a001', user: 'f.haddad', action: 'a assigné le courrier BO-IN-2026-0247', time: '09:32', icon: 'mail' },
  { id: 'a002', user: 'k.messaoud', action: 'a archivé le courrier BO-IN-2026-0243', time: '09:15', icon: 'archive' },
  { id: 'a003', user: 'admin.ahmed', action: 'a créé le compte de S. Khelil', time: '08:55', icon: 'user-plus' },
  { id: 'a004', user: 's.khelil', action: 'a téléchargé le rapport d\'audit Q1', time: '08:30', icon: 'download' },
  { id: 'a005', user: 'n.brahimi', action: 'a consulté le dossier BO-IN-2026-0245', time: '08:20', icon: 'eye' },
];

export const monthlyChartData = [
  { month: 'Oct', entrant: 38, sortant: 27 },
  { month: 'Nov', entrant: 52, sortant: 41 },
  { month: 'Déc', entrant: 44, sortant: 35 },
  { month: 'Jan', entrant: 61, sortant: 48 },
  { month: 'Fév', entrant: 69, sortant: 53 },
  { month: 'Mar', entrant: 55, sortant: 43 },
];

export const categoryChartData = [
  { name: 'RH', value: 35, color: '#3B82F6' },
  { name: 'Finance', value: 25, color: '#8B5CF6' },
  { name: 'Juridique', value: 20, color: '#06B6D4' },
  { name: 'Logistique', value: 12, color: '#10B981' },
  { name: 'Autre', value: 8, color: '#F59E0B' },
];

export const activityLineData = [
  { day: 'L', actions: 24 },
  { day: 'M', actions: 38 },
  { day: 'Me', actions: 29 },
  { day: 'J', actions: 45 },
  { day: 'V', actions: 41 },
  { day: 'S', actions: 18 },
  { day: 'D', actions: 12 },
];

export const dashboardStats = {
  incoming: 247,
  outgoing: 183,
  pending: 34,
  archived: 892,
  users: 7,
};
