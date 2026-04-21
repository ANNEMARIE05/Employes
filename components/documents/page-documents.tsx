'use client'

import { useState } from 'react'
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
} from 'lucide-react'
import { cn } from '@/lib/utils'
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
} from '@/types'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { FormulaireDocument } from './formulaire-document'

const ICONES_DOCUMENT: Record<TypeDocument, React.ReactNode> = {
  attestation_emploi: <FileCheck className="w-5 h-5" />,
  fiche_paie: <File className="w-5 h-5" />,
  certificat_travail: <FileText className="w-5 h-5" />,
  attestation_salaire: <FileText className="w-5 h-5" />,
  contrat_travail: <FileText className="w-5 h-5" />,
  attestation_pole_emploi: <FileCheck className="w-5 h-5" />,
}

export function PageDocuments() {
  const [recherche, setRecherche] = useState('')
  const [formulaireOuvert, setFormulaireOuvert] = useState(false)

  const demandesEnrichies = enrichirDemandesDocuments(demandesDocumentsMock)

  // Filtrer
  const demandesFiltrees = demandesEnrichies.filter(demande => {
    return recherche === '' || 
      `${demande.employe?.prenom} ${demande.employe?.nom}`.toLowerCase().includes(recherche.toLowerCase()) ||
      LABELS_TYPE_DOCUMENT[demande.typeDocument].toLowerCase().includes(recherche.toLowerCase())
  })

  // Stats
  const stats = {
    total: demandesEnrichies.length,
    enAttente: demandesEnrichies.filter(d => d.statut === 'en_attente').length,
    traites: demandesEnrichies.filter(d => d.statut === 'approuve').length,
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
            <p className="text-sm text-muted-foreground">Traités</p>
          </div>
        </div>
      </motion.div>

      {/* Recherche */}
      <motion.div
        className="flex gap-4 items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher une demande..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
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

      {/* Liste des demandes */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="font-medium">Historique des demandes</h3>
        
        <AnimatePresence mode="popLayout">
          {demandesFiltrees.map((demande, index) => (
            <motion.div
              key={demande.id}
              className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 bg-card border border-border rounded-sm hover:border-primary/30 transition-colors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              layout
            >
              {/* Icône document */}
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
                  Demandé par {demande.employe?.prenom} {demande.employe?.nom} • {format(parseISO(demande.dateCreation), 'd MMMM yyyy', { locale: fr })}
                </p>
                {demande.commentaire && (
                  <p className="text-sm text-muted-foreground mt-1">
                    "{demande.commentaire}"
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
                    Télécharger
                  </motion.button>
                )}
                {demande.statut === 'en_attente' && (
                  <div className="flex gap-2">
                    <motion.button
                      className="p-2 bg-success/10 text-success rounded-sm hover:bg-success/20 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      className="p-2 bg-destructive/10 text-destructive rounded-sm hover:bg-destructive/20 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
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
            <p className="text-muted-foreground">Aucune demande trouvée</p>
          </motion.div>
        )}
      </motion.div>

      {/* Modal formulaire */}
      <AnimatePresence>
        {formulaireOuvert && (
          <FormulaireDocument onFermer={() => setFormulaireOuvert(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}
