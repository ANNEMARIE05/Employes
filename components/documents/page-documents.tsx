'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, 
  Download, 
  Clock, 
  CheckCircle, 
  XCircle,
  Plus,
  Search,
  File,
  FileCheck,
  Filter,
  X,
  MessageSquare,
  AlertTriangle,
  Upload,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/useAppStore'
import { 
  demandesDocumentsMock, 
  enrichirDemandesDocuments,
} from '@/lib/donnees-mock'
import { 
  LABELS_TYPE_DOCUMENT, 
  LABELS_STATUT,
  COULEURS_STATUT,
  type StatutDemande,
  type TypeDocument,
  type DemandeDocument,
} from '@/types'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { FormulaireDocument } from './formulaire-document'
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

const ICONES_DOCUMENT: Record<TypeDocument, React.ReactNode> = {
  attestation_emploi: <FileCheck className="w-5 h-5" />,
  fiche_paie: <File className="w-5 h-5" />,
  certificat_travail: <FileText className="w-5 h-5" />,
  attestation_salaire: <FileText className="w-5 h-5" />,
  contrat_travail: <FileText className="w-5 h-5" />,
  attestation_pole_emploi: <FileCheck className="w-5 h-5" />,
}

const ELEMENTS_PAR_PAGE = 5

export function PageDocuments() {
  const { modifierStatutDocument, ajouterNotification } = useAppStore()
  const [recherche, setRecherche] = useState('')
  const [filtreStatut, setFiltreStatut] = useState<string>('')
  const [filtreType, setFiltreType] = useState<string>('')
  const [formulaireOuvert, setFormulaireOuvert] = useState(false)
  const [pageActuelle, setPageActuelle] = useState(1)
  
  // Modal de validation/refus
  const [modalAction, setModalAction] = useState<{
    type: 'approuver' | 'refuser'
    demande: DemandeDocument
  } | null>(null)
  const [commentaireRH, setCommentaireRH] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const demandesEnrichies = enrichirDemandesDocuments(demandesDocumentsMock)

  // Filtrer
  const demandesFiltrees = useMemo(() => {
    return demandesEnrichies.filter(demande => {
      const correspondRecherche = recherche === '' || 
        `${demande.employe?.prenom} ${demande.employe?.nom}`.toLowerCase().includes(recherche.toLowerCase()) ||
        LABELS_TYPE_DOCUMENT[demande.typeDocument].toLowerCase().includes(recherche.toLowerCase())
      const correspondStatut = !filtreStatut || demande.statut === filtreStatut
      const correspondType = !filtreType || demande.typeDocument === filtreType
      return correspondRecherche && correspondStatut && correspondType
    })
  }, [demandesEnrichies, recherche, filtreStatut, filtreType])

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

  // Stats
  const stats = {
    total: demandesEnrichies.length,
    enAttente: demandesEnrichies.filter(d => d.statut === 'en_attente').length,
    traites: demandesEnrichies.filter(d => d.statut === 'approuve').length,
  }

  const reinitialiserFiltres = () => {
    setRecherche('')
    setFiltreStatut('')
    setFiltreType('')
    setPageActuelle(1)
  }

  const filtresActifs = recherche || filtreStatut || filtreType

  // Handlers pour approuver/refuser
  const handleOpenModal = (type: 'approuver' | 'refuser', demande: DemandeDocument) => {
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
    modifierStatutDocument(modalAction.demande.id, statut)
    
    // Ajouter une notification
    ajouterNotification({
      titre: modalAction.type === 'approuver' ? 'Document pret' : 'Demande refusee',
      message: `La demande de ${LABELS_TYPE_DOCUMENT[modalAction.demande.typeDocument]} de ${modalAction.demande.employe?.prenom} ${modalAction.demande.employe?.nom} a ete ${modalAction.type === 'approuver' ? 'traitee' : 'refusee'}.`,
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
      {/* Stats */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="p-5 bg-card border border-border rounded-sm flex items-center gap-4">
          <div className="p-3 bg-muted rounded-sm">
            <FileText className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-2xl font-semibold">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total demandes</p>
          </div>
        </div>
        
        <div className="p-5 bg-card border border-border rounded-sm flex items-center gap-4">
          <div className="p-3 bg-warning/10 rounded-sm">
            <Clock className="w-5 h-5 text-warning" />
          </div>
          <div>
            <p className="text-2xl font-semibold">{stats.enAttente}</p>
            <p className="text-sm text-muted-foreground">En attente</p>
          </div>
        </div>
        
        <div className="p-5 bg-card border border-border rounded-sm flex items-center gap-4">
          <div className="p-3 bg-success/10 rounded-sm">
            <CheckCircle className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="text-2xl font-semibold">{stats.traites}</p>
            <p className="text-sm text-muted-foreground">Traites</p>
          </div>
        </div>
      </motion.div>

      {/* Recherche et filtres */}
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
            placeholder="Rechercher une demande..."
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
            {Object.entries(LABELS_TYPE_DOCUMENT).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        <select
          value={filtreStatut}
          onChange={(e) => handleFiltreChange(setFiltreStatut, e.target.value)}
          className="px-4 py-2.5 bg-card border border-border rounded-sm text-sm appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">Tous les statuts</option>
          {Object.entries(LABELS_STATUT).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>

        {/* Bouton reinitialiser */}
        {filtresActifs && (
          <Button
            variant="ghost"
            size="sm"
            onClick={reinitialiserFiltres}
            className="gap-2 rounded-sm text-muted-foreground"
          >
            <X className="w-4 h-4" />
            Effacer
          </Button>
        )}
      </motion.div>

      {/* Types de documents disponibles */}
      <motion.div
        className="p-5 bg-card border border-border rounded-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <h3 className="font-medium mb-4">Documents disponibles</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(LABELS_TYPE_DOCUMENT).map(([type, label], index) => (
            <motion.button
              key={type}
              onClick={() => setFormulaireOuvert(true)}
              className="flex flex-col items-center gap-2 p-4 rounded-sm border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-center group"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              whileHover={{ y: -2 }}
            >
              <div className="p-2 bg-muted rounded-sm group-hover:bg-primary/10 transition-colors">
                {ICONES_DOCUMENT[type as TypeDocument]}
              </div>
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                {label}
              </span>
            </motion.button>
          ))}
        </div>
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
        transition={{ delay: 0.3 }}
      >
        <h3 className="font-medium">Historique des demandes</h3>
        
        <AnimatePresence mode="popLayout">
          {demandesPaginees.map((demande, index) => (
            <motion.div
              key={demande.id}
              className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 bg-card border border-border rounded-sm hover:border-primary/30 transition-colors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              layout
            >
              {/* Avatar employe */}
              <div className="flex items-center gap-3 min-w-[180px]">
                <img
                  src={demande.employe?.avatar}
                  alt={`${demande.employe?.prenom} ${demande.employe?.nom}`}
                  className="w-10 h-10 rounded-sm object-cover shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">
                    {demande.employe?.prenom} {demande.employe?.nom}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {demande.employe?.poste}
                  </p>
                </div>
              </div>

              {/* Icone document */}
              <div className="p-3 bg-muted rounded-sm shrink-0">
                {ICONES_DOCUMENT[demande.typeDocument]}
              </div>

              {/* Infos */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium">{LABELS_TYPE_DOCUMENT[demande.typeDocument]}</p>
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded-sm border',
                    COULEURS_STATUT[demande.statut]
                  )}>
                    {LABELS_STATUT[demande.statut]}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Demande le {format(parseISO(demande.dateCreation), 'd MMMM yyyy', { locale: fr })}
                </p>
                {demande.commentaire && (
                  <p className="text-sm text-muted-foreground mt-1">
                    &quot;{demande.commentaire}&quot;
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {demande.statut === 'approuve' && demande.fichierUrl && (
                  <motion.button
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-sm text-sm font-medium hover:bg-primary/90 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Download className="w-4 h-4" />
                    Telecharger
                  </motion.button>
                )}
                {demande.statut === 'en_attente' && (
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => handleOpenModal('approuver', demande)}
                      className="p-2 bg-success/10 text-success rounded-sm hover:bg-success/20 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Approuver et fournir le document"
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
            </motion.div>
          ))}
        </AnimatePresence>

        {demandesFiltrees.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
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
          <FormulaireDocument onFermer={() => setFormulaireOuvert(false)} />
        )}
      </AnimatePresence>

      {/* Modal d'approbation/refus avec commentaire */}
      <Dialog open={modalAction !== null} onOpenChange={() => handleCloseModal()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {modalAction?.type === 'approuver' ? (
                <>
                  <Upload className="w-5 h-5 text-success" />
                  Traiter la demande
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
                  Demande de <strong>{LABELS_TYPE_DOCUMENT[modalAction.demande.typeDocument]}</strong>
                  {' '}par <strong>{modalAction.demande.employe?.prenom} {modalAction.demande.employe?.nom}</strong>
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {modalAction?.type === 'approuver' && (
              <div className="p-4 bg-success/10 border border-success/20 rounded-sm">
                <p className="text-sm text-success flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Le document sera marque comme disponible au telechargement
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="commentaire-doc" className="text-sm font-medium flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Commentaire RH {modalAction?.type === 'refuser' && <span className="text-destructive">*</span>}
              </label>
              <Textarea
                id="commentaire-doc"
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
                modalAction?.type === 'approuver' ? 'Confirmer' : 'Refuser'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
