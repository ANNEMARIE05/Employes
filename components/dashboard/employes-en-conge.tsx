'use client'

import { motion } from 'framer-motion'
import { Calendar, MapPin, ChevronRight } from 'lucide-react'
import { employesMock, demandesCongesMock } from '@/lib/donnees-mock'
import { LABELS_TYPE_CONGE } from '@/types'
import { format, differenceInDays, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

export function EmployesEnConge() {
  // Trouver les employés actuellement en congé
  const aujourdhui = new Date()
  
  const congesEnCours = demandesCongesMock
    .filter(c => {
      if (c.statut !== 'approuve') return false
      const debut = parseISO(c.dateDebut)
      const fin = parseISO(c.dateFin)
      return debut <= aujourdhui && fin >= aujourdhui
    })
    .map(conge => {
      const employe = employesMock.find(e => e.id === conge.employeId)
      const joursRestants = differenceInDays(parseISO(conge.dateFin), aujourdhui)
      return {
        ...conge,
        employe,
        joursRestants,
      }
    })

  // Prochains congés (dans les 7 prochains jours)
  const prochainsConges = demandesCongesMock
    .filter(c => {
      if (c.statut !== 'approuve') return false
      const debut = parseISO(c.dateDebut)
      const dansUneSemaine = new Date()
      dansUneSemaine.setDate(dansUneSemaine.getDate() + 7)
      return debut > aujourdhui && debut <= dansUneSemaine
    })
    .map(conge => {
      const employe = employesMock.find(e => e.id === conge.employeId)
      const joursAvant = differenceInDays(parseISO(conge.dateDebut), aujourdhui)
      return {
        ...conge,
        employe,
        joursAvant,
      }
    })

  return (
    <motion.div
      className="p-6 bg-card border border-border rounded-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold">Absences</h3>
          <p className="text-sm text-muted-foreground">Cette semaine</p>
        </div>
        <button className="text-sm text-primary hover:underline flex items-center gap-1">
          Calendrier <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* En congé actuellement */}
      {congesEnCours.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Actuellement absents
          </p>
          <div className="space-y-2">
            {congesEnCours.map((conge, index) => (
              <motion.div
                key={conge.id}
                className="flex items-center gap-3 p-3 bg-primary/5 rounded-sm border border-primary/10"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <img
                  src={conge.employe?.avatar}
                  alt={`${conge.employe?.prenom} ${conge.employe?.nom}`}
                  className="w-10 h-10 rounded-sm object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {conge.employe?.prenom} {conge.employe?.nom}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{LABELS_TYPE_CONGE[conge.type]}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-primary">
                    {conge.joursRestants + 1}j
                  </p>
                  <p className="text-xs text-muted-foreground">restants</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Prochains congés */}
      {prochainsConges.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            À venir
          </p>
          <div className="space-y-2">
            {prochainsConges.map((conge, index) => (
              <motion.div
                key={conge.id}
                className="flex items-center gap-3 p-3 rounded-sm hover:bg-muted/50 transition-colors"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <img
                  src={conge.employe?.avatar}
                  alt={`${conge.employe?.prenom} ${conge.employe?.nom}`}
                  className="w-10 h-10 rounded-sm object-cover grayscale-[30%]"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {conge.employe?.prenom} {conge.employe?.nom}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>
                      {format(parseISO(conge.dateDebut), 'd MMM', { locale: fr })} - {format(parseISO(conge.dateFin), 'd MMM', { locale: fr })}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Dans {conge.joursAvant}j
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Si aucune absence */}
      {congesEnCours.length === 0 && prochainsConges.length === 0 && (
        <div className="text-center py-8">
          <MapPin className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            Aucune absence cette semaine
          </p>
        </div>
      )}
    </motion.div>
  )
}
