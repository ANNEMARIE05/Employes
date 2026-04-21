'use client'

import { motion } from 'framer-motion'
import { 
  Calendar, 
  FileText, 
  Clock,
  CheckCircle,
  CalendarDays,
  FileCheck,
  ChevronRight,
} from 'lucide-react'
import { CounterCard } from '@/components/ui/animated-number'
import { useAppStore } from '@/store/useAppStore'
import { demandesCongesMock, demandesDocumentsMock, enrichirDemandesConges, enrichirDemandesDocuments } from '@/lib/donnees-mock'
import { LABELS_TYPE_CONGE, LABELS_STATUT, COULEURS_STATUT, LABELS_TYPE_DOCUMENT } from '@/types'
import { format, parseISO, differenceInDays } from 'date-fns'
import { fr } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

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

export function TableauBordEmploye() {
  const { utilisateurConnecte, definirOngletActif } = useAppStore()

  // Filtrer les demandes de l'employe connecte
  const mesConges = enrichirDemandesConges(
    demandesCongesMock.filter(d => d.employeId === utilisateurConnecte?.id)
  )
  const mesDocuments = enrichirDemandesDocuments(
    demandesDocumentsMock.filter(d => d.employeId === utilisateurConnecte?.id)
  )

  const congesEnAttente = mesConges.filter(c => c.statut === 'en_attente').length
  const congesApprouves = mesConges.filter(c => c.statut === 'approuve').length
  const documentsEnAttente = mesDocuments.filter(d => d.statut === 'en_attente').length

  return (
    <motion.div
      className="space-y-4 sm:space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Carte hero employe */}
      <motion.div variants={itemVariants}>
        <Card className="luxury-panel py-0">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-4">
              <div className="flex min-w-0 flex-1 gap-2.5 sm:gap-3">
                <img
                  src={utilisateurConnecte?.avatar}
                  alt={`${utilisateurConnecte?.prenom} ${utilisateurConnecte?.nom}`}
                  className="h-11 w-11 shrink-0 rounded-md border border-border/70 object-cover shadow-sm sm:h-12 sm:w-12"
                />
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="truncate text-sm font-semibold sm:text-base">
                      {utilisateurConnecte?.prenom} {utilisateurConnecte?.nom}
                    </span>
                    <span className="data-chip shrink-0 text-primary">Espace Employe</span>
                  </div>
                  <h2 className="text-base font-semibold leading-tight sm:text-lg">
                    Bonjour, {utilisateurConnecte?.prenom || 'Utilisateur'}
                  </h2>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    {utilisateurConnecte?.poste} - {utilisateurConnecte?.departement}
                  </p>
                  {(congesEnAttente > 0 || documentsEnAttente > 0) && (
                    <div className="flex items-center gap-1.5 rounded-md border border-border/60 bg-muted/50 px-2 py-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 shrink-0 text-primary" />
                      <span>
                        {congesEnAttente > 0 && `${congesEnAttente} conge${congesEnAttente > 1 ? 's' : ''} en attente`}
                        {congesEnAttente > 0 && documentsEnAttente > 0 && ' - '}
                        {documentsEnAttente > 0 && `${documentsEnAttente} document${documentsEnAttente > 1 ? 's' : ''} en attente`}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:min-w-[240px] lg:border-l lg:border-border/60 lg:pl-3">
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Actions rapides
                </p>
                <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-3 lg:grid-cols-1">
                  <motion.button
                    type="button"
                    onClick={() => definirOngletActif('mes-conges')}
                    className="group flex w-full items-start gap-2 rounded-md border border-border/70 bg-background/60 px-2.5 py-2 text-left transition-colors hover:bg-muted/60"
                    whileHover={{ y: -1 }}
                  >
                    <div className="rounded-md bg-primary/10 p-1.5">
                      <CalendarDays className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-snug">Demander un conge</p>
                      <p className="text-[11px] leading-snug text-muted-foreground">Nouvelle demande</p>
                    </div>
                    <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-primary" />
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={() => definirOngletActif('mes-documents')}
                    className="group flex w-full items-start gap-2 rounded-md border border-border/70 bg-background/60 px-2.5 py-2 text-left transition-colors hover:bg-muted/60"
                    whileHover={{ y: -1 }}
                  >
                    <div className="rounded-md bg-primary/10 p-1.5">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-snug">Demander un document</p>
                      <p className="text-[11px] leading-snug text-muted-foreground">Attestation, paie...</p>
                    </div>
                    <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-primary" />
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={() => definirOngletActif('mon-profil')}
                    className="group flex w-full items-start gap-2 rounded-md border border-border/70 bg-background/60 px-2.5 py-2 text-left transition-colors hover:bg-muted/60"
                    whileHover={{ y: -1 }}
                  >
                    <div className="rounded-md bg-primary/10 p-1.5">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-snug">Mon profil</p>
                      <p className="text-[11px] leading-snug text-muted-foreground">Mes informations</p>
                    </div>
                    <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-primary" />
                  </motion.button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Jours disponibles */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        variants={itemVariants}
      >
        <CounterCard
          icone={<Calendar className="w-5 h-5" />}
          titre="Congés restants"
          valeur={utilisateurConnecte?.soldeConges || 0}
          description="jours disponibles"
          delai={0}
        />
        <CounterCard
          icone={<Clock className="w-5 h-5" />}
          titre="RTT restants"
          valeur={utilisateurConnecte?.soldeRTT || 0}
          description="jours disponibles"
          delai={0.1}
        />
        <CounterCard
          icone={<CalendarDays className="w-5 h-5" />}
          titre="Demandes en attente"
          valeur={congesEnAttente}
          description="congés à valider"
          delai={0.2}
        />
        <CounterCard
          icone={<FileCheck className="w-5 h-5" />}
          titre="Documents en attente"
          valeur={documentsEnAttente}
          description="à traiter"
          delai={0.3}
        />
      </motion.div>

      {/* Mes dernières demandes de congés */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-semibold">Mes derniers congés</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => definirOngletActif('mes-conges')}
            className="gap-1"
          >
            Voir tout <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-2.5 sm:space-y-3">
          {mesConges.length === 0 ? (
            <div className="luxury-panel rounded-xl p-4 text-center sm:p-6">
              <Calendar className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-muted-foreground">Aucune demande de congé</p>
            </div>
          ) : (
            mesConges.slice(0, 3).map((conge) => (
              <motion.div
                key={conge.id}
                className="luxury-panel flex items-center gap-3 rounded-xl p-3 sm:gap-4 sm:p-4"
                whileHover={{ x: 4 }}
              >
                <div className="flex-1">
                  <p className="text-sm sm:text-base font-medium">{LABELS_TYPE_CONGE[conge.type]}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {format(parseISO(conge.dateDebut), 'd MMM', { locale: fr })} - {format(parseISO(conge.dateFin), 'd MMM yyyy', { locale: fr })}
                    <span className="ml-2">({conge.nombreJours} jour{conge.nombreJours > 1 ? 's' : ''})</span>
                  </p>
                </div>
                <span className={cn(
                  'text-xs px-3 py-1.5 rounded-sm border font-medium',
                  COULEURS_STATUT[conge.statut]
                )}>
                  {LABELS_STATUT[conge.statut]}
                </span>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* Mes dernières demandes de documents */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-semibold">Mes derniers documents</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => definirOngletActif('mes-documents')}
            className="gap-1"
          >
            Voir tout <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-2.5 sm:space-y-3">
          {mesDocuments.length === 0 ? (
            <div className="luxury-panel rounded-xl p-4 text-center sm:p-6">
              <FileText className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-muted-foreground">Aucune demande de document</p>
            </div>
          ) : (
            mesDocuments.slice(0, 3).map((doc) => (
              <motion.div
                key={doc.id}
                className="luxury-panel flex items-center gap-3 rounded-xl p-3 sm:gap-4 sm:p-4"
                whileHover={{ x: 4 }}
              >
                <div className="flex-1">
                  <p className="text-sm sm:text-base font-medium">{LABELS_TYPE_DOCUMENT[doc.typeDocument]}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Demandé le {format(parseISO(doc.dateCreation), 'd MMMM yyyy', { locale: fr })}
                  </p>
                </div>
                <span className={cn(
                  'text-xs px-3 py-1.5 rounded-sm border font-medium',
                  COULEURS_STATUT[doc.statut]
                )}>
                  {LABELS_STATUT[doc.statut]}
                </span>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
