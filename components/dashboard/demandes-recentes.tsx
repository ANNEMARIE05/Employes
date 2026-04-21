'use client'

import { motion } from 'framer-motion'
import { Calendar, FileText, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
  demandesCongesMock, 
  demandesDocumentsMock, 
  enrichirDemandesConges,
  enrichirDemandesDocuments,
} from '@/lib/donnees-mock'
import { 
  LABELS_TYPE_CONGE, 
  LABELS_TYPE_DOCUMENT,
  LABELS_STATUT,
  COULEURS_STATUT,
  type StatutDemande,
} from '@/types'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useAppStore } from '@/store/useAppStore'

type TypeDemande = 'conge' | 'document'

interface DemandeUnifiee {
  id: string
  type: TypeDemande
  employe: {
    prenom: string
    nom: string
    avatar: string
  }
  label: string
  statut: StatutDemande
  dateCreation: string
}

export function DemandesRecentes() {
  const { definirOngletActif } = useAppStore()

  // Fusionner et trier les demandes
  const congesEnrichis = enrichirDemandesConges(demandesCongesMock)
  const documentsEnrichis = enrichirDemandesDocuments(demandesDocumentsMock)

  const demandesUnifiees: DemandeUnifiee[] = [
    ...congesEnrichis.map(c => ({
      id: c.id,
      type: 'conge' as TypeDemande,
      employe: {
        prenom: c.employe?.prenom || '',
        nom: c.employe?.nom || '',
        avatar: c.employe?.avatar || '',
      },
      label: LABELS_TYPE_CONGE[c.type],
      statut: c.statut,
      dateCreation: c.dateCreation,
    })),
    ...documentsEnrichis.map(d => ({
      id: d.id,
      type: 'document' as TypeDemande,
      employe: {
        prenom: d.employe?.prenom || '',
        nom: d.employe?.nom || '',
        avatar: d.employe?.avatar || '',
      },
      label: LABELS_TYPE_DOCUMENT[d.typeDocument],
      statut: d.statut,
      dateCreation: d.dateCreation,
    })),
  ]
    .sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime())
    .slice(0, 5)

  return (
    <motion.div
      className="luxury-panel flex h-full min-h-[420px] flex-col rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold">Demandes récentes</h3>
          <p className="text-sm text-muted-foreground">Toutes les demandes</p>
        </div>
        <button
          onClick={() => definirOngletActif('historique')}
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          Voir tout <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3 flex-1">
        {demandesUnifiees.map((demande, index) => (
          <motion.div
            key={demande.id}
            className="flex items-center gap-3 p-3 rounded-sm hover:bg-muted/50 transition-colors cursor-pointer group"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ x: 4 }}
          >
            {/* Avatar */}
            <img
              src={demande.employe.avatar}
              alt={`${demande.employe.prenom} ${demande.employe.nom}`}
              className="w-10 h-10 rounded-sm object-cover"
            />

            {/* Infos */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                {demande.type === 'conge' ? (
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                )}
                <span className="text-sm font-medium truncate">
                  {demande.employe.prenom} {demande.employe.nom}
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {demande.label}
              </p>
            </div>

            {/* Statut et date */}
            <div className="flex flex-col items-end gap-1">
              <span className={cn(
                'text-xs px-2 py-0.5 rounded-sm border',
                COULEURS_STATUT[demande.statut]
              )}>
                {LABELS_STATUT[demande.statut]}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(demande.dateCreation), { 
                  addSuffix: true,
                  locale: fr,
                })}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
