'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Filter,
  Search,
  SlidersHorizontal,
  X,
  MessageSquare,
  AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/useAppStore'
import { 
  demandesCongesMock, 
  enrichirDemandesConges,
} from '@/lib/donnees-mock'
import { 
  LABELS_TYPE_CONGE, 
  LABELS_STATUT,
  COULEURS_STATUT,
  type StatutDemande,
  type TypeConge,
  type DemandeConge,
} from '@/types'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import { FormulaireConge } from './formulaire-conge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination'

type FiltreStatut = 'tous' | StatutDemande

const ELEMENTS_PAR_PAGE = 5

export function PageConges() {
  const { modifierStatutConge, ajouterNotification } = useAppStore()
  const [filtreStatut, setFiltreStatut] = useState<FiltreStatut>('tous')
  const [filtreType, setFiltreType] = useState<string>('')
  const [recherche, setRecherche] = useState('')
  const [formulaireOuvert, setFormulaireOuvert] = useState(false)
  const [pageActuelle, setPageActuelle] = useState(1)
  const [filtresAvancesOuverts, setFiltresAvancesOuverts] = useState(false)
  
  // Modal de validation/refus
  const [modalAction, setModalAction] = useState<{
    type: 'approuver' | 'refuser'
    demande: DemandeConge
  } | null>(null)
  const [commentaireRH, setCommentaireRH] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const demandesEnrichies = enrichirDemandesConges(demandesCongesMock)

  // Filtrer les demandes
  const demandesFiltrees = useMemo(() => {
    return demandesEnrichies.filter(demande => {
      const correspondStatut = filtreStatut === 'tous' || demande.statut === filtreStatut
      const correspondType = !filtreType || demande.type === filtreType
      const correspondRecherche = recherche === '' || 
        `${demande.employe?.prenom} ${demande.employe?.nom}`.toLowerCase().includes(recherche.toLowerCase())
      return correspondStatut && correspondRecherche && correspondType
    })
  }, [demandesEnrichies, filtreStatut, filtreType, recherche])

  // Pagination
  const totalPages = Math.ceil(demandesFiltrees.length / ELEMENTS_PAR_PAGE)
  const demandesPaginees = useMemo(() => {
    const debut = (pageActuelle - 1) * ELEMENTS_PAR_PAGE
    return demandesFiltrees.slice(debut, debut + ELEMENTS_PAR_PAGE)
  }, [demandesFiltrees, pageActuelle])

  // Reset page when filters change
  const handleFiltreChange = <T,>(setter: (value: T) => void, value: T) => {
    setter(value)
    setPageActuelle(1)
  }

  // Stats par statut
  const statsStatut = {
    en_attente: demandesEnrichies.filter(d => d.statut === 'en_attente').length,
    approuve: demandesEnrichies.filter(d => d.statut === 'approuve').length,
    refuse: demandesEnrichies.filter(d => d.statut === 'refuse').length,
  }

  const filtresStatut: { id: FiltreStatut; label: string; icone: React.ReactNode; count?: number }[] = [
    { id: 'tous', label: 'Toutes', icone: <Calendar className="w-4 h-4" /> },
    { id: 'en_attente', label: 'En attente', icone: <Clock className="w-4 h-4" />, count: statsStatut.en_attente },
    { id: 'approuve', label: 'Approuvees', icone: <CheckCircle className="w-4 h-4" />, count: statsStatut.approuve },
    { id: 'refuse', label: 'Refusees', icone: <XCircle className="w-4 h-4" />, count: statsStatut.refuse },
  ]

  const reinitialiserFiltres = () => {
    setRecherche('')
    setFiltreStatut('tous')
    setFiltreType('')
    setPageActuelle(1)
  }

  const filtresActifs = recherche || filtreStatut !== 'tous' || filtreType

  // Handlers pour approuver/refuser
  const handleOpenModal = (type: 'approuver' | 'refuser', demande: DemandeConge) => {
    setModalAction({ type, demande })
    setCommentaireRH('')
  }

  const handleCloseModal = () => {
    setModalAction(null)
    setCommentaireRH('')
  }

  const handleConfirmAction = async () => {
    if (!modalAction) return
    
    setIsSubmitting(true)
    
    // Simulation d'une API
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const statut: StatutDemande = modalAction.type === 'approuver' ? 'approuve' : 'refuse'
    modifierStatutConge(modalAction.demande.id, statut, commentaireRH || undefined)
    
    // Ajouter une notification
    ajouterNotification({
      titre: modalAction.type === 'approuver' ? 'Conge approuve' : 'Conge refuse',
      message: `La demande de conge de ${modalAction.demande.employe?.prenom} ${modalAction.demande.employe?.nom} a ete ${modalAction.type === 'approuver' ? 'approuvee' : 'refusee'}.`,
      type: modalAction.type === 'approuver' ? 'succes' : 'avertissement',
    })
    
    setIsSubmitting(false)
    handleCloseModal()
  }

  // Generate page numbers
  const generatePageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (pageActuelle > 3) pages.push('ellipsis')
      const start = Math.max(2, pageActuelle - 1)
      const end = Math.min(totalPages - 1, pageActuelle + 1)
      for (let i = start; i <= end; i++) pages.push(i)
      if (pageActuelle < totalPages - 2) pages.push('ellipsis')
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <div className="space-y-6">
      {/* Filtres statut */}
      <motion.div
        className="flex flex-wrap gap-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {filtresStatut.map((filtre) => (
          <motion.button
            key={filtre.id}
            onClick={() => handleFiltreChange(setFiltreStatut, filtre.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-sm border transition-all',
              filtreStatut === filtre.id
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card border-border hover:border-primary/50'
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {filtre.icone}
            <span className="text-sm font-medium">{filtre.label}</span>
            {filtre.count !== undefined && (
              <span className={cn(
                'text-xs px-1.5 py-0.5 rounded-sm',
                filtreStatut === filtre.id 
                  ? 'bg-primary-foreground/20' 
                  : 'bg-muted'
              )}>
                {filtre.count}
              </span>
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* Barre de recherche et filtres */}
      <motion.div
        className="flex flex-wrap gap-4 items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher par employe..."
            value={recherche}
            onChange={(e) => handleFiltreChange(setRecherche, e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <select
            value={filtreType}
            onChange={(e) => handleFiltreChange(setFiltreType, e.target.value)}
            className="pl-10 pr-8 py-2.5 bg-card border border-border rounded-sm text-sm appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Tous les types</option>
            {Object.entries(LABELS_TYPE_CONGE).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        {/* Bouton reinitialiser */}
        {filtresActifs && (
          <Button
            variant="ghost"
            size="sm"
            onClick={reinitialiserFiltres}
            className="gap-2 rounded-sm text-muted-foreground"
          >
            <X className="w-4 h-4" />
            Effacer les filtres
          </Button>
        )}
      </motion.div>

      {/* Info resultats */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {demandesFiltrees.length} demande{demandesFiltrees.length > 1 ? 's' : ''} trouvee{demandesFiltrees.length > 1 ? 's' : ''}
        </span>
        {totalPages > 1 && (
          <span>
            Page {pageActuelle} sur {totalPages}
          </span>
        )}
      </div>

      {/* Liste des demandes */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <AnimatePresence mode="popLayout">
          {demandesPaginees.map((demande, index) => (
            <motion.div
              key={demande.id}
              className="p-5 bg-card border border-border rounded-sm hover:border-primary/30 transition-colors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              layout
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Employe */}
                <div className="flex items-center gap-3 flex-1">
                  <img
                    src={demande.employe?.avatar}
                    alt={`${demande.employe?.prenom} ${demande.employe?.nom}`}
                    className="w-12 h-12 rounded-sm object-cover"
                  />
                  <div>
                    <p className="font-medium">
                      {demande.employe?.prenom} {demande.employe?.nom}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {demande.employe?.poste}
                    </p>
                  </div>
                </div>

                {/* Type et dates */}
                <div className="flex-1">
                  <p className="font-medium text-sm">{LABELS_TYPE_CONGE[demande.type]}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(parseISO(demande.dateDebut), 'd MMM', { locale: fr })} - {format(parseISO(demande.dateFin), 'd MMM yyyy', { locale: fr })}
                  </p>
                </div>

                {/* Nombre de jours */}
                <div className="text-center px-4">
                  <p className="text-lg font-semibold">{demande.nombreJours}</p>
                  <p className="text-xs text-muted-foreground">jour{demande.nombreJours > 1 ? 's' : ''}</p>
                </div>

                {/* Statut */}
                <div className="flex items-center gap-3">
                  <span className={cn(
                    'text-xs px-3 py-1.5 rounded-sm border font-medium',
                    COULEURS_STATUT[demande.statut]
                  )}>
                    {LABELS_STATUT[demande.statut]}
                  </span>

                  {/* Actions si en attente - RH uniquement */}
                  {demande.statut === 'en_attente' && (
                    <div className="flex gap-2">
                      <motion.button
                        onClick={() => handleOpenModal('approuver', demande)}
                        className="p-2 bg-success/10 text-success rounded-sm hover:bg-success/20 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title="Approuver la demande"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        onClick={() => handleOpenModal('refuser', demande)}
                        className="p-2 bg-destructive/10 text-destructive rounded-sm hover:bg-destructive/20 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title="Refuser la demande"
                      >
                        <XCircle className="w-4 h-4" />
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>

              {/* Motif et commentaire */}
              {(demande.motif || demande.commentaireRH) && (
                <div className="mt-4 pt-4 border-t border-border">
                  {demande.motif && (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Motif :</span> {demande.motif}
                    </p>
                  )}
                  {demande.commentaireRH && (
                    <p className="text-sm text-muted-foreground mt-1">
                      <span className="font-medium text-foreground">Commentaire RH :</span> {demande.commentaireRH}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Message si vide */}
        {demandesFiltrees.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">Aucune demande trouvee</p>
          </motion.div>
        )}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center"
        >
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (pageActuelle > 1) setPageActuelle(pageActuelle - 1)
                  }}
                  className={pageActuelle === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {generatePageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === 'ellipsis' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setPageActuelle(page)
                      }}
                      isActive={pageActuelle === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (pageActuelle < totalPages) setPageActuelle(pageActuelle + 1)
                  }}
                  className={pageActuelle === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </motion.div>
      )}

      {/* Modal formulaire */}
      <AnimatePresence>
        {formulaireOuvert && (
          <FormulaireConge onFermer={() => setFormulaireOuvert(false)} />
        )}
      </AnimatePresence>

      {/* Modal d'approbation/refus avec commentaire */}
      <Dialog open={modalAction !== null} onOpenChange={() => handleCloseModal()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {modalAction?.type === 'approuver' ? (
                <>
                  <CheckCircle className="w-5 h-5 text-success" />
                  Approuver la demande
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  Refuser la demande
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {modalAction?.demande && (
                <span>
                  Demande de <strong>{modalAction.demande.employe?.prenom} {modalAction.demande.employe?.nom}</strong>
                  {' '}pour {LABELS_TYPE_CONGE[modalAction.demande.type].toLowerCase()}
                  {' '}du {format(parseISO(modalAction.demande.dateDebut), 'd MMM', { locale: fr })} au {format(parseISO(modalAction.demande.dateFin), 'd MMM yyyy', { locale: fr })}
                  {' '}({modalAction.demande.nombreJours} jour{modalAction.demande.nombreJours > 1 ? 's' : ''})
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="commentaire" className="text-sm font-medium flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Commentaire RH {modalAction?.type === 'refuser' && <span className="text-destructive">*</span>}
              </label>
              <Textarea
                id="commentaire"
                placeholder={modalAction?.type === 'approuver' 
                  ? "Ajoutez un commentaire (optionnel)..." 
                  : "Indiquez la raison du refus..."}
                value={commentaireRH}
                onChange={(e) => setCommentaireRH(e.target.value)}
                rows={4}
              />
              {modalAction?.type === 'refuser' && !commentaireRH && (
                <p className="text-xs text-muted-foreground">
                  Un commentaire est requis pour expliquer le refus
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleCloseModal} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button
              onClick={handleConfirmAction}
              disabled={isSubmitting || (modalAction?.type === 'refuser' && !commentaireRH.trim())}
              className={cn(
                modalAction?.type === 'approuver'
                  ? 'bg-success text-success-foreground hover:bg-success/90'
                  : 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
              )}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Clock className="w-4 h-4" />
                  </motion.span>
                  Traitement...
                </span>
              ) : (
                modalAction?.type === 'approuver' ? 'Approuver' : 'Refuser'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
