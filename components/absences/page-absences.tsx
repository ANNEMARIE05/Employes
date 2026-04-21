'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Users, Clock3, ChevronLeft, ChevronRight } from 'lucide-react'
import { demandesCongesMock, employesMock } from '@/lib/donnees-mock'
import { LABELS_TYPE_CONGE } from '@/types'
import { differenceInDays, eachDayOfInterval, endOfMonth, format, isSameDay, parseISO, startOfMonth } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useAppStore } from '@/store/useAppStore'

export function PageAbsences() {
  const { utilisateurConnecte } = useAppStore()
  const [moisAffiche, setMoisAffiche] = useState(startOfMonth(new Date()))
  const aujourdHui = new Date()
  const estEmploye = utilisateurConnecte?.role === 'employe'

  const absencesApprouvees = useMemo(() => {
    return demandesCongesMock
      .filter((demande) => demande.statut === 'approuve')
      .filter((demande) => {
        if (!estEmploye) return true
        return demande.employeId === utilisateurConnecte?.id
      })
      .map((demande) => ({
        ...demande,
        employe: employesMock.find((employe) => employe.id === demande.employeId),
      }))
  }, [estEmploye, utilisateurConnecte?.id])

  const absencesEnCours = useMemo(() => {
    return absencesApprouvees
      .filter((demande) => {
        const debut = parseISO(demande.dateDebut)
        const fin = parseISO(demande.dateFin)
        return debut <= aujourdHui && fin >= aujourdHui
      })
      .map((demande) => ({
        ...demande,
        joursRestants: differenceInDays(parseISO(demande.dateFin), aujourdHui) + 1,
      }))
  }, [absencesApprouvees, aujourdHui])

  const absencesAVenir = useMemo(() => {
    const dateLimite = new Date()
    dateLimite.setDate(dateLimite.getDate() + 30)

    return absencesApprouvees
      .filter((demande) => {
        const debut = parseISO(demande.dateDebut)
        return debut > aujourdHui && debut <= dateLimite
      })
      .map((demande) => ({
        ...demande,
        joursAvantDebut: differenceInDays(parseISO(demande.dateDebut), aujourdHui),
      }))
      .sort((a, b) => a.dateDebut.localeCompare(b.dateDebut))
  }, [absencesApprouvees, aujourdHui])

  const joursDuMois = useMemo(
    () => eachDayOfInterval({ start: startOfMonth(moisAffiche), end: endOfMonth(moisAffiche) }),
    [moisAffiche]
  )

  const absencesDuJour = (jour: Date) =>
    absencesApprouvees.filter((absence) => {
      const debut = parseISO(absence.dateDebut)
      const fin = parseISO(absence.dateFin)
      return jour >= debut && jour <= fin
    })

  const absencesAujourdhui = useMemo(() => absencesDuJour(aujourdHui), [absencesApprouvees])

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-base sm:text-lg font-semibold">Absences</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {estEmploye
            ? 'Vue de vos absences en cours, à venir et dans le calendrier'
            : 'Vue calendrier des absences en cours et à venir'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="stat-card flex items-center gap-3 rounded-xl p-4">
          <div className="p-2 bg-primary/10 rounded-sm">
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-lg font-semibold">{absencesEnCours.length}</p>
            <p className="text-xs text-muted-foreground">Absent(s) aujourd&apos;hui</p>
          </div>
        </div>
        <div className="stat-card flex items-center gap-3 rounded-xl p-4">
          <div className="p-2 bg-warning/10 rounded-sm">
            <Calendar className="w-4 h-4 text-warning" />
          </div>
          <div>
            <p className="text-lg font-semibold">{absencesAVenir.length}</p>
            <p className="text-xs text-muted-foreground">Absences prévues (30j)</p>
          </div>
        </div>
        <div className="stat-card flex items-center gap-3 rounded-xl p-4">
          <div className="p-2 bg-muted rounded-sm">
            <Clock3 className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-lg font-semibold">{absencesApprouvees.length}</p>
            <p className="text-xs text-muted-foreground">{estEmploye ? 'Mes absences approuvées' : 'Absences approuvées'}</p>
          </div>
        </div>
      </div>

      <motion.div
        className="luxury-panel rounded-xl p-4 sm:p-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Calendrier des absences</h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMoisAffiche((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
              className="p-1.5 rounded-sm border border-border hover:bg-muted"
              aria-label="Mois précédent"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium min-w-[140px] text-center">
              {format(moisAffiche, 'MMMM yyyy', { locale: fr })}
            </span>
            <button
              type="button"
              onClick={() => setMoisAffiche((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
              className="p-1.5 rounded-sm border border-border hover:bg-muted"
              aria-label="Mois suivant"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-xs text-muted-foreground mb-2">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((jour) => (
            <div key={jour}>{jour}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: (joursDuMois[0].getDay() + 6) % 7 }).map((_, index) => (
            <div key={`vide-${index}`} className="h-16 sm:h-20" />
          ))}

          {joursDuMois.map((jour) => {
            const absences = absencesDuJour(jour)
            const estAujourdhui = isSameDay(jour, aujourdHui)

            return (
              <div
                key={jour.toISOString()}
                className={`h-16 sm:h-20 p-2 border rounded-sm text-xs ${
                  estAujourdhui ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                <div className="font-medium">{format(jour, 'd')}</div>
                {absences.length > 0 && (
                  <div className="mt-1 space-y-1">
                    <div className="px-1.5 py-0.5 rounded-sm bg-warning/15 text-[10px] truncate">
                      {absences.length} absence{absences.length > 1 ? 's' : ''}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Aujourd&apos;hui ({format(aujourdHui, 'd MMMM', { locale: fr })})</p>
          {absencesAujourdhui.length === 0 ? (
            <p className="text-xs text-muted-foreground">Aucune absence sur la date du jour</p>
          ) : (
            <div className="space-y-2">
              {absencesAujourdhui.map((absence) => (
                <div key={`today-${absence.id}`} className="text-xs p-2 rounded-sm bg-muted/40">
                  {absence.employe?.prenom} {absence.employe?.nom} - {LABELS_TYPE_CONGE[absence.type]}
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <motion.div
          className="luxury-panel rounded-xl p-4 sm:p-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="font-semibold mb-4">Absences en cours</h3>
          {absencesEnCours.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune absence en cours</p>
          ) : (
            <div className="space-y-3">
              {absencesEnCours.map((absence) => (
                <div key={absence.id} className="flex items-center gap-3 p-3 bg-primary/5 rounded-sm">
                  <img
                    src={absence.employe?.avatar}
                    alt={`${absence.employe?.prenom} ${absence.employe?.nom}`}
                    className="w-10 h-10 rounded-sm object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {absence.employe?.prenom} {absence.employe?.nom}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {LABELS_TYPE_CONGE[absence.type]} - reste {absence.joursRestants}j
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          className="luxury-panel rounded-xl p-4 sm:p-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="font-semibold mb-4">Absences à venir</h3>
          {absencesAVenir.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune absence planifiée</p>
          ) : (
            <div className="space-y-3">
              {absencesAVenir.map((absence) => (
                <div key={absence.id} className="flex items-center gap-3 p-3 bg-muted/40 rounded-sm">
                  <img
                    src={absence.employe?.avatar}
                    alt={`${absence.employe?.prenom} ${absence.employe?.nom}`}
                    className="w-10 h-10 rounded-sm object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {absence.employe?.prenom} {absence.employe?.nom}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(parseISO(absence.dateDebut), 'd MMM', { locale: fr })} -{' '}
                      {format(parseISO(absence.dateFin), 'd MMM yyyy', { locale: fr })}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">Dans {absence.joursAvantDebut}j</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
