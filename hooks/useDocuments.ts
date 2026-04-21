'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { serviceDocuments } from '@/lib/api'
import { useAppStore } from '@/store/useAppStore'
import type { DemandeDocument, StatutDemande } from '@/types'

// Clés de cache
export const CLES_DOCUMENTS = {
  tous: ['documents'] as const,
  parEmploye: (id: string) => ['documents', 'employe', id] as const,
  detail: (id: string) => ['documents', id] as const,
}

// Hook pour récupérer toutes les demandes de documents
export function useDocuments() {
  const definirDemandesDocuments = useAppStore((state) => state.definirDemandesDocuments)
  
  return useQuery({
    queryKey: CLES_DOCUMENTS.tous,
    queryFn: async () => {
      const { data } = await serviceDocuments.recupererTous()
      definirDemandesDocuments(data)
      return data
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  })
}

// Hook pour récupérer les documents d'un employé
export function useDocumentsEmploye(employeId: string) {
  return useQuery({
    queryKey: CLES_DOCUMENTS.parEmploye(employeId),
    queryFn: async () => {
      const { data } = await serviceDocuments.recupererParEmploye(employeId)
      return data
    },
    enabled: !!employeId,
    staleTime: 2 * 60 * 1000,
  })
}

// Hook pour créer une demande de document
export function useCreerDemandeDocument() {
  const queryClient = useQueryClient()
  const ajouterDemandeDocument = useAppStore((state) => state.ajouterDemandeDocument)
  const ajouterNotification = useAppStore((state) => state.ajouterNotification)
  
  return useMutation({
    mutationFn: (donnees: Omit<DemandeDocument, 'id' | 'dateCreation' | 'statut'>) =>
      serviceDocuments.creer(donnees),
    onSuccess: ({ data }) => {
      ajouterDemandeDocument(data)
      queryClient.invalidateQueries({ queryKey: CLES_DOCUMENTS.tous })
      ajouterNotification({
        titre: 'Demande envoyée',
        message: 'Votre demande de document a été soumise.',
        type: 'succes',
        lu: false,
      })
    },
    onError: (error: Error) => {
      ajouterNotification({
        titre: 'Erreur',
        message: error.message,
        type: 'erreur',
        lu: false,
      })
    },
  })
}

// Hook pour traiter un document
export function useTraiterDocument() {
  const queryClient = useQueryClient()
  const modifierStatutDocument = useAppStore((state) => state.modifierStatutDocument)
  const ajouterNotification = useAppStore((state) => state.ajouterNotification)
  
  return useMutation({
    mutationFn: ({ id, fichierUrl }: { id: string; fichierUrl?: string }) =>
      serviceDocuments.traiter(id, fichierUrl),
    onSuccess: ({ data }) => {
      modifierStatutDocument(data.id, 'approuve' as StatutDemande)
      queryClient.invalidateQueries({ queryKey: CLES_DOCUMENTS.tous })
      ajouterNotification({
        titre: 'Document traité',
        message: 'Le document est prêt.',
        type: 'succes',
        lu: false,
      })
    },
    onError: (error: Error) => {
      ajouterNotification({
        titre: 'Erreur',
        message: error.message,
        type: 'erreur',
        lu: false,
      })
    },
  })
}

// Hook pour refuser un document
export function useRefuserDocument() {
  const queryClient = useQueryClient()
  const modifierStatutDocument = useAppStore((state) => state.modifierStatutDocument)
  const ajouterNotification = useAppStore((state) => state.ajouterNotification)
  
  return useMutation({
    mutationFn: ({ id, commentaire }: { id: string; commentaire: string }) =>
      serviceDocuments.refuser(id, commentaire),
    onSuccess: ({ data }) => {
      modifierStatutDocument(data.id, 'refuse' as StatutDemande)
      queryClient.invalidateQueries({ queryKey: CLES_DOCUMENTS.tous })
      ajouterNotification({
        titre: 'Demande refusée',
        message: 'La demande de document a été refusée.',
        type: 'avertissement',
        lu: false,
      })
    },
    onError: (error: Error) => {
      ajouterNotification({
        titre: 'Erreur',
        message: error.message,
        type: 'erreur',
        lu: false,
      })
    },
  })
}
