'use client'

import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Briefcase, 
  Calendar,
  BadgeCheck,
  CalendarDays,
  Clock,
  FileText,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Award,
  MapPin,
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { demandesCongesMock, demandesDocumentsMock, employesMock } from '@/lib/donnees-mock'
import { LABELS_TYPE_CONGE, LABELS_STATUT, COULEURS_STATUT, LABELS_TYPE_DOCUMENT } from '@/types'
import { format, parseISO, differenceInYears, differenceInMonths } from 'date-fns'
import { fr } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

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

export function MonProfil() {
  const { utilisateurConnecte, definirOngletActif } = useAppStore()

  if (!utilisateurConnecte) {
    return null
  }

  // Recuperer les donnees de l'employe
  const mesConges = demandesCongesMock.filter(d => d.employeId === utilisateurConnecte.id)
  const mesDocuments = demandesDocumentsMock.filter(d => d.employeId === utilisateurConnecte.id)
  
  // Stats conges
  const congesApprouves = mesConges.filter(d => d.statut === 'approuve').length
  const congesEnAttente = mesConges.filter(d => d.statut === 'en_attente').length
  const congesRefuses = mesConges.filter(d => d.statut === 'refuse').length
  const totalJoursConges = mesConges
    .filter(d => d.statut === 'approuve')
    .reduce((acc, d) => acc + d.nombreJours, 0)
  
  // Stats documents
  const documentsApprouves = mesDocuments.filter(d => d.statut === 'approuve').length
  const documentsEnAttente = mesDocuments.filter(d => d.statut === 'en_attente').length
  
  // Calcul anciennete
  const dateEmbauche = parseISO(utilisateurConnecte.dateEmbauche)
  const annees = differenceInYears(new Date(), dateEmbauche)
  const mois = differenceInMonths(new Date(), dateEmbauche) % 12

  const getRoleBadge = () => {
    switch (utilisateurConnecte.role) {
      case 'rh':
        return { label: 'Ressources Humaines', color: 'bg-primary text-primary-foreground' }
      case 'manager':
        return { label: 'Manager', color: 'bg-warning/20 text-warning' }
      default:
        return { label: 'Employe', color: 'bg-muted text-muted-foreground' }
    }
  }

  const roleBadge = getRoleBadge()

  const getStatutBadge = () => {
    switch (utilisateurConnecte.statut) {
      case 'actif':
        return { label: 'Actif', color: 'bg-success/20 text-success' }
      case 'conge':
        return { label: 'En conge', color: 'bg-warning/20 text-warning' }
      case 'absent':
        return { label: 'Absent', color: 'bg-destructive/20 text-destructive' }
      default:
        return { label: utilisateurConnecte.statut, color: 'bg-muted text-muted-foreground' }
    }
  }

  const statutBadge = getStatutBadge()

  // Dernieres demandes
  const dernieresDemandesConges = mesConges.slice(0, 3)
  const dernieresDemandesDocuments = mesDocuments.slice(0, 2)

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Carte profil principale */}
      <motion.div
        className="bg-card border border-border rounded-sm overflow-hidden"
        variants={itemVariants}
      >
        {/* Banniere */}
        <div className="h-32 bg-sidebar relative">
          <div className="absolute inset-0 bg-gradient-to-r from-sidebar via-sidebar to-sidebar-accent/50" />
          <div className="absolute right-6 top-6 flex gap-3 opacity-20">
            <div className="w-16 h-16 border-2 border-sidebar-primary" />
            <div className="w-8 h-8 bg-sidebar-primary mt-8" />
          </div>
        </div>
        
        {/* Avatar et info de base */}
        <div className="p-6 -mt-16">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="relative">
              <img
                src={utilisateurConnecte.avatar}
                alt={`${utilisateurConnecte.prenom} ${utilisateurConnecte.nom}`}
                className="w-28 h-28 rounded-sm object-cover border-4 border-card shadow-lg"
              />
              <div className={cn(
                'absolute -bottom-2 -right-2 p-1.5 rounded-sm',
                statutBadge.color
              )}>
                {utilisateurConnecte.statut === 'actif' ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Clock className="w-4 h-4" />
                )}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">
                  {utilisateurConnecte.prenom} {utilisateurConnecte.nom}
                </h2>
                <span className={`text-xs px-2 py-1 rounded-sm font-medium ${roleBadge.color}`}>
                  {roleBadge.label}
                </span>
              </div>
              <p className="text-lg text-foreground">{utilisateurConnecte.poste}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                {utilisateurConnecte.departement}
              </p>
              
              {/* Stats rapides */}
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm">
                  <Award className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">Anciennete:</span>
                  <span className="font-medium">
                    {annees > 0 ? `${annees} an${annees > 1 ? 's' : ''}` : ''} {mois > 0 ? `${mois} mois` : ''}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-success" />
                  <span className="text-muted-foreground">Conges restants:</span>
                  <span className="font-medium">{utilisateurConnecte.soldeConges} jours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        variants={itemVariants}
      >
        <div className="p-4 bg-card border border-border rounded-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-sm">
              <CalendarDays className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{utilisateurConnecte.soldeConges}</p>
              <p className="text-xs text-muted-foreground">Conges restants</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-card border border-border rounded-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-sm">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{utilisateurConnecte.soldeRTT}</p>
              <p className="text-xs text-muted-foreground">RTT restants</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-card border border-border rounded-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning/10 rounded-sm">
              <TrendingUp className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalJoursConges}</p>
              <p className="text-xs text-muted-foreground">Jours pris</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-card border border-border rounded-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-sm">
              <FileText className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{documentsApprouves}</p>
              <p className="text-xs text-muted-foreground">Documents obtenus</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Grid informations et activite */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations de contact */}
        <motion.div
          className="p-6 bg-card border border-border rounded-sm lg:col-span-1"
          variants={itemVariants}
        >
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Informations personnelles
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium truncate">{utilisateurConnecte.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Telephone</p>
                <p className="font-medium">{utilisateurConnecte.telephone}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-sm">
                <Building2 className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Departement</p>
                <p className="font-medium">{utilisateurConnecte.departement}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-sm">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Poste</p>
                <p className="font-medium">{utilisateurConnecte.poste}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Date d&apos;embauche</p>
                <p className="font-medium">
                  {format(dateEmbauche, 'd MMMM yyyy', { locale: fr })}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Historique recent */}
        <motion.div
          className="p-6 bg-card border border-border rounded-sm lg:col-span-2"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" />
              Mes demandes recentes
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => definirOngletActif('mes-conges')}
              className="gap-1 text-muted-foreground hover:text-foreground"
            >
              Voir tout <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Indicateurs */}
          <div className="flex flex-wrap gap-4 mb-4 p-3 bg-muted/50 rounded-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-warning rounded-full" />
              <span className="text-sm">{congesEnAttente} en attente</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full" />
              <span className="text-sm">{congesApprouves} approuvees</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-destructive rounded-full" />
              <span className="text-sm">{congesRefuses} refusees</span>
            </div>
          </div>
          
          {dernieresDemandesConges.length > 0 ? (
            <div className="space-y-3">
              {dernieresDemandesConges.map((demande) => (
                <div 
                  key={demande.id}
                  className="flex items-center justify-between p-3 border border-border rounded-sm hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'p-2 rounded-sm',
                      demande.statut === 'approuve' ? 'bg-success/10' :
                      demande.statut === 'en_attente' ? 'bg-warning/10' : 'bg-destructive/10'
                    )}>
                      {demande.statut === 'approuve' ? (
                        <CheckCircle className="w-4 h-4 text-success" />
                      ) : demande.statut === 'en_attente' ? (
                        <Clock className="w-4 h-4 text-warning" />
                      ) : (
                        <XCircle className="w-4 h-4 text-destructive" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{LABELS_TYPE_CONGE[demande.type]}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(parseISO(demande.dateDebut), 'd MMM', { locale: fr })} - {format(parseISO(demande.dateFin), 'd MMM yyyy', { locale: fr })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={cn(
                      'text-xs px-2 py-1 rounded-sm border',
                      COULEURS_STATUT[demande.statut]
                    )}>
                      {LABELS_STATUT[demande.statut]}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {demande.nombreJours} jour{demande.nombreJours > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Aucune demande de conge</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Mes documents */}
      <motion.div
        className="p-6 bg-card border border-border rounded-sm"
        variants={itemVariants}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Mes documents
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => definirOngletActif('mes-documents')}
            className="gap-1 text-muted-foreground hover:text-foreground"
          >
            Voir tout <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        
        {dernieresDemandesDocuments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {dernieresDemandesDocuments.map((demande) => (
              <div 
                key={demande.id}
                className="flex items-center justify-between p-3 border border-border rounded-sm hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-sm">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{LABELS_TYPE_DOCUMENT[demande.typeDocument]}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(parseISO(demande.dateCreation), 'd MMM yyyy', { locale: fr })}
                    </p>
                  </div>
                </div>
                <span className={cn(
                  'text-xs px-2 py-1 rounded-sm border',
                  COULEURS_STATUT[demande.statut]
                )}>
                  {LABELS_STATUT[demande.statut]}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Aucune demande de document</p>
          </div>
        )}
        
        {/* Indicateur documents en attente */}
        {documentsEnAttente > 0 && (
          <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-warning" />
            <p className="text-sm text-warning">
              {documentsEnAttente} document{documentsEnAttente > 1 ? 's' : ''} en attente de traitement
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
