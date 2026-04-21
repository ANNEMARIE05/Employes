'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { TableauBord } from '@/components/dashboard/tableau-bord'
import { TableauBordEmploye } from '@/components/dashboard/tableau-bord-employe'
import { ListeEmployes } from '@/components/employes/liste-employes'
import { PageConges } from '@/components/conges/page-conges'
import { MesConges } from '@/components/conges/mes-conges'
import { PageDocuments } from '@/components/documents/page-documents'
import { MesDocuments } from '@/components/documents/mes-documents'
import { MonProfil } from '@/components/profil/mon-profil'
import { PageStatistiques } from '@/components/statistiques/page-statistiques'
import { PageNotifications } from '@/components/notifications/page-notifications'
import { PageParametres } from '@/components/parametres/page-parametres'
import { PageParametrage } from '@/components/parametrage/page-parametrage'
import { PageConnexion } from '@/components/auth/page-connexion'
import { LoaderPleinEcran } from '@/components/ui/loader'
import { FormulaireConge } from '@/components/conges/formulaire-conge'
import { FormulaireDocument } from '@/components/documents/formulaire-document'
import { employesMock, notificationsMock } from '@/lib/donnees-mock'
import { cn } from '@/lib/utils'

export default function Application() {
  const [chargementInitial, setChargementInitial] = useState(true)
  const [formulaireCongeOuvert, setFormulaireCongeOuvert] = useState(false)
  const [formulaireDocumentOuvert, setFormulaireDocumentOuvert] = useState(false)
  
  const { 
    ongletActif, 
    menuOuvert, 
    definirUtilisateur,
    definirOngletActif,
    utilisateurConnecte,
    estAuthentifie,
    deconnecter,
    definirNotifications,
  } = useAppStore()

  // Simulation chargement initial
  useEffect(() => {
    const initialiser = async () => {
      await new Promise(resolve => setTimeout(resolve, 800))
      setChargementInitial(false)
    }
    
    initialiser()
  }, [])

  // Gestion connexion
  const handleConnexion = async (email: string, motDePasse: string) => {
    // Simulation API
    await new Promise(resolve => setTimeout(resolve, 1200))
    
    // Vérification simple pour la démo
    if (motDePasse !== 'demo123') {
      throw new Error('Identifiants incorrects')
    }

    // Trouver l'utilisateur selon l'email
    const utilisateur = email.includes('admin') 
      ? employesMock[0] 
      : employesMock[1]
    
    definirUtilisateur(utilisateur)
    definirNotifications(notificationsMock)
    
    // Toujours rediriger vers le tableau de bord apres connexion
    definirOngletActif('tableau-bord')
  }

  // Gestion nouvelle demande
  const handleNouvelleDemande = () => {
    if (ongletActif === 'conges' || ongletActif === 'mes-conges') {
      setFormulaireCongeOuvert(true)
    } else if (ongletActif === 'documents' || ongletActif === 'mes-documents') {
      setFormulaireDocumentOuvert(true)
    }
  }

  // Scroll to top when changing tabs
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [ongletActif])

  // Rendu du contenu selon l'onglet actif
  const renderContenu = () => {
    const role = utilisateurConnecte?.role || 'employe'
    const isRH = role === 'rh'
    const isManager = role === 'manager'
    
    switch (ongletActif) {
      case 'tableau-bord':
        // Dashboard different selon le role
        return isRH ? <TableauBord /> : <TableauBordEmploye />
      case 'employes':
        // Seul RH et manager peuvent voir la liste des employes
        return (isRH || isManager) ? <ListeEmployes /> : <TableauBordEmploye />
      case 'conges':
        // RH voit toutes les demandes, employe voit ses propres demandes
        return isRH ? <PageConges /> : <MesConges />
      case 'mes-conges':
        return <MesConges />
      case 'documents':
        // RH voit toutes les demandes
        return isRH ? <PageDocuments /> : <MesDocuments />
      case 'mes-documents':
        return <MesDocuments />
      case 'mon-profil':
        return <MonProfil />
      case 'statistiques':
        // Seul RH et manager peuvent voir les statistiques
        return (isRH || isManager) ? <PageStatistiques /> : <TableauBordEmploye />
      case 'notifications':
        return <PageNotifications />
      case 'parametrage':
        // Seul RH peut voir le parametrage
        return isRH ? <PageParametrage /> : <TableauBordEmploye />
      case 'parametres':
        return <PageParametres />
      default:
        return isRH ? <TableauBord /> : <TableauBordEmploye />
    }
  }

  // Loader initial
  if (chargementInitial) {
    return <LoaderPleinEcran texte="MUFER Employes" />
  }

  // Page de connexion si non authentifié
  if (!estAuthentifie) {
    return <PageConnexion onConnexion={handleConnexion} />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Header */}
      <Header onNouvelleDemande={handleNouvelleDemande} />
      
      {/* Contenu principal */}
      <motion.main
        className={cn(
          'pt-20 pb-8 px-6 min-h-screen transition-all duration-300',
          menuOuvert ? 'ml-[260px]' : 'ml-[72px]'
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={ongletActif}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContenu()}
          </motion.div>
        </AnimatePresence>
      </motion.main>

      {/* Modals */}
      <AnimatePresence>
        {formulaireCongeOuvert && (
          <FormulaireConge onFermer={() => setFormulaireCongeOuvert(false)} />
        )}
        {formulaireDocumentOuvert && (
          <FormulaireDocument onFermer={() => setFormulaireDocumentOuvert(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}
