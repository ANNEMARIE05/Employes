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
import { Card, CardContent } from '@/components/ui/card'
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
      label: 'Gerer les conges RH', 
      icone: <Calendar className="w-5 h-5" />, 
      count: congesEnAttente,
      couleur: 'bg-primary/10 text-primary hover:bg-primary/20',
      nuanceCompteur: 'bg-primary/20 text-primary'
    },
    { 
      id: 'documents', 
      label: 'Traiter les documents', 
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
        className="text-card-foreground"
        variants={itemVariants}
      >
        <Card className="luxury-panel py-0">
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_1fr]">
              <div className="space-y-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <img
                    src={utilisateurConnecte?.avatar}
                    alt={`${utilisateurConnecte?.prenom} ${utilisateurConnecte?.nom}`}
                    className="hidden h-16 w-16 rounded-xl border border-border/70 object-cover shadow-sm sm:block"
                  />
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="data-chip text-primary">Espace RH Premium</span>
                      <span className="data-chip text-muted-foreground">Role: Administrateur RH</span>
                      <span className="data-chip text-success">{stats.employesActifs} employes actifs</span>
                    </div>
                    <h2 className="mb-1 text-lg font-semibold sm:text-2xl">
                      Bonjour {utilisateurConnecte?.prenom || 'Utilisateur'},
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {totalEnAttente > 0 ? (
                        <>
                          Vous avez <span className="font-medium text-primary">{totalEnAttente} demande{totalEnAttente > 1 ? 's' : ''}</span> a traiter aujourd&apos;hui
                        </>
                      ) : (
                        'Excellente nouvelle: toutes les demandes ont ete traitees'
                      )}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Card className="py-0">
                    <CardContent className="px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">Conges en attente</p>
                    <p className="mt-1 text-2xl font-semibold text-primary">{congesEnAttente}</p>
                    </CardContent>
                  </Card>
                  <Card className="py-0">
                    <CardContent className="px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">Documents en attente</p>
                    <p className="mt-1 text-2xl font-semibold text-success">{documentsEnAttente}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                  Actions rapides
                </p>
                <div className="grid grid-cols-2 gap-3">
                {actionsRapides.map((action) => (
                  <Card key={action.id} className="py-0">
                    <CardContent className="p-0">
                      <button
                        onClick={() => definirOngletActif(action.id)}
                        className="group min-h-[94px] w-full rounded-xl px-3 py-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                      >
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <span className="shrink-0 text-primary">{action.icone}</span>
                          {action.count !== null && (
                            <span className="rounded-full px-2 py-0.5 text-xs font-semibold bg-primary/15 text-primary">
                              {action.count}
                            </span>
                          )}
                        </div>
                        <div className="text-sm font-medium leading-tight text-foreground">
                          {action.label}
                        </div>
                      </button>
                    </CardContent>
                  </Card>
                ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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
          <div className="luxury-panel rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-primary" />
                Conges en attente
                {congesEnAttente > 0 && (
                  <span className="data-chip text-warning">
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
                    className="flex items-center gap-2 sm:gap-3 rounded-xl border border-border/60 bg-muted/35 p-2.5 sm:p-3"
                  >
                    <img
                      src={demande.employe?.avatar}
                      alt={`${demande.employe?.prenom} ${demande.employe?.nom}`}
                      className="h-10 w-10 rounded-lg object-cover border border-border/60"
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
          <div className="luxury-panel rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <FileSearch className="w-5 h-5 text-success" />
                Documents en attente
                {documentsEnAttente > 0 && (
                  <span className="data-chip text-warning">
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
                    className="flex items-center gap-2 sm:gap-3 rounded-xl border border-border/60 bg-muted/35 p-2.5 sm:p-3"
                  >
                    <img
                      src={demande.employe?.avatar}
                      alt={`${demande.employe?.prenom} ${demande.employe?.nom}`}
                      className="h-10 w-10 rounded-lg object-cover border border-border/60"
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
        <div className="stat-card flex min-h-[96px] items-center gap-3 overflow-hidden rounded-xl p-4 sm:min-h-[100px] sm:gap-4 sm:p-5">
          <div className="rounded-xl p-2 sm:p-3 bg-success/10 shrink-0">
            <CheckCircle className="w-5 h-5 text-success" />
          </div>
          <div className="min-w-0">
            <p className="text-xl sm:text-2xl font-semibold">{stats.congesApprouvesCeMois}</p>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">Conges approuves</p>
          </div>
        </div>
        
        <div className="stat-card flex min-h-[96px] items-center gap-3 overflow-hidden rounded-xl p-4 sm:min-h-[100px] sm:gap-4 sm:p-5">
          <div className="rounded-xl p-2 sm:p-3 bg-destructive/10 shrink-0">
            <XCircle className="w-5 h-5 text-destructive" />
          </div>
          <div className="min-w-0">
            <p className="text-xl sm:text-2xl font-semibold">2</p>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">Conges refuses</p>
          </div>
        </div>
        
        <div className="stat-card flex min-h-[96px] items-center gap-3 overflow-hidden rounded-xl p-4 sm:min-h-[100px] sm:gap-4 sm:p-5">
          <div className="rounded-xl p-2 sm:p-3 bg-primary/10 shrink-0">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-xl sm:text-2xl font-semibold">{stats.documentsTraitesCeMois}</p>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">Documents traites</p>
          </div>
        </div>
        
        <div className="stat-card flex min-h-[96px] items-center gap-3 overflow-hidden rounded-xl p-4 sm:min-h-[100px] sm:gap-4 sm:p-5">
          <div className="rounded-xl p-2 sm:p-3 bg-warning/10 shrink-0">
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
