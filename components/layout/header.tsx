'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'
import { Search, Bell, Plus, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

const titresPages: Record<string, { titre: string; description: string }> = {
  'tableau-bord': { 
    titre: 'Tableau de bord', 
    description: 'Vue d\'ensemble de votre activité RH' 
  },
  'employes': { 
    titre: 'Employés', 
    description: 'Gestion de l\'effectif et des profils' 
  },
  'conges': { 
    titre: 'Congés', 
    description: 'Demandes et planning des absences' 
  },
  'documents': { 
    titre: 'Documents', 
    description: 'Demandes de documents administratifs' 
  },
  'statistiques': { 
    titre: 'Statistiques', 
    description: 'Analyses et rapports RH' 
  },
  'notifications': { 
    titre: 'Notifications', 
    description: 'Alertes et messages' 
  },
  'parametrage': { 
    titre: 'Paramétrage', 
    description: 'Configuration des types de congés, documents et postes' 
  },
  'parametres': { 
    titre: 'Paramètres', 
    description: 'Configuration de votre profil' 
  },
}

interface HeaderProps {
  onNouvelleDemande?: () => void
}

export function Header({ onNouvelleDemande }: HeaderProps) {
  const { ongletActif, menuOuvert, notifications, utilisateurConnecte, marquerCommeLu, definirOngletActif } = useAppStore()
  const [rechercheOuverte, setRechercheOuverte] = useState(false)
  
  const pageInfo = titresPages[ongletActif] || { titre: 'RH Élite', description: '' }
  const notificationsNonLues = notifications.filter(n => !n.lu).length

  // Date formatée en français
  const dateAujourdhui = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <motion.header
      className={cn(
        'fixed top-0 right-0 h-16 bg-white',
        'border-b border-border z-30 flex items-center justify-between px-6',
        'transition-all duration-300'
      )}
      style={{
        left: menuOuvert ? 260 : 72,
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Titre de la page */}
      <div className="flex flex-col">
        <motion.h1
          key={ongletActif}
          className="text-lg font-semibold text-foreground"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {pageInfo.titre}
        </motion.h1>
        <motion.p
          key={`${ongletActif}-desc`}
          className="text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {pageInfo.description}
        </motion.p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Date */}
        <motion.span
          className="text-sm text-muted-foreground hidden lg:block capitalize"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {dateAujourdhui}
        </motion.span>

        {/* Barre de recherche */}
        <motion.div
          className={cn(
            'flex items-center border border-border rounded-sm overflow-hidden',
            'transition-all duration-300',
            rechercheOuverte ? 'w-64' : 'w-10'
          )}
        >
          <button
            onClick={() => setRechercheOuverte(!rechercheOuverte)}
            className="p-2.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
          {rechercheOuverte && (
            <motion.input
              type="text"
              placeholder="Rechercher..."
              className="flex-1 bg-transparent text-sm outline-none pr-3"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              autoFocus
              onBlur={() => setRechercheOuverte(false)}
            />
          )}
        </motion.div>

        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button
              className="relative p-2.5 text-muted-foreground hover:text-foreground transition-colors rounded-sm hover:bg-muted"
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
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              {notificationsNonLues > 0 && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-sm">
                  {notificationsNonLues} non lue{notificationsNonLues > 1 ? 's' : ''}
                </span>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Aucune notification
              </div>
            ) : (
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.slice(0, 5).map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={cn(
                      'flex flex-col items-start gap-1 p-3 cursor-pointer',
                      !notification.lu && 'bg-primary/5'
                    )}
                    onClick={() => marquerCommeLu(notification.id)}
                  >
                    <div className="flex items-start justify-between w-full gap-2">
                      <span className="font-medium text-sm">{notification.titre}</span>
                      {!notification.lu && (
                        <span className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1.5" />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground line-clamp-2">
                      {notification.message}
                    </span>
                    <span className="text-xs text-muted-foreground/70">
                      {formatDistanceToNow(new Date(notification.dateCreation), { 
                        addSuffix: true, 
                        locale: fr 
                      })}
                    </span>
                  </DropdownMenuItem>
                ))}
              </div>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="justify-center text-primary cursor-pointer"
              onClick={() => definirOngletActif('notifications')}
            >
              Voir toutes les notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Bouton nouvelle demande */}
        {(ongletActif === 'conges' || ongletActif === 'documents') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              onClick={onNouvelleDemande}
              className="h-9 px-4 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nouvelle demande</span>
            </Button>
          </motion.div>
        )}

        {/* Avatar utilisateur */}
        {utilisateurConnecte && (
          <motion.div
            className="hidden md:flex items-center gap-3 pl-3 border-l border-border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-right">
              <p className="text-sm font-medium">
                {utilisateurConnecte.prenom}
              </p>
              <p className="text-xs text-muted-foreground">
                {utilisateurConnecte.departement}
              </p>
            </div>
            <motion.img
              src={utilisateurConnecte.avatar}
              alt={utilisateurConnecte.prenom}
              className="w-9 h-9 rounded-sm object-cover border border-border"
              whileHover={{ scale: 1.05 }}
            />
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}
