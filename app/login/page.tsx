'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/useAppStore'
import { PageConnexion } from '@/components/auth/page-connexion'
import { LoaderPleinEcran } from '@/components/ui/loader'
import { employesMock, notificationsMock } from '@/lib/donnees-mock'

export default function LoginPage() {
  const router = useRouter()

  const { definirUtilisateur, definirNotifications, definirOngletActif, estAuthentifie } = useAppStore()

  useEffect(() => {
    if (estAuthentifie) {
      router.replace('/?page=tableau-bord')
    }
  }, [estAuthentifie, router])

  const handleConnexion = async (email: string, motDePasse: string) => {
    // Simulation API
    await new Promise((resolve) => setTimeout(resolve, 1200))

    // Vérification simple pour la démo
    if (motDePasse !== 'demo123') {
      throw new Error('Identifiants incorrects')
    }

    // Trouver l'utilisateur selon l'email
    const utilisateur = email.includes('admin') ? employesMock[0] : employesMock[1]

    definirUtilisateur(utilisateur)
    definirNotifications(
      notificationsMock.filter(
        (notification) => !notification.destinataireId || notification.destinataireId === utilisateur.id
      )
    )

    // Rediriger vers l'app (route canonique)
    definirOngletActif('tableau-bord')
    router.replace('/?page=tableau-bord')

    // Force le retour en haut
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  // Petite protection anti-flash si déjà authentifié
  if (estAuthentifie) {
    return <LoaderPleinEcran texte="MUFER Employes" />
  }

  return <PageConnexion onConnexion={handleConnexion} />
}

