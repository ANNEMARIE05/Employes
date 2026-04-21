'use client'

import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
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
import { PageHistorique } from '@/components/historique/page-historique'
import { PageParametres } from '@/components/parametres/page-parametres'
import { PageParametrage } from '@/components/parametrage/page-parametrage'
import { PageAbsences } from '@/components/absences/page-absences'
import { LoaderPleinEcran } from '@/components/ui/loader'
import { AppBackgroundDecor } from '@/components/layout/app-background-decor'
import { FormulaireConge } from '@/components/conges/formulaire-conge'
import { FormulaireDocument } from '@/components/documents/formulaire-document'
import { employesMock, notificationsMock } from '@/lib/donnees-mock'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/components/ui/use-mobile'

const ROUTE_VERS_ONGLET: Record<string, string> = {
  'tableau-bord': 'tableau-bord',
  employes: 'employes',
  conges: 'conges',
  'mes-conges': 'mes-conges',
  absences: 'absences',
  documents: 'documents',
  'mes-documents': 'mes-documents',
  'mon-profil': 'mon-profil',
  statistiques: 'statistiques',
  notifications: 'notifications',
  historique: 'historique',
  parametrage: 'parametrage',
  parametres: 'parametres',
}

const ONGLET_VERS_ROUTE: Record<string, string> = Object.fromEntries(
  Object.entries(ROUTE_VERS_ONGLET).map(([route, onglet]) => [onglet, route])
)

const estRouteValide = (page: string | null): page is string =>
  Boolean(page && (page in ROUTE_VERS_ONGLET || page === 'formulaire-conge' || page === 'formulaire-document'))

function ApplicationContent() {
  const [chargementInitial, setChargementInitial] = useState(true)
  const [formulaireCongeOuvert, setFormulaireCongeOuvert] = useState(false)
  const [formulaireDocumentOuvert, setFormulaireDocumentOuvert] = useState(false)
  const routeInitialisee = useRef(false)
  
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
  const isMobile = useIsMobile()
  const etaitMobile = useRef(false)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const remplacerPageDansURL = useCallback((page: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page)
    router.replace(`${pathname}?${params.toString()}`)
  }, [pathname, router, searchParams])

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
    definirNotifications(
      notificationsMock.filter((notification) =>
        !notification.destinataireId || notification.destinataireId === utilisateur.id
      )
    )
    
    // Rediriger par defaut vers le tableau de bord
    definirOngletActif('tableau-bord')
    remplacerPageDansURL('tableau-bord')
    // Force le retour en haut meme si l'onglet ne change pas visuellement
    window.scrollTo({ top: 0, behavior: 'auto' })
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
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [ongletActif])

  // Synchronisation initiale URL -> onglet (router simple)
  useEffect(() => {
    if (routeInitialisee.current) {
      return
    }

    const page = searchParams.get('page')
    if (!estRouteValide(page)) {
      definirOngletActif('tableau-bord')
      remplacerPageDansURL('tableau-bord')
      routeInitialisee.current = true
      return
    }

    if (page === 'formulaire-conge') {
      definirOngletActif('mes-conges')
      setFormulaireCongeOuvert(true)
      routeInitialisee.current = true
      return
    }

    if (page === 'formulaire-document') {
      definirOngletActif('mes-documents')
      setFormulaireDocumentOuvert(true)
      routeInitialisee.current = true
      return
    }

    const onglet = ROUTE_VERS_ONGLET[page] || 'tableau-bord'
    definirOngletActif(onglet)
    routeInitialisee.current = true
  }, [definirOngletActif, remplacerPageDansURL, searchParams])

  // Synchronisation onglet -> URL
  useEffect(() => {
    if (!routeInitialisee.current) {
      return
    }
    const pageActuelle = searchParams.get('page')
    const routeSouhaitee = ONGLET_VERS_ROUTE[ongletActif] || 'tableau-bord'
    if (pageActuelle !== routeSouhaitee) {
      remplacerPageDansURL(routeSouhaitee)
    }
  }, [ongletActif, remplacerPageDansURL, searchParams])

  // En version telephone, fermer le menu seulement lors du passage desktop -> mobile.
  useEffect(() => {
    if (isMobile && !etaitMobile.current && menuOuvert) {
      useAppStore.setState({ menuOuvert: false })
    }
    etaitMobile.current = isMobile
  }, [isMobile, menuOuvert])

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
      case 'absences':
        return <PageAbsences />
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
      case 'historique':
        return <PageHistorique />
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

  // Si non authentifié, forcer la vraie route /login
  if (!estAuthentifie) {
    router.replace('/login')
    return <LoaderPleinEcran texte="MUFER Employes" />
  }

  return (
    <div className="min-h-screen bg-background relative overflow-x-clip">
      <AppBackgroundDecor />
      {/* Sidebar */}
      <Sidebar />
      
      {/* Header */}
      <Header onNouvelleDemande={handleNouvelleDemande} />
      
      {/* Contenu principal */}
      <motion.main
        className={cn(
          'relative z-10 min-h-screen px-2.5 pt-18 transition-all duration-300 sm:px-6 sm:pt-20',
          isMobile ? 'ml-0' : (menuOuvert ? 'ml-[260px]' : 'ml-[72px]')
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
          <FormulaireConge
            onFermer={() => setFormulaireCongeOuvert(false)}
            afficherSelectionEmploye={utilisateurConnecte?.role === 'rh'}
          />
        )}
        {formulaireDocumentOuvert && (
          <FormulaireDocument
            onFermer={() => setFormulaireDocumentOuvert(false)}
            afficherSelectionEmploye={utilisateurConnecte?.role === 'rh'}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Application() {
  return (
    <Suspense fallback={<LoaderPleinEcran texte="MUFER Employes" />}>
      <ApplicationContent />
    </Suspense>
  )
}
