// Types principaux de l'application RH

export type RoleUtilisateur = 'rh' | 'manager' | 'employe'

export interface Employe {
  id: string
  prenom: string
  nom: string
  email: string
  poste: string
  departement: string
  dateEmbauche: string
  avatar: string
  telephone: string
  statut: 'actif' | 'conge' | 'absent' | 'demission'
  manager?: string
  soldeConges: number
  soldeRTT: number
  role: RoleUtilisateur
}

export interface DemandeConge {
  id: string
  employeId: string
  employe?: Employe
  type: TypeConge
  dateDebut: string
  dateFin: string
  motif?: string
  statut: StatutDemande
  dateCreation: string
  dateTraitement?: string
  commentaireRH?: string
  nombreJours: number
}

export type TypeConge = 
  | 'conge_paye' 
  | 'rtt' 
  | 'maladie' 
  | 'sans_solde' 
  | 'maternite' 
  | 'paternite' 
  | 'exceptionnel'

export type StatutDemande = 'en_attente' | 'approuve' | 'refuse' | 'annule'

export interface DemandeDocument {
  id: string
  employeId: string
  employe?: Employe
  typeDocument: TypeDocument
  statut: StatutDemande
  dateCreation: string
  dateTraitement?: string
  commentaire?: string
  fichierUrl?: string
}

export type TypeDocument = 
  | 'attestation_emploi' 
  | 'fiche_paie' 
  | 'certificat_travail' 
  | 'attestation_salaire'
  | 'contrat_travail'
  | 'attestation_pole_emploi'

export interface Notification {
  id: string
  titre: string
  message: string
  type: 'info' | 'succes' | 'avertissement' | 'erreur'
  lu: boolean
  dateCreation: string
  lien?: string
}

export interface StatistiquesRH {
  totalEmployes: number
  employesActifs: number
  employesEnConge: number
  demandesEnAttente: number
  tauxAbsenteisme: number
  congesApprouvesCeMois: number
  documentsTraitesCeMois: number
  evolutionEffectif: { mois: string; effectif: number }[]
  repartitionDepartements: { departement: string; effectif: number }[]
  typesCongesUtilises: { type: string; nombre: number }[]
}

export interface Departement {
  id: string
  nom: string
  responsable: string
  effectif: number
  couleur: string
}

// Labels en français
export const LABELS_TYPE_CONGE: Record<TypeConge, string> = {
  conge_paye: 'Congé payé',
  rtt: 'RTT',
  maladie: 'Arrêt maladie',
  sans_solde: 'Sans solde',
  maternite: 'Maternité',
  paternite: 'Paternité',
  exceptionnel: 'Exceptionnel',
}

export const LABELS_TYPE_DOCUMENT: Record<TypeDocument, string> = {
  attestation_emploi: "Attestation d'emploi",
  fiche_paie: 'Fiche de paie',
  certificat_travail: 'Certificat de travail',
  attestation_salaire: 'Attestation de salaire',
  contrat_travail: 'Contrat de travail',
  attestation_pole_emploi: 'Attestation Pôle Emploi',
}

export const LABELS_STATUT: Record<StatutDemande, string> = {
  en_attente: 'En attente',
  approuve: 'Approuvée',
  refuse: 'Refusée',
  annule: 'Annulée',
}

export const COULEURS_STATUT: Record<StatutDemande, string> = {
  en_attente: 'bg-warning/20 text-warning-foreground border-warning/30',
  approuve: 'bg-success/20 text-success border-success/30',
  refuse: 'bg-destructive/20 text-destructive border-destructive/30',
  annule: 'bg-muted text-muted-foreground border-muted',
}
