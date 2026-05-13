// Fake data for Manage Incoming Courrier
export interface CourrierItem {
  id: number;
  reference: string;
  type: 'Entrant' | 'Sortant';
  date: string;
  expediteur: string;
  destinataire: string;
  objet: string;
  description: string;
  statut: 'En attente' | 'Traité' | 'Archivé';
  categorie: string;
  assigneA: string;
  attachments: string[];
  ocrText: string;
  classification: string;
  confidence: number;
}

export const FAKE_COURRIERS: CourrierItem[] = [
  {
    id: 1,
    reference: 'REF-2026-001',
    type: 'Entrant',
    date: '20/04/2026',
    expediteur: 'Ministère de l\'Intérieur',
    destinataire: 'Direction Générale',
    objet: 'Circulaire relative à la gestion des archives numériques',
    description: 'Veuillez trouver ci-joint la nouvelle circulaire ministérielle concernant les normes et protocoles de numérisation des archives publiques, applicable à toutes les administrations à compter du 1er Juin 2026.',
    statut: 'En attente',
    categorie: 'Administratif',
    assigneA: 'Fatima Zohra Haddad',
    attachments: ['Circulaire_Archives_2026.pdf', 'Annexe_Normes.pdf'],
    ocrText: 'Conformément aux dispositions de la loi 55-17 relative à la protection des données personnelles, les archives numériques devront être...',
    classification: 'Réglementation Administrative',
    confidence: 92,
  },
  {
    id: 2,
    reference: 'REF-2026-002',
    type: 'Entrant',
    date: '22/04/2026',
    expediteur: 'Préfecture de Casablanca',
    destinataire: 'Service Ressources Humaines',
    objet: 'Demande de vérification d\'antécédents - Agent Alaoui',
    description: 'Dans le cadre de la procédure de mutation de l\'agent Mohamed Alaoui (matricule 47821), nous sollicitons la vérification de son dossier administratif et disciplinaire.',
    statut: 'Traité',
    categorie: 'Ressources Humaines',
    assigneA: 'Karim Benjelloun',
    attachments: ['Dossier_Alaoui_M.pdf'],
    ocrText: 'Objet : Vérification administrative - Agent Alaoui Mohamed, Matricule 47821. Suite à la demande de mutation...',
    classification: 'Ressources Humaines',
    confidence: 88,
  },
  {
    id: 3,
    reference: 'REF-2026-003',
    type: 'Entrant',
    date: '25/04/2026',
    expediteur: 'Société Marocaine de Construction',
    destinataire: 'Service Financier',
    objet: 'Facture N° 4022 - Travaux d\'aménagement Bureau',
    description: 'Facture pour les travaux de rénovation et d\'aménagement du bureau d\'ordre effectués durant le mois de Mars 2026, conformément au bon de commande n° BC-2026-08.',
    statut: 'En attente',
    categorie: 'Financier',
    assigneA: 'Non assigné',
    attachments: ['Facture_4022.pdf', 'Devis_signé.pdf', 'Photos_travaux.pdf'],
    ocrText: 'Facture N° 4022 - Montant HT: 45,000.00 MAD - TVA 20%: 9,000.00 MAD - Montant TTC: 54,000.00 MAD...',
    classification: 'Document Financier',
    confidence: 97,
  },
  {
    id: 4,
    reference: 'REF-2026-004',
    type: 'Entrant',
    date: '28/04/2026',
    expediteur: 'Citoyen: Ahmed Benali',
    destinataire: 'Service des Réclamations',
    objet: 'Réclamation concernant le retard de délivrance d\'attestation',
    description: 'Le citoyen Ahmed Benali se plaint du retard anormal dans la délivrance de son attestation administrative déposée le 15/03/2026. Il demande une réponse urgente et un suivi de son dossier.',
    statut: 'En attente',
    categorie: 'Plaintes',
    assigneA: 'Non assigné',
    attachments: ['Reclamation_Benali.pdf'],
    ocrText: 'Je soussigné Ahmed Benali, CIN AB456789, adresse... sollicite par la présente une réponse urgente concernant ma demande du...',
    classification: 'Plainte Citoyenne',
    confidence: 85,
  },
  {
    id: 5,
    reference: 'REF-2026-005',
    type: 'Entrant',
    date: '29/04/2026',
    expediteur: 'Ministère de la Santé',
    destinataire: 'Bureau d\'Ordre',
    objet: 'Note: Mesures préventives dans les administrations 2026',
    description: 'Note ministérielle rappelant les protocoles sanitaires et mesures d\'hygiène à respecter au sein des bureaux administratifs publics pour l\'année 2026.',
    statut: 'Traité',
    categorie: 'Administratif',
    assigneA: 'Fatima Zohra Haddad',
    attachments: ['Note_Sante_2026.pdf'],
    ocrText: 'Note circulaire n° 42/MS/2026 relative aux mesures sanitaires préventives dans les administrations publiques...',
    classification: 'Note Ministérielle',
    confidence: 94,
  },
  {
    id: 6,
    reference: 'REF-2026-006',
    type: 'Entrant',
    date: '29/04/2026',
    expediteur: 'Inspection Générale des Finances',
    destinataire: 'Direction',
    objet: 'Avis d\'audit annuel - Juin 2026',
    description: 'Information concernant l\'audit annuel de conformité prévu du 02 au 13 Juin 2026. Les équipes de l\'inspection générale se présenteront muni d\'une lettre de mission officielle.',
    statut: 'En attente',
    categorie: 'Administratif',
    assigneA: 'Non assigné',
    attachments: ['Avis_Audit_IGF.pdf'],
    ocrText: 'Avis d\'audit N° IGF/2026/187 - Conformément aux dispositions du décret n°2-07-1235, une mission d\'audit sera effectuée...',
    classification: 'Contrôle & Audit',
    confidence: 91,
  },
];
