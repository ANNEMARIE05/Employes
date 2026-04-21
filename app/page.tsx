'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { TableauBord } from '@/components/dashboard/tableau-bord'
import { ListeEmployes } from '@/components/employes/liste-employes'
import { PageConges } from '@/components/conges/page-conges'
import { PageDocuments } from '@/components/documents/page-documents'
import { PageStatistiques } from '@/components/statistiques/page-statistiques'
import { PageNotifications } from '@/components/notifications/page-notifications'
import { PageParametres } from '@/components/parametres/page-parametres'
import { PageParametrage } from '@/components/parametrage/page-parametrage'
import { PageConnexion } from '@/components/auth/page-connexion'
import { LoaderPleinEcran } from '@/components/ui/loader'
import { FormulaireConge } from '@/components/conges/formulaire-conge'
import { FormulaireDocument } from '@/components/documents/formulaire-document'
import { employesMock } from '@/lib/donnees-mock'
import { cn } from '@/lib/utils'

export default function Application() {
  const [chargementInitial, setChargementInitial] = useState(true)
  const [formulaireCongeOuvert, setFormulaireCongeOuvert] = useState(false)
  const [formulaireDocumentOuvert, setFormulaireDocumentOuvert] = useState(false)
  
  const { 
    ongletActif, 
    menuOuvert, 
    definirUtilisateur,
    utilisateurConnecte,
    estAuthentifie,
    deconnecter,
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
  }

  // Gestion nouvelle demande
  const handleNouvelleDemande = () => {
    if (ongletActif === 'conges') {
      setFormulaireCongeOuvert(true)
    } else if (ongletActif === 'documents') {
      setFormulaireDocumentOuvert(true)
    }
  }

  // Rendu du contenu selon l'onglet actif
  const renderContenu = () => {
    switch (ongletActif) {
      case 'tableau-bord':
        return <TableauBord />
      case 'employes':
        return <ListeEmployes />
      case 'conges':
        return <PageConges />
      case 'documents':
        return <PageDocuments />
      case 'statistiques':
        return <PageStatistiques />
      case 'notifications':
        return <PageNotifications />
      case 'parametrage':
        return <PageParametrage />
      case 'parametres':
        return <PageParametres />
      default:
        return <TableauBord />
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
