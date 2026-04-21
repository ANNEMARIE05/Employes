'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
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
} from '@/types'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import { FormulaireConge } from './formulaire-conge'
import { Button } from '@/components/ui/button'

type FiltreStatut = 'tous' | StatutDemande

export function MesConges() {
  const { utilisateurConnecte } = useAppStore()
  const [filtreStatut, setFiltreStatut] = useState<FiltreStatut>('tous')
  const [formulaireOuvert, setFormulaireOuvert] = useState(false)

  // Filtrer les demandes de l'employe connecte
  const mesConges = enrichirDemandesConges(
    demandesCongesMock.filter(d => d.employeId === utilisateurConnecte?.id)
  )

  const demandesFiltrees = useMemo(() => {
    return mesConges.filter(demande => {
      return filtreStatut === 'tous' || demande.statut === filtreStatut
    })
  }, [mesConges, filtreStatut])

  // Stats par statut
  const statsStatut = {
    en_attente: mesConges.filter(d => d.statut === 'en_attente').length,
    approuve: mesConges.filter(d => d.statut === 'approuve').length,
    refuse: mesConges.filter(d => d.statut === 'refuse').length,
  }

  const filtresStatut: { id: FiltreStatut; label: string; icone: React.ReactNode; count?: number }[] = [
    { id: 'tous', label: 'Toutes', icone: <Calendar className="w-4 h-4" /> },
    { id: 'en_attente', label: 'En attente', icone: <Clock className="w-4 h-4" />, count: statsStatut.en_attente },
    { id: 'approuve', label: 'Approuvées', icone: <CheckCircle className="w-4 h-4" />, count: statsStatut.approuve },
    { id: 'refuse', label: 'Refusées', icone: <XCircle className="w-4 h-4" />, count: statsStatut.refuse },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Mes congés</h1>
          <p className="text-muted-foreground">
            Gérez vos demandes de congés et consultez votre historique
          </p>
        </div>
        <Button onClick={() => setFormulaireOuvert(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Nouvelle demande
        </Button>
      </div>

      {/* Jours restants */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          className="p-5 bg-card border border-border"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm text-muted-foreground mb-1">Congés payés restants</p>
          <p className="text-3xl font-bold">{utilisateurConnecte?.soldeConges || 0} <span className="text-lg font-normal text-muted-foreground">jours</span></p>
        </motion.div>
        <motion.div 
          className="p-5 bg-card border border-border"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-sm text-muted-foreground mb-1">RTT restants</p>
          <p className="text-3xl font-bold">{utilisateurConnecte?.soldeRTT || 0} <span className="text-lg font-normal text-muted-foreground">jours</span></p>
        </motion.div>
      </div>

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
                {/* Type et dates */}
                <div className="flex-1">
                  <p className="font-semibold">{LABELS_TYPE_CONGE[demande.type]}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(parseISO(demande.dateDebut), 'd MMMM', { locale: fr })} - {format(parseISO(demande.dateFin), 'd MMMM yyyy', { locale: fr })}
                  </p>
                </div>

                {/* Nombre de jours */}
                <div className="text-center px-4">
                  <p className="text-lg font-semibold">{demande.nombreJours}</p>
                  <p className="text-xs text-muted-foreground">jour{demande.nombreJours > 1 ? 's' : ''}</p>
                </div>

                {/* Statut */}
                <span className={cn(
                  'text-xs px-3 py-1.5 rounded-sm border font-medium',
                  COULEURS_STATUT[demande.statut]
                )}>
                  {LABELS_STATUT[demande.statut]}
                </span>
              </div>

              {/* Motif et commentaire RH */}
              {(demande.motif || demande.commentaireRH) && (
                <div className="mt-4 pt-4 border-t border-border space-y-2">
                  {demande.motif && (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Motif :</span> {demande.motif}
                    </p>
                  )}
                  {demande.commentaireRH && (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Réponse RH :</span> {demande.commentaireRH}
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
            <p className="text-muted-foreground">Aucune demande de congé</p>
            <Button 
              onClick={() => setFormulaireOuvert(true)} 
              variant="outline" 
              className="mt-4 gap-2"
            >
              <Plus className="w-4 h-4" />
              Faire une demande
            </Button>
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
