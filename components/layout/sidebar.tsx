'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  Cog,
} from 'lucide-react'

const elementsMenu = [
  { id: 'tableau-bord', label: 'Tableau de bord', icone: LayoutDashboard },
  { id: 'employes', label: 'Employés', icone: Users },
  { id: 'conges', label: 'Congés', icone: Calendar },
  { id: 'documents', label: 'Documents', icone: FileText },
  { id: 'statistiques', label: 'Statistiques', icone: BarChart3 },
  { id: 'notifications', label: 'Notifications', icone: Bell },
]

const elementsSecondaires = [
  { id: 'parametrage', label: 'Paramétrage', icone: Cog },
  { id: 'parametres', label: 'Paramètres', icone: Settings },
]

export function Sidebar() {
  const { 
    menuOuvert, 
    basculerMenu, 
    ongletActif, 
    definirOngletActif,
    utilisateurConnecte,
    notifications,
    deconnecter,
  } = useAppStore()

  const notificationsNonLues = notifications.filter(n => !n.lu).length

  return (
    <motion.aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-sidebar text-sidebar-foreground',
        'flex flex-col border-r border-sidebar-border z-40',
        'transition-all duration-300 ease-out'
      )}
      initial={false}
      animate={{ width: menuOuvert ? 260 : 72 }}
    >
      {/* Logo et toggle */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <AnimatePresence mode="wait">
          {menuOuvert && (
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-8 h-8 bg-sidebar-primary flex items-center justify-center">
                <span className="text-sidebar-primary-foreground font-bold text-sm">M</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base tracking-tight leading-none">MUFER</span>
                <span className="text-[10px] text-sidebar-primary tracking-widest">EMPLOYES</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {!menuOuvert && (
          <div className="w-8 h-8 bg-sidebar-primary flex items-center justify-center mx-auto">
            <span className="text-sidebar-primary-foreground font-bold text-sm">M</span>
          </div>
        )}
        
        <motion.button
          onClick={basculerMenu}
          className={cn(
            'p-1.5 rounded-sm hover:bg-sidebar-accent transition-colors',
            !menuOuvert && 'absolute -right-3 top-6 bg-sidebar border border-sidebar-border'
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {menuOuvert ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </motion.button>
      </div>

      {/* Navigation principale */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {elementsMenu.map((item, index) => {
          const estActif = ongletActif === item.id
          const Icone = item.icone
          
          return (
            <motion.button
              key={item.id}
              onClick={() => definirOngletActif(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all duration-200',
                'relative group',
                estActif 
                  ? 'bg-sidebar-accent text-sidebar-primary' 
                  : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
              )}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 4 }}
            >
              {/* Indicateur actif */}
              {estActif && (
                <motion.div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-sidebar-primary rounded-r-sm"
                  layoutId="indicateurActif"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              
              <div className="relative">
                <Icone className="w-5 h-5" />
                {item.id === 'notifications' && notificationsNonLues > 0 && (
                  <motion.span
                    className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-medium rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                  >
                    {notificationsNonLues > 9 ? '9+' : notificationsNonLues}
                  </motion.span>
                )}
              </div>
              
              <AnimatePresence mode="wait">
                {menuOuvert && (
                  <motion.span
                    className="text-sm font-medium whitespace-nowrap"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Tooltip quand fermé */}
              {!menuOuvert && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-border">
                  {item.label}
                </div>
              )}
            </motion.button>
          )
        })}
      </nav>

      {/* Section bas */}
      <div className="border-t border-sidebar-border py-4 px-2 space-y-1">
        {elementsSecondaires.map((item) => {
          const Icone = item.icone
          const estActif = ongletActif === item.id
          
          return (
            <motion.button
              key={item.id}
              onClick={() => definirOngletActif(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all duration-200',
                'group relative',
                estActif 
                  ? 'bg-sidebar-accent text-sidebar-primary' 
                  : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
              )}
              whileHover={{ x: 4 }}
            >
              <Icone className="w-5 h-5" />
              <AnimatePresence mode="wait">
                {menuOuvert && (
                  <motion.span
                    className="text-sm font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}

        {/* Profil utilisateur */}
        {utilisateurConnecte && (
          <motion.div
            className={cn(
              'flex items-center gap-3 p-3 mt-2 rounded-sm bg-sidebar-accent/30',
              'cursor-pointer hover:bg-sidebar-accent/50 transition-colors'
            )}
            whileHover={{ scale: 1.01 }}
          >
            <img
              src={utilisateurConnecte.avatar}
              alt={`${utilisateurConnecte.prenom} ${utilisateurConnecte.nom}`}
              className="w-9 h-9 rounded-sm object-cover"
            />
            <AnimatePresence mode="wait">
              {menuOuvert && (
                <motion.div
                  className="flex-1 min-w-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-sm font-medium truncate">
                    {utilisateurConnecte.prenom} {utilisateurConnecte.nom}
                  </p>
                  <p className="text-xs text-sidebar-foreground/60 truncate">
                    {utilisateurConnecte.poste}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Bouton déconnexion */}
        <motion.button
          onClick={deconnecter}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-sm transition-colors',
            'text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10'
          )}
          whileHover={{ x: 4 }}
        >
          <LogOut className="w-5 h-5" />
          <AnimatePresence mode="wait">
            {menuOuvert && (
              <motion.span
                className="text-sm font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Déconnexion
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.aside>
  )
}
