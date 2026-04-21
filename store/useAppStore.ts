'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { 
  Employe, 
  DemandeConge, 
  DemandeDocument, 
  Notification,
  StatutDemande 
} from '@/types'

interface AppState {
  // État utilisateur
  utilisateurConnecte: Employe | null
  estAuthentifie: boolean
  
  // Navigation
  menuOuvert: boolean
  ongletActif: string
  
  // Données
  employes: Employe[]
  demandesConges: DemandeConge[]
  demandesDocuments: DemandeDocument[]
  notifications: Notification[]
  
  // Chargement
  chargementGlobal: boolean
  chargementPartiel: Record<string, boolean>
  
  // Filtres
  filtres: {
    recherche: string
    departement: string
    statut: string
    dateDebut: string
    dateFin: string
  }
}

interface AppActions {
  // Authentification
  definirUtilisateur: (utilisateur: Employe | null) => void
  deconnecter: () => void
  
  // Navigation
  basculerMenu: () => void
  definirOngletActif: (onglet: string) => void
  
  // Données
  definirEmployes: (employes: Employe[]) => void
  ajouterEmploye: (employe: Employe) => void
  modifierEmploye: (id: string, donnees: Partial<Employe>) => void
  
  definirDemandesConges: (demandes: DemandeConge[]) => void
  ajouterDemandeConge: (demande: DemandeConge) => void
  modifierStatutConge: (id: string, statut: StatutDemande, commentaire?: string) => void
  
  definirDemandesDocuments: (demandes: DemandeDocument[]) => void
  ajouterDemandeDocument: (demande: DemandeDocument) => void
  modifierStatutDocument: (id: string, statut: StatutDemande) => void
  
  // Notifications
  definirNotifications: (notifications: Notification[]) => void
  ajouterNotification: (notification: Omit<Notification, 'id' | 'dateCreation'>) => void
  marquerCommeLu: (id: string) => void
  supprimerNotification: (id: string) => void
  
  // Chargement
  definirChargementGlobal: (etat: boolean) => void
  definirChargementPartiel: (cle: string, etat: boolean) => void
  
  // Filtres
  definirFiltres: (filtres: Partial<AppState['filtres']>) => void
  reinitialiserFiltres: () => void
}

const etatInitialFiltres = {
  recherche: '',
  departement: '',
  statut: '',
  dateDebut: '',
  dateFin: '',
}

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      // État initial
      utilisateurConnecte: null,
      estAuthentifie: false,
      menuOuvert: true,
      ongletActif: 'tableau-bord',
      employes: [],
      demandesConges: [],
      demandesDocuments: [],
      notifications: [],
      chargementGlobal: false,
      chargementPartiel: {},
      filtres: etatInitialFiltres,

      // Actions authentification
      definirUtilisateur: (utilisateur) => set({ 
        utilisateurConnecte: utilisateur,
        estAuthentifie: !!utilisateur 
      }),
      
      deconnecter: () => set({ 
        utilisateurConnecte: null, 
        estAuthentifie: false,
        notifications: [],
      }),

      // Actions navigation
      basculerMenu: () => set((state) => ({ menuOuvert: !state.menuOuvert })),
      definirOngletActif: (onglet) => set({ ongletActif: onglet }),

      // Actions employés
      definirEmployes: (employes) => set({ employes }),
      
      ajouterEmploye: (employe) => set((state) => ({ 
        employes: [...state.employes, employe] 
      })),
      
      modifierEmploye: (id, donnees) => set((state) => ({
        employes: state.employes.map((e) => 
          e.id === id ? { ...e, ...donnees } : e
        ),
      })),

      // Actions congés
      definirDemandesConges: (demandes) => set({ demandesConges: demandes }),
      
      ajouterDemandeConge: (demande) => set((state) => ({ 
        demandesConges: [demande, ...state.demandesConges] 
      })),
      
      modifierStatutConge: (id, statut, commentaire) => set((state) => ({
        demandesConges: state.demandesConges.map((d) =>
          d.id === id 
            ? { ...d, statut, commentaireRH: commentaire, dateTraitement: new Date().toISOString() } 
            : d
        ),
      })),

      // Actions documents
      definirDemandesDocuments: (demandes) => set({ demandesDocuments: demandes }),
      
      ajouterDemandeDocument: (demande) => set((state) => ({ 
        demandesDocuments: [demande, ...state.demandesDocuments] 
      })),
      
      modifierStatutDocument: (id, statut) => set((state) => ({
        demandesDocuments: state.demandesDocuments.map((d) =>
          d.id === id 
            ? { ...d, statut, dateTraitement: new Date().toISOString() } 
            : d
        ),
      })),

      // Actions notifications
      definirNotifications: (notifications) => set({ notifications }),
      
      ajouterNotification: (notification) => set((state) => ({
        notifications: [
          {
            ...notification,
            id: crypto.randomUUID(),
            dateCreation: new Date().toISOString(),
            lu: false,
          },
          ...state.notifications,
        ],
      })),
      
      marquerCommeLu: (id) => set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, lu: true } : n
        ),
      })),
      
      supprimerNotification: (id) => set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      })),

      // Actions chargement
      definirChargementGlobal: (etat) => set({ chargementGlobal: etat }),
      
      definirChargementPartiel: (cle, etat) => set((state) => ({
        chargementPartiel: { ...state.chargementPartiel, [cle]: etat },
      })),

      // Actions filtres
      definirFiltres: (filtres) => set((state) => ({
        filtres: { ...state.filtres, ...filtres },
      })),
      
      reinitialiserFiltres: () => set({ filtres: etatInitialFiltres }),
    }),
    {
      name: 'mufer-employes-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        utilisateurConnecte: state.utilisateurConnecte,
        estAuthentifie: state.estAuthentifie,
        menuOuvert: state.menuOuvert,
        ongletActif: state.ongletActif,
      }),
    }
  )
)
