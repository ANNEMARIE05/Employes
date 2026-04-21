'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Check, Trash2, Calendar, FileText, Users, X } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'
import { format, parseISO, formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

const ICONES_TYPE = {
  conge: Calendar,
  document: FileText,
  employe: Users,
  systeme: Bell,
}

export function DropdownNotifications() {
  const [ouvert, setOuvert] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  
  const { 
    notifications, 
    marquerCommeLu, 
    supprimerNotification,
    definirOngletActif,
  } = useAppStore()
  
  const notificationsNonLues = notifications.filter(n => !n.lu).length

  // Fermer au clic extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOuvert(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNotificationClick = (notification: typeof notifications[0]) => {
    marquerCommeLu(notification.id)
    
    // Naviguer selon le type
    if (notification.type === 'conge') {
      definirOngletActif('conges')
    } else if (notification.type === 'document') {
      definirOngletActif('documents')
    } else if (notification.type === 'employe') {
      definirOngletActif('employes')
    }
    
    setOuvert(false)
  }

  const marquerToutCommeLu = () => {
    notifications.forEach(n => {
      if (!n.lu) marquerCommeLu(n.id)
    })
  }

  return (
    <div ref={ref} className="relative">
      {/* Bouton */}
      <motion.button
        onClick={() => setOuvert(!ouvert)}
        className="relative p-2.5 text-muted-foreground hover:text-foreground transition-colors hover:bg-muted"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bell className="w-4 h-4" />
        {notificationsNonLues > 0 && (
          <motion.span
            className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500 }}
          />
        )}
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {ouvert && (
          <motion.div
            className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-card border border-border shadow-lg overflow-hidden z-50"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm">Notifications</h3>
                {notificationsNonLues > 0 && (
                  <span className="text-xs bg-primary text-primary-foreground px-1.5 py-0.5">
                    {notificationsNonLues}
                  </span>
                )}
              </div>
              {notificationsNonLues > 0 && (
                <button
                  onClick={marquerToutCommeLu}
                  className="text-xs text-primary hover:underline"
                >
                  Tout marquer comme lu
                </button>
              )}
            </div>

            {/* Liste */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Aucune notification</p>
                </div>
              ) : (
                notifications.slice(0, 10).map((notification, index) => {
                  const Icone = ICONES_TYPE[notification.type] || Bell
                  
                  return (
                    <motion.div
                      key={notification.id}
                      className={cn(
                        'flex gap-3 p-4 border-b border-border/50 cursor-pointer transition-colors',
                        'hover:bg-muted/50',
                        !notification.lu && 'bg-primary/5'
                      )}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      {/* Icône */}
                      <div className={cn(
                        'shrink-0 p-2',
                        !notification.lu ? 'bg-primary/10' : 'bg-muted'
                      )}>
                        <Icone className={cn(
                          'w-4 h-4',
                          !notification.lu ? 'text-primary' : 'text-muted-foreground'
                        )} />
                      </div>

                      {/* Contenu */}
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          'text-sm line-clamp-2',
                          !notification.lu && 'font-medium'
                        )}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(parseISO(notification.dateCreation), { 
                            addSuffix: true, 
                            locale: fr 
                          })}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-start gap-1">
                        {!notification.lu && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              marquerCommeLu(notification.id)
                            }}
                            className="p-1 text-muted-foreground hover:text-success transition-colors"
                            title="Marquer comme lu"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            supprimerNotification(notification.id)
                          }}
                          className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  )
                })
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <button
                onClick={() => {
                  definirOngletActif('notifications')
                  setOuvert(false)
                }}
                className="w-full p-3 text-center text-sm text-primary hover:bg-muted/50 transition-colors border-t border-border"
              >
                Voir toutes les notifications
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
