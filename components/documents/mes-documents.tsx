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
  File,
  FileCheck,
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

type FiltreStatut = 'tous' | StatutDemande

export function MesDocuments() {
  const { utilisateurConnecte } = useAppStore()
  const [filtreStatut, setFiltreStatut] = useState<FiltreStatut>('tous')
  const [formulaireOuvert, setFormulaireOuvert] = useState(false)

  // Filtrer les demandes de l'employe connecte
  const mesDocuments = enrichirDemandesDocuments(
    demandesDocumentsMock.filter(d => d.employeId === utilisateurConnecte?.id)
  )

  const demandesFiltrees = useMemo(() => {
    return mesDocuments.filter(demande => {
      return filtreStatut === 'tous' || demande.statut === filtreStatut
    })
  }, [mesDocuments, filtreStatut])

  // Stats par statut
  const statsStatut = {
    en_attente: mesDocuments.filter(d => d.statut === 'en_attente').length,
    approuve: mesDocuments.filter(d => d.statut === 'approuve').length,
    refuse: mesDocuments.filter(d => d.statut === 'refuse').length,
  }

  const filtresStatut: { id: FiltreStatut; label: string; icone: React.ReactNode; count?: number }[] = [
    { id: 'tous', label: 'Toutes', icone: <FileText className="w-4 h-4" /> },
    { id: 'en_attente', label: 'En attente', icone: <Clock className="w-4 h-4" />, count: statsStatut.en_attente },
    { id: 'approuve', label: 'Disponibles', icone: <CheckCircle className="w-4 h-4" />, count: statsStatut.approuve },
    { id: 'refuse', label: 'Refusees', icone: <XCircle className="w-4 h-4" />, count: statsStatut.refuse },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Mes documents</h1>
          <p className="text-muted-foreground">
            Demandez et telechargez vos documents administratifs
          </p>
        </div>
        <Button onClick={() => setFormulaireOuvert(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Nouvelle demande
        </Button>
      </div>

      {/* Types de documents disponibles */}
      <motion.div
        className="stat-card rounded-xl p-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
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
              transition={{ delay: index * 0.05 }}
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
        <h3 className="font-medium">Historique de mes demandes</h3>
        
        <AnimatePresence mode="popLayout">
          {demandesFiltrees.map((demande, index) => (
            <motion.div
              key={demande.id}
              className="luxury-panel rounded-xl p-5 transition-colors hover:border-primary/40"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              layout
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Icone document */}
                <div className="p-3 bg-muted rounded-sm shrink-0">
                  {ICONES_DOCUMENT[demande.typeDocument]}
                </div>

                {/* Infos */}
                <div className="flex-1">
                  <p className="font-semibold">{LABELS_TYPE_DOCUMENT[demande.typeDocument]}</p>
                  <p className="text-sm text-muted-foreground">
                    Demande le {format(parseISO(demande.dateCreation), 'd MMMM yyyy', { locale: fr })}
                  </p>
                </div>

                {/* Statut */}
                <span className={cn(
                  'text-xs px-3 py-1.5 rounded-sm border font-medium',
                  COULEURS_STATUT[demande.statut]
                )}>
                  {LABELS_STATUT[demande.statut]}
                </span>

                {/* Telecharger si disponible */}
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
              </div>

              {/* Commentaire */}
              {demande.commentaire && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Note :</span> {demande.commentaire}
                  </p>
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
            <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">Aucune demande de document</p>
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
          <FormulaireDocument onFermer={() => setFormulaireOuvert(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}
