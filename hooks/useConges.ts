'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { serviceConges } from '@/lib/api'
import { useAppStore } from '@/store/useAppStore'
import type { DemandeConge, StatutDemande } from '@/types'

// Clés de cache
export const CLES_CONGES = {
  tous: ['conges'] as const,
  parEmploye: (id: string) => ['conges', 'employe', id] as const,
  detail: (id: string) => ['conges', id] as const,
}

// Hook pour récupérer toutes les demandes de congés
export function useConges() {
  const definirDemandesConges = useAppStore((state) => state.definirDemandesConges)
  
  return useQuery({
    queryKey: CLES_CONGES.tous,
    queryFn: async () => {
      const { data } = await serviceConges.recupererTous()
      definirDemandesConges(data)
      return data
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  })
}

// Hook pour récupérer les congés d'un employé
export function useCongesEmploye(employeId: string) {
  return useQuery({
    queryKey: CLES_CONGES.parEmploye(employeId),
    queryFn: async () => {
      const { data } = await serviceConges.recupererParEmploye(employeId)
      return data
    },
    enabled: !!employeId,
    staleTime: 2 * 60 * 1000,
  })
}

// Hook pour créer une demande de congé
export function useCreerDemandeConge() {
  const queryClient = useQueryClient()
  const ajouterDemandeConge = useAppStore((state) => state.ajouterDemandeConge)
  const ajouterNotification = useAppStore((state) => state.ajouterNotification)
  
  return useMutation({
    mutationFn: (donnees: Omit<DemandeConge, 'id' | 'dateCreation' | 'statut'>) =>
      serviceConges.creer(donnees),
    onSuccess: ({ data }) => {
      ajouterDemandeConge(data)
      queryClient.invalidateQueries({ queryKey: CLES_CONGES.tous })
      ajouterNotification({
        titre: 'Demande envoyée',
        message: 'Votre demande de congé a été soumise avec succès.',
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

// Hook pour approuver un congé
export function useApprouverConge() {
  const queryClient = useQueryClient()
  const modifierStatutConge = useAppStore((state) => state.modifierStatutConge)
  const ajouterNotification = useAppStore((state) => state.ajouterNotification)
  
  return useMutation({
    mutationFn: ({ id, commentaire }: { id: string; commentaire?: string }) =>
      serviceConges.approuver(id, commentaire),
    onSuccess: ({ data }) => {
      modifierStatutConge(data.id, 'approuve' as StatutDemande, data.commentaireRH)
      queryClient.invalidateQueries({ queryKey: CLES_CONGES.tous })
      ajouterNotification({
        titre: 'Congé approuvé',
        message: 'La demande a été approuvée.',
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

// Hook pour refuser un congé
export function useRefuserConge() {
  const queryClient = useQueryClient()
  const modifierStatutConge = useAppStore((state) => state.modifierStatutConge)
  const ajouterNotification = useAppStore((state) => state.ajouterNotification)
  
  return useMutation({
    mutationFn: ({ id, commentaire }: { id: string; commentaire: string }) =>
      serviceConges.refuser(id, commentaire),
    onSuccess: ({ data }) => {
      modifierStatutConge(data.id, 'refuse' as StatutDemande, data.commentaireRH)
      queryClient.invalidateQueries({ queryKey: CLES_CONGES.tous })
      ajouterNotification({
        titre: 'Congé refusé',
        message: 'La demande a été refusée.',
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

// Hook pour annuler un congé
export function useAnnulerConge() {
  const queryClient = useQueryClient()
  const modifierStatutConge = useAppStore((state) => state.modifierStatutConge)
  const ajouterNotification = useAppStore((state) => state.ajouterNotification)
  
  return useMutation({
    mutationFn: (id: string) => serviceConges.annuler(id),
    onSuccess: ({ data }) => {
      modifierStatutConge(data.id, 'annule' as StatutDemande)
      queryClient.invalidateQueries({ queryKey: CLES_CONGES.tous })
      ajouterNotification({
        titre: 'Demande annulée',
        message: 'Votre demande a été annulée.',
        type: 'info',
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
