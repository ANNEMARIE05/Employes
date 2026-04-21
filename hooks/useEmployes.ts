'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { serviceEmployes } from '@/lib/api'
import { useAppStore } from '@/store/useAppStore'
import type { Employe } from '@/types'

// Clés de cache
export const CLES_EMPLOYES = {
  tous: ['employes'] as const,
  detail: (id: string) => ['employes', id] as const,
}

// Hook pour récupérer tous les employés
export function useEmployes() {
  const definirEmployes = useAppStore((state) => state.definirEmployes)
  
  return useQuery({
    queryKey: CLES_EMPLOYES.tous,
    queryFn: async () => {
      const { data } = await serviceEmployes.recupererTous()
      definirEmployes(data)
      return data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}

// Hook pour récupérer un employé par ID
export function useEmploye(id: string) {
  return useQuery({
    queryKey: CLES_EMPLOYES.detail(id),
    queryFn: async () => {
      const { data } = await serviceEmployes.recupererParId(id)
      return data
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

// Hook pour créer un employé
export function useCreerEmploye() {
  const queryClient = useQueryClient()
  const ajouterEmploye = useAppStore((state) => state.ajouterEmploye)
  const ajouterNotification = useAppStore((state) => state.ajouterNotification)
  
  return useMutation({
    mutationFn: (donnees: Omit<Employe, 'id'>) => 
      serviceEmployes.creer(donnees),
    onSuccess: ({ data }) => {
      ajouterEmploye(data)
      queryClient.invalidateQueries({ queryKey: CLES_EMPLOYES.tous })
      ajouterNotification({
        titre: 'Employé créé',
        message: `${data.prenom} ${data.nom} a été ajouté avec succès.`,
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

// Hook pour modifier un employé
export function useModifierEmploye() {
  const queryClient = useQueryClient()
  const modifierEmploye = useAppStore((state) => state.modifierEmploye)
  const ajouterNotification = useAppStore((state) => state.ajouterNotification)
  
  return useMutation({
    mutationFn: ({ id, donnees }: { id: string; donnees: Partial<Employe> }) =>
      serviceEmployes.modifier(id, donnees),
    onSuccess: ({ data }) => {
      modifierEmploye(data.id, data)
      queryClient.invalidateQueries({ queryKey: CLES_EMPLOYES.tous })
      queryClient.invalidateQueries({ queryKey: CLES_EMPLOYES.detail(data.id) })
      ajouterNotification({
        titre: 'Profil mis à jour',
        message: 'Les informations ont été enregistrées.',
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

// Hook pour supprimer un employé
export function useSupprimerEmploye() {
  const queryClient = useQueryClient()
  const ajouterNotification = useAppStore((state) => state.ajouterNotification)
  
  return useMutation({
    mutationFn: (id: string) => serviceEmployes.supprimer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLES_EMPLOYES.tous })
      ajouterNotification({
        titre: 'Employé supprimé',
        message: 'Le profil a été supprimé avec succès.',
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
