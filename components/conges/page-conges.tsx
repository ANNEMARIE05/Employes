'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Filter,
  Search,
} from 'lucide-react'
import { cn } from '@/lib/utils'
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
} from '@/types'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import { FormulaireConge } from './formulaire-conge'
import { Button } from '@/components/ui/button'

type FiltreStatut = 'tous' | StatutDemande

export function PageConges() {
  const [filtreStatut, setFiltreStatut] = useState<FiltreStatut>('tous')
  const [recherche, setRecherche] = useState('')
  const [formulaireOuvert, setFormulaireOuvert] = useState(false)

  const demandesEnrichies = enrichirDemandesConges(demandesCongesMock)

  // Filtrer les demandes
  const demandesFiltrees = demandesEnrichies.filter(demande => {
    const correspondStatut = filtreStatut === 'tous' || demande.statut === filtreStatut
    const correspondRecherche = recherche === '' || 
      `${demande.employe?.prenom} ${demande.employe?.nom}`.toLowerCase().includes(recherche.toLowerCase())
    return correspondStatut && correspondRecherche
  })

  // Stats par statut
  const statsStatut = {
    en_attente: demandesEnrichies.filter(d => d.statut === 'en_attente').length,
    approuve: demandesEnrichies.filter(d => d.statut === 'approuve').length,
    refuse: demandesEnrichies.filter(d => d.statut === 'refuse').length,
  }

  const filtresStatut: { id: FiltreStatut; label: string; icone: React.ReactNode; count?: number }[] = [
    { id: 'tous', label: 'Toutes', icone: <Calendar className="w-4 h-4" /> },
    { id: 'en_attente', label: 'En attente', icone: <Clock className="w-4 h-4" />, count: statsStatut.en_attente },
    { id: 'approuve', label: 'Approuvées', icone: <CheckCircle className="w-4 h-4" />, count: statsStatut.approuve },
    { id: 'refuse', label: 'Refusées', icone: <XCircle className="w-4 h-4" />, count: statsStatut.refuse },
  ]

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
            onClick={() => setFiltreStatut(filtre.id)}
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

      {/* Barre de recherche */}
      <motion.div
        className="relative max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Rechercher par employé..."
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </motion.div>

      {/* Liste des demandes */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <AnimatePresence mode="popLayout">
          {demandesFiltrees.map((demande, index) => (
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
                {/* Employé */}
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

                  {/* Actions si en attente */}
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
            <p className="text-muted-foreground">Aucune demande trouvée</p>
          </motion.div>
        )}
      </motion.div>

      {/* Modal formulaire */}
      <AnimatePresence>
        {formulaireOuvert && (
          <FormulaireConge onFermer={() => setFormulaireOuvert(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}
