'use client'

import { motion } from 'framer-motion'
import { 
  Users, 
  Calendar, 
  FileText, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  UserPlus,
  FileSearch,
  CalendarClock,
  Building2,
  BadgeCheck,
  XCircle,
} from 'lucide-react'
import { CounterCard } from '@/components/ui/animated-number'
import { GraphiqueEffectif } from './graphique-effectif'
import { GraphiqueDepartements } from './graphique-departements'
import { DemandesRecentes } from './demandes-recentes'
import { EmployesEnConge } from './employes-en-conge'
import { statistiquesMock, demandesCongesMock, demandesDocumentsMock, employesMock } from '@/lib/donnees-mock'
import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'
import { LABELS_TYPE_CONGE, LABELS_TYPE_DOCUMENT } from '@/types'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export function TableauBord() {
  const stats = statistiquesMock
  const { utilisateurConnecte, definirOngletActif } = useAppStore()
  
  // Stats calculees
  const congesEnAttente = demandesCongesMock.filter(d => d.statut === 'en_attente').length
  const documentsEnAttente = demandesDocumentsMock.filter(d => d.statut === 'en_attente').length
  const totalEnAttente = congesEnAttente + documentsEnAttente
  
  // Demandes recentes
  const dernieresDemandesConges = demandesCongesMock
    .filter(d => d.statut === 'en_attente')
    .slice(0, 3)
    .map(d => {
      const employe = employesMock.find(e => e.id === d.employeId)
      return { ...d, employe }
    })
  
  const dernieresDemandesDocuments = demandesDocumentsMock
    .filter(d => d.statut === 'en_attente')
    .slice(0, 3)
    .map(d => {
      const employe = employesMock.find(e => e.id === d.employeId)
      return { ...d, employe }
    })

  // Actions rapides
  const actionsRapides = [
    { 
      id: 'conges', 
      label: 'Gerer les conges', 
      icone: <Calendar className="w-5 h-5" />, 
      count: congesEnAttente,
      couleur: 'bg-primary/10 text-primary hover:bg-primary/20',
      nuanceCompteur: 'bg-primary/20 text-primary'
    },
    { 
      id: 'documents', 
      label: 'Traiter documents', 
      icone: <FileText className="w-5 h-5" />, 
      count: documentsEnAttente,
      couleur: 'bg-success/10 text-success hover:bg-success/20',
      nuanceCompteur: 'bg-success/20 text-success'
    },
    { 
      id: 'employes', 
      label: 'Voir employes', 
      icone: <Users className="w-5 h-5" />, 
      count: null,
      couleur: 'bg-muted text-muted-foreground hover:bg-muted/80',
      nuanceCompteur: 'bg-background/70 text-muted-foreground'
    },
    { 
      id: 'statistiques', 
      label: 'Statistiques', 
      icone: <TrendingUp className="w-5 h-5" />, 
      count: null,
      couleur: 'bg-muted text-muted-foreground hover:bg-muted/80',
      nuanceCompteur: 'bg-background/70 text-muted-foreground'
    },
  ]

  return (
    <motion.div
      className="space-y-4 sm:space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Banniere de bienvenue RH */}
      <motion.div
        className="relative overflow-hidden bg-sidebar text-sidebar-foreground p-4 sm:p-6"
        variants={itemVariants}
      >
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <img
              src={utilisateurConnecte?.avatar}
              alt={`${utilisateurConnecte?.prenom} ${utilisateurConnecte?.nom}`}
              className="w-16 h-16 rounded-sm object-cover border-2 border-sidebar-primary hidden sm:block"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-2 py-0.5 bg-sidebar-primary text-sidebar-primary-foreground font-medium rounded-sm">
                  Espace RH
                </span>
                <span className="text-xs px-2 py-0.5 bg-sidebar-accent text-sidebar-foreground font-medium rounded-sm">
                  Administrateur
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold mb-1">
                Bonjour, {utilisateurConnecte?.prenom || 'Utilisateur'}
              </h2>
              <p className="text-sidebar-foreground/70 text-sm">
                {totalEnAttente > 0 ? (
                  <>
                    Vous avez <span className="text-sidebar-primary font-medium">{totalEnAttente} demande{totalEnAttente > 1 ? 's' : ''}</span> a traiter aujourd&apos;hui
                  </>
                ) : (
                  'Toutes les demandes ont ete traitees'
                )}
              </p>
            </div>
          </div>
          
          {/* Actions rapides */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full lg:w-auto">
            {actionsRapides.map((action) => (
              <button
                key={action.id}
                onClick={() => definirOngletActif(action.id)}
                className={`${action.couleur} group min-h-[74px] rounded-sm border border-sidebar-border/30 px-3 py-2 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-primary/40`}
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="shrink-0">{action.icone}</span>
                  {action.count !== null && (
                    <span className={`rounded-sm px-1.5 py-0.5 text-xs font-medium ${action.nuanceCompteur}`}>
                      {action.count}
                    </span>
                  )}
                </div>
                <div className="text-sm font-medium leading-tight">
                  {action.label}
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Decoration geometrique */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2 opacity-10">
          <div className="w-24 h-24 border-2 border-sidebar-primary" />
          <div className="w-12 h-12 bg-sidebar-primary mt-12" />
        </div>
      </motion.div>

      {/* Cartes statistiques */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        variants={itemVariants}
      >
        <CounterCard
          icone={<Users className="w-5 h-5" />}
          titre="Total employes"
          valeur={stats.totalEmployes}
          description={`${stats.employesActifs} actifs`}
          tendance={{ valeur: 5.2, positif: true }}
          delai={0}
        />
        <CounterCard
          icone={<Calendar className="w-5 h-5" />}
          titre="En conge"
          valeur={stats.employesEnConge}
          description="Cette semaine"
          delai={0.1}
        />
        <CounterCard
          icone={<Clock className="w-5 h-5" />}
          titre="Demandes en attente"
          valeur={stats.demandesEnAttente}
          description="A traiter"
          tendance={{ valeur: 2, positif: false }}
          delai={0.2}
        />
        <CounterCard
          icone={<TrendingUp className="w-5 h-5" />}
          titre="Taux d'absenteisme"
          valeur={stats.tauxAbsenteisme}
          format="pourcentage"
          description="Ce mois-ci"
          tendance={{ valeur: 0.5, positif: false }}
          delai={0.3}
        />
      </motion.div>

      {/* Section demandes urgentes */}
      {totalEnAttente > 0 && (
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4"
          variants={itemVariants}
        >
          {/* Conges en attente */}
          <div className="p-4 sm:p-5 bg-card border border-border rounded-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-primary" />
                Conges en attente
                {congesEnAttente > 0 && (
                  <span className="text-xs px-2 py-0.5 bg-warning/20 text-warning rounded-sm">
                    {congesEnAttente}
                  </span>
                )}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => definirOngletActif('conges')}
                className="gap-1 text-muted-foreground hover:text-foreground"
              >
                Voir tout <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            
            {dernieresDemandesConges.length > 0 ? (
              <div className="space-y-3">
                {dernieresDemandesConges.map((demande) => (
                  <div 
                    key={demande.id}
                    className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-muted/50 rounded-sm"
                  >
                    <img
                      src={demande.employe?.avatar}
                      alt={`${demande.employe?.prenom} ${demande.employe?.nom}`}
                      className="w-10 h-10 rounded-sm object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {demande.employe?.prenom} {demande.employe?.nom}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {LABELS_TYPE_CONGE[demande.type]} - {demande.nombreJours} jour{demande.nombreJours > 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {format(parseISO(demande.dateDebut), 'd MMM', { locale: fr })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucune demande de conge en attente
              </p>
            )}
          </div>

          {/* Documents en attente */}
          <div className="p-4 sm:p-5 bg-card border border-border rounded-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <FileSearch className="w-5 h-5 text-success" />
                Documents en attente
                {documentsEnAttente > 0 && (
                  <span className="text-xs px-2 py-0.5 bg-warning/20 text-warning rounded-sm">
                    {documentsEnAttente}
                  </span>
                )}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => definirOngletActif('documents')}
                className="gap-1 text-muted-foreground hover:text-foreground"
              >
                Voir tout <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            
            {dernieresDemandesDocuments.length > 0 ? (
              <div className="space-y-3">
                {dernieresDemandesDocuments.map((demande) => (
                  <div 
                    key={demande.id}
                    className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-muted/50 rounded-sm"
                  >
                    <img
                      src={demande.employe?.avatar}
                      alt={`${demande.employe?.prenom} ${demande.employe?.nom}`}
                      className="w-10 h-10 rounded-sm object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {demande.employe?.prenom} {demande.employe?.nom}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {LABELS_TYPE_DOCUMENT[demande.typeDocument]}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {format(parseISO(demande.dateCreation), 'd MMM', { locale: fr })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucune demande de document en attente
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 items-stretch">
        <motion.div 
          className="lg:col-span-2 h-full"
          variants={itemVariants}
        >
          <GraphiqueEffectif donnees={stats.evolutionEffectif} />
        </motion.div>
        <motion.div className="h-full" variants={itemVariants}>
          <GraphiqueDepartements donnees={stats.repartitionDepartements} />
        </motion.div>
      </div>

      {/* Actions rapides et demandes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 items-stretch">
        <motion.div className="h-full" variants={itemVariants}>
          <DemandesRecentes />
        </motion.div>
        <motion.div className="h-full" variants={itemVariants}>
          <EmployesEnConge />
        </motion.div>
      </div>

      {/* Resume du mois */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4"
        variants={itemVariants}
      >
        <div className="p-4 sm:p-5 bg-card border border-border min-h-[96px] sm:min-h-[100px] flex items-center gap-3 sm:gap-4 overflow-hidden">
          <div className="p-2 sm:p-3 bg-success/10 shrink-0">
            <CheckCircle className="w-5 h-5 text-success" />
          </div>
          <div className="min-w-0">
            <p className="text-xl sm:text-2xl font-semibold">{stats.congesApprouvesCeMois}</p>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">Conges approuves</p>
          </div>
        </div>
        
        <div className="p-4 sm:p-5 bg-card border border-border min-h-[96px] sm:min-h-[100px] flex items-center gap-3 sm:gap-4 overflow-hidden">
          <div className="p-2 sm:p-3 bg-destructive/10 shrink-0">
            <XCircle className="w-5 h-5 text-destructive" />
          </div>
          <div className="min-w-0">
            <p className="text-xl sm:text-2xl font-semibold">2</p>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">Conges refuses</p>
          </div>
        </div>
        
        <div className="p-4 sm:p-5 bg-card border border-border min-h-[96px] sm:min-h-[100px] flex items-center gap-3 sm:gap-4 overflow-hidden">
          <div className="p-2 sm:p-3 bg-primary/10 shrink-0">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-xl sm:text-2xl font-semibold">{stats.documentsTraitesCeMois}</p>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">Documents traites</p>
          </div>
        </div>
        
        <div className="p-4 sm:p-5 bg-card border border-border min-h-[96px] sm:min-h-[100px] flex items-center gap-3 sm:gap-4 overflow-hidden">
          <div className="p-2 sm:p-3 bg-warning/10 shrink-0">
            <AlertCircle className="w-5 h-5 text-warning" />
          </div>
          <div className="min-w-0">
            <p className="text-xl sm:text-2xl font-semibold">3</p>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">Contrats a renouveler</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
