'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Trash2, 
  Info, 
  AlertCircle, 
  CheckCircle,
  XCircle,
  Filter,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/useAppStore'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Notification } from '@/types'

// Notifications de démonstration
const notificationsMock: Notification[] = [
  {
    id: '1',
    titre: 'Demande de congé approuvée',
    message: 'Votre demande de congé du 25 au 30 avril a été approuvée par Marie Dubois.',
    type: 'succes',
    lu: false,
    dateCreation: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
  },
  {
    id: '2',
    titre: 'Nouveau document disponible',
    message: "Votre attestation d'emploi est prête à être téléchargée.",
    type: 'info',
    lu: false,
    dateCreation: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2h ago
  },
  {
    id: '3',
    titre: 'Rappel : Entretien annuel',
    message: 'Votre entretien annuel est prévu pour le 15 mai 2026.',
    type: 'avertissement',
    lu: true,
    dateCreation: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: '4',
    titre: 'Demande de RTT refusée',
    message: 'Votre demande de RTT pour le 28 avril a été refusée. Motif : effectif insuffisant.',
    type: 'erreur',
    lu: true,
    dateCreation: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  },
  {
    id: '5',
    titre: 'Bienvenue sur RH Élite',
    message: 'Votre compte a été créé avec succès. Découvrez toutes les fonctionnalités.',
    type: 'info',
    lu: true,
    dateCreation: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
  },
]

const ICONES_TYPE = {
  info: Info,
  succes: CheckCircle,
  avertissement: AlertCircle,
  erreur: XCircle,
}

const STYLES_TYPE = {
  info: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  succes: 'bg-success/10 text-success border-success/20',
  avertissement: 'bg-warning/10 text-warning border-warning/20',
  erreur: 'bg-destructive/10 text-destructive border-destructive/20',
}

type FiltreType = 'tous' | 'non_lu' | Notification['type']

export function PageNotifications() {
  const [notifications, setNotifications] = useState(notificationsMock)
  const [filtre, setFiltre] = useState<FiltreType>('tous')

  const notificationsNonLues = notifications.filter(n => !n.lu).length

  // Filtrer
  const notificationsFiltrees = notifications.filter(notif => {
    if (filtre === 'tous') return true
    if (filtre === 'non_lu') return !notif.lu
    return notif.type === filtre
  })

  // Marquer comme lu
  const marquerCommeLu = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, lu: true } : n)
    )
  }

  // Tout marquer comme lu
  const toutMarquerCommeLu = () => {
    setNotifications(prev => prev.map(n => ({ ...n, lu: true })))
  }

  // Supprimer
  const supprimer = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const filtres: { id: FiltreType; label: string }[] = [
    { id: 'tous', label: 'Toutes' },
    { id: 'non_lu', label: 'Non lues' },
    { id: 'info', label: 'Info' },
    { id: 'succes', label: 'Succès' },
    { id: 'avertissement', label: 'Alertes' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-sm">
            <Bell className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Notifications</h2>
            <p className="text-sm text-muted-foreground">
              {notificationsNonLues > 0 
                ? `${notificationsNonLues} non lue${notificationsNonLues > 1 ? 's' : ''}`
                : 'Tout est à jour'
              }
            </p>
          </div>
        </div>

        {notificationsNonLues > 0 && (
          <motion.button
            onClick={toutMarquerCommeLu}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-sm transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <CheckCheck className="w-4 h-4" />
            Tout marquer comme lu
          </motion.button>
        )}
      </motion.div>

      {/* Filtres */}
      <motion.div
        className="flex flex-wrap gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {filtres.map((f) => (
          <button
            key={f.id}
            onClick={() => setFiltre(f.id)}
            className={cn(
              'px-4 py-2 text-sm rounded-sm border transition-all',
              filtre === f.id
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card border-border hover:border-primary/50'
            )}
          >
            {f.label}
          </button>
        ))}
      </motion.div>

      {/* Liste */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <AnimatePresence mode="popLayout">
          {notificationsFiltrees.map((notif, index) => {
            const Icone = ICONES_TYPE[notif.type]
            
            return (
              <motion.div
                key={notif.id}
                className={cn(
                  'p-5 bg-card border rounded-sm transition-colors group',
                  notif.lu ? 'border-border' : 'border-primary/30 bg-primary/5'
                )}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                transition={{ delay: index * 0.05 }}
                layout
              >
                <div className="flex gap-4">
                  {/* Icône */}
                  <div className={cn(
                    'p-2 rounded-sm border shrink-0',
                    STYLES_TYPE[notif.type]
                  )}>
                    <Icone className="w-5 h-5" />
                  </div>

                  {/* Contenu */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className={cn(
                          'font-medium',
                          !notif.lu && 'text-foreground'
                        )}>
                          {notif.titre}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notif.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDistanceToNow(new Date(notif.dateCreation), { 
                            addSuffix: true,
                            locale: fr,
                          })}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notif.lu && (
                          <motion.button
                            onClick={() => marquerCommeLu(notif.id)}
                            className="p-2 hover:bg-muted rounded-sm transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            title="Marquer comme lu"
                          >
                            <Check className="w-4 h-4 text-muted-foreground" />
                          </motion.button>
                        )}
                        <motion.button
                          onClick={() => supprimer(notif.id)}
                          className="p-2 hover:bg-destructive/10 rounded-sm transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Indicateur non lu */}
                    {!notif.lu && (
                      <motion.span
                        className="absolute top-5 right-5 w-2 h-2 bg-primary rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring' }}
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* Message si vide */}
        {notificationsFiltrees.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Bell className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground">Aucune notification</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Vous êtes à jour !
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
