'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/components/ui/use-mobile'
import {
  LayoutDashboard,
  Users,
  Calendar,
  CalendarClock,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  History,
  Cog,
  User,
  CalendarDays,
  FileCheck,
  type LucideIcon,
} from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { RoleUtilisateur } from '@/types'

interface MenuItem {
  id: string
  label: string
  icone: LucideIcon
  roles: RoleUtilisateur[]
}

// Menu items avec les roles autorises
const elementsMenu: MenuItem[] = [
  { id: 'tableau-bord', label: 'Tableau de bord', icone: LayoutDashboard, roles: ['rh', 'manager', 'employe'] },
  { id: 'mon-profil', label: 'Mon profil', icone: User, roles: ['employe', 'manager'] },
  { id: 'mes-conges', label: 'Mes congés', icone: CalendarDays, roles: ['employe', 'manager'] },
  { id: 'absences', label: 'Absences', icone: CalendarClock, roles: ['rh', 'manager', 'employe'] },
  { id: 'mes-documents', label: 'Mes documents', icone: FileCheck, roles: ['employe', 'manager'] },
  { id: 'employes', label: 'Employés', icone: Users, roles: ['rh', 'manager'] },
  { id: 'conges', label: 'Gestion Congés', icone: Calendar, roles: ['rh'] },
  { id: 'documents', label: 'Gestion Documents', icone: FileText, roles: ['rh'] },
  { id: 'statistiques', label: 'Statistiques', icone: BarChart3, roles: ['rh', 'manager'] },
  { id: 'notifications', label: 'Notifications', icone: Bell, roles: ['rh', 'manager', 'employe'] },
  { id: 'historique', label: 'Historique', icone: History, roles: ['rh', 'manager', 'employe'] },
]

const elementsSecondaires: MenuItem[] = [
  { id: 'parametrage', label: 'Paramétrage', icone: Cog, roles: ['rh'] },
  { id: 'parametres', label: 'Paramètres', icone: Settings, roles: ['rh', 'manager', 'employe'] },
]

export function Sidebar() {
  const [confirmationDeconnexionOuverte, setConfirmationDeconnexionOuverte] = useState(false)
  const router = useRouter()
  
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
  const roleUtilisateur = utilisateurConnecte?.role || 'employe'
  const isMobile = useIsMobile()

  // Filtrer les menus selon le role
  const menuFiltre = useMemo(() => 
    elementsMenu.filter(item => item.roles.includes(roleUtilisateur)),
    [roleUtilisateur]
  )

  const menuSecondaireFiltre = useMemo(() => 
    elementsSecondaires.filter(item => item.roles.includes(roleUtilisateur)),
    [roleUtilisateur]
  )

  // Scroll to top when changing page
  const handleChangerOnglet = (onglet: string) => {
    definirOngletActif(onglet)
    if (isMobile && menuOuvert) {
      basculerMenu()
    }
    // Le scroll est gere dans page.tsx via useEffect
  }

  const handleDeconnexion = () => {
    deconnecter()
    router.replace('/login')
    setConfirmationDeconnexionOuverte(false)
  }

  // Badge de role
  const getRoleBadge = () => {
    switch (roleUtilisateur) {
      case 'rh':
        return { label: 'RH', color: 'bg-primary text-primary-foreground' }
      case 'manager':
        return { label: 'Manager', color: 'bg-warning/20 text-warning' }
      default:
        return { label: 'Employé', color: 'bg-muted text-muted-foreground' }
    }
  }

  const roleBadge = getRoleBadge()

  return (
    <>
      {isMobile && menuOuvert && (
        <button
          aria-label="Fermer le menu"
          className="fixed inset-x-0 bottom-0 top-16 z-30 bg-black/40"
          onClick={basculerMenu}
        />
      )}
      <motion.aside
        className={cn(
          'fixed left-0 bg-sidebar text-sidebar-foreground overflow-hidden',
          'flex flex-col border-r border-sidebar-border z-40',
          'transition-all duration-300 ease-out',
          isMobile
            ? 'top-16 h-[calc(100dvh-4rem)] w-[88vw] max-w-[340px] shadow-xl rounded-r-md'
            : 'top-0 h-screen'
        )}
        initial={false}
        animate={
          isMobile
            ? { x: menuOuvert ? 0 : '-100%' }
            : { width: menuOuvert ? 260 : 72 }
        }
        transition={{ duration: 0.25, ease: 'easeOut' }}
        style={{ willChange: 'transform,width' }}
      >
        {/* Logo et toggle */}
        <div className="flex items-center justify-between gap-2 p-4 border-b border-sidebar-border min-w-0">
          <AnimatePresence mode="wait">
            {menuOuvert && (
              <motion.div
                className="flex items-center gap-3 min-w-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-8 h-8 bg-sidebar-primary flex items-center justify-center">
                  <span className="text-sidebar-primary-foreground font-bold text-sm">M</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-base tracking-tight leading-none truncate">MUFER</span>
                  <span className="text-[10px] text-sidebar-primary tracking-widest truncate">EMPLOYES</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {!menuOuvert && !isMobile && (
            <div className="w-8 h-8 bg-sidebar-primary flex items-center justify-center mx-auto">
              <span className="text-sidebar-primary-foreground font-bold text-sm">M</span>
            </div>
          )}
          
          {!isMobile && (
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
          )}
        </div>

        {/* Navigation principale */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto overscroll-contain">
          {menuFiltre.map((item, index) => {
            const estActif = ongletActif === item.id
            const Icone = item.icone
            
            return (
              <motion.button
                key={item.id}
                onClick={() => handleChangerOnglet(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all duration-200 min-w-0 overflow-hidden',
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
                  {(menuOuvert || isMobile) && (
                    <motion.span
                      className="text-sm font-medium whitespace-nowrap truncate min-w-0"
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
                {!menuOuvert && !isMobile && (
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
          {menuSecondaireFiltre.map((item) => {
            const Icone = item.icone
            const estActif = ongletActif === item.id
            
            return (
              <motion.button
                key={item.id}
                onClick={() => handleChangerOnglet(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all duration-200 min-w-0 overflow-hidden',
                  'group relative',
                  estActif 
                    ? 'bg-sidebar-accent text-sidebar-primary' 
                    : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                )}
                whileHover={{ x: 4 }}
              >
                <Icone className="w-5 h-5" />
                <AnimatePresence mode="wait">
                  {(menuOuvert || isMobile) && (
                    <motion.span
                      className="text-sm font-medium truncate"
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
                'flex items-center gap-3 p-3 mt-2 rounded-sm bg-sidebar-accent/30 min-w-0 overflow-hidden',
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
                {(menuOuvert || isMobile) && (
                  <motion.div
                    className="flex-1 min-w-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">
                        {utilisateurConnecte.prenom} {utilisateurConnecte.nom}
                      </p>
                      <span className={cn('text-[10px] px-1.5 py-0.5 rounded-sm font-medium', roleBadge.color)}>
                        {roleBadge.label}
                      </span>
                    </div>
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
            onClick={() => setConfirmationDeconnexionOuverte(true)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-sm transition-colors',
              'text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10'
            )}
            whileHover={{ x: 4 }}
          >
            <LogOut className="w-5 h-5" />
            <AnimatePresence mode="wait">
              {(menuOuvert || isMobile) && (
                <motion.span
                  className="text-sm font-medium truncate"
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

      {/* Dialog de confirmation de déconnexion */}
      <AlertDialog open={confirmationDeconnexionOuverte} onOpenChange={setConfirmationDeconnexionOuverte}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la déconnexion</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder à votre compte.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeconnexion}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Se déconnecter
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
