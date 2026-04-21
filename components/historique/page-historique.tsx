'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { History, Calendar, FileText, Bell, Search } from 'lucide-react'
import { demandesCongesMock, demandesDocumentsMock, enrichirDemandesConges, enrichirDemandesDocuments } from '@/lib/donnees-mock'
import { LABELS_TYPE_CONGE, LABELS_TYPE_DOCUMENT, LABELS_STATUT } from '@/types'
import { useAppStore } from '@/store/useAppStore'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type FiltreHistorique = 'tous' | 'conges' | 'documents' | 'notifications'
const ELEMENTS_PAR_PAGE = 8

export function PageHistorique() {
  const { utilisateurConnecte, notifications } = useAppStore()
  const [filtre, setFiltre] = useState<FiltreHistorique>('tous')
  const [recherche, setRecherche] = useState('')
  const [pageCourante, setPageCourante] = useState(1)

  const historique = useMemo(() => {
    const conges = enrichirDemandesConges(demandesCongesMock)
      .filter((d) => !utilisateurConnecte || utilisateurConnecte.role === 'rh' || d.employeId === utilisateurConnecte.id)
      .map((d) => ({
        id: `conge-${d.id}`,
        type: 'conges' as const,
        date: d.dateTraitement || d.dateCreation,
        titre: `Demande de conge - ${LABELS_TYPE_CONGE[d.type]}`,
        description: `${d.employe?.prenom} ${d.employe?.nom} - ${LABELS_STATUT[d.statut]}`,
        statut: d.statut,
      }))

    const documents = enrichirDemandesDocuments(demandesDocumentsMock)
      .filter((d) => !utilisateurConnecte || utilisateurConnecte.role === 'rh' || d.employeId === utilisateurConnecte.id)
      .map((d) => ({
        id: `document-${d.id}`,
        type: 'documents' as const,
        date: d.dateTraitement || d.dateCreation,
        titre: `Demande de document - ${LABELS_TYPE_DOCUMENT[d.typeDocument]}`,
        description: `${d.employe?.prenom} ${d.employe?.nom} - ${LABELS_STATUT[d.statut]}`,
        statut: d.statut,
      }))

    const notificationsHistorique = notifications
      .filter((n) => !n.destinataireId || n.destinataireId === utilisateurConnecte?.id)
      .map((n) => ({
      id: `notif-${n.id}`,
      type: 'notifications' as const,
      date: n.dateCreation,
      titre: n.titre,
      description: n.message,
      statut: n.lu ? 'approuve' as const : 'en_attente' as const,
    }))

    return [...conges, ...documents, ...notificationsHistorique].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }, [notifications, utilisateurConnecte])

  const historiqueFiltre = useMemo(() => {
    const terme = recherche.trim().toLowerCase()
    return historique.filter((item) => {
      const correspondFiltre = filtre === 'tous' || item.type === filtre
      if (!correspondFiltre) return false
      if (!terme) return true
      const contenuRecherche = `${item.titre} ${item.description}`.toLowerCase()
      return contenuRecherche.includes(terme)
    })
  }, [filtre, historique, recherche])

  useEffect(() => {
    setPageCourante(1)
  }, [filtre, recherche])

  const totalPages = Math.max(1, Math.ceil(historiqueFiltre.length / ELEMENTS_PAR_PAGE))
  const pageActuelle = Math.min(pageCourante, totalPages)
  const debut = (pageActuelle - 1) * ELEMENTS_PAR_PAGE
  const historiquePage = historiqueFiltre.slice(debut, debut + ELEMENTS_PAR_PAGE)

  const icones = {
    conges: Calendar,
    documents: FileText,
    notifications: Bell,
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10 rounded-sm">
          <History className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-semibold">Historique</h2>
          <p className="text-sm text-muted-foreground">Suivi des actions conges, documents et notifications</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'tous', label: 'Tous' },
            { id: 'conges', label: 'Conges' },
            { id: 'documents', label: 'Documents' },
            { id: 'notifications', label: 'Notifications' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFiltre(f.id as FiltreHistorique)}
              className={cn(
                'px-4 py-2 rounded-sm border text-sm transition-all',
                filtre === f.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border hover:border-primary/50'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:max-w-sm">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher dans l'historique..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-3">
        {historiquePage.map((item, index) => {
          const Icone = icones[item.type]
          return (
            <motion.div
              key={item.id}
              className="p-4 bg-card border border-border rounded-sm"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-muted rounded-sm">
                  <Icone className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{item.titre}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(parseISO(item.date), 'd MMM yyyy a HH:mm', { locale: fr })}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}

        {historiqueFiltre.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">Aucun element dans l&apos;historique</div>
        )}
      </div>

      {historiqueFiltre.length > 0 && (
        <div className="flex items-center justify-between gap-3 pt-2">
          <p className="text-sm text-muted-foreground">
            {debut + 1}-{Math.min(debut + ELEMENTS_PAR_PAGE, historiqueFiltre.length)} sur {historiqueFiltre.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageCourante((p) => Math.max(1, p - 1))}
              disabled={pageActuelle === 1}
            >
              Precedent
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {pageActuelle} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageCourante((p) => Math.min(totalPages, p + 1))}
              disabled={pageActuelle === totalPages}
            >
              Suivant
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
