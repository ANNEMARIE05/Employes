'use client'

import { motion } from 'framer-motion'
import { 
  Calendar, 
  FileText, 
  Clock,
  CheckCircle,
  AlertCircle,
  CalendarDays,
  FileCheck,
  ChevronRight,
} from 'lucide-react'
import { CounterCard } from '@/components/ui/animated-number'
import { useAppStore } from '@/store/useAppStore'
import { demandesCongesMock, demandesDocumentsMock, enrichirDemandesConges, enrichirDemandesDocuments } from '@/lib/donnees-mock'
import { LABELS_TYPE_CONGE, LABELS_STATUT, COULEURS_STATUT, LABELS_TYPE_DOCUMENT } from '@/types'
import { format, parseISO } from 'date-fns'
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
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Bannière de bienvenue */}
      <motion.div
        className="relative overflow-hidden bg-sidebar text-sidebar-foreground p-6"
        variants={itemVariants}
      >
        <div className="relative z-10">
          <h2 className="text-xl font-semibold mb-1">
            Bonjour, {utilisateurConnecte?.prenom || 'Utilisateur'}
          </h2>
          <p className="text-sidebar-foreground/70 text-sm">
            Bienvenue sur votre espace personnel
          </p>
        </div>
        
        {/* Décoration géométrique */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2 opacity-20">
          <div className="w-16 h-16 border-2 border-sidebar-primary" />
          <div className="w-8 h-8 bg-sidebar-primary mt-8" />
        </div>
      </motion.div>

      {/* Soldes */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={itemVariants}
      >
        <CounterCard
          icone={<Calendar className="w-5 h-5" />}
          titre="Solde congés"
          valeur={utilisateurConnecte?.soldeConges || 0}
          description="jours disponibles"
          delai={0}
        />
        <CounterCard
          icone={<Clock className="w-5 h-5" />}
          titre="Solde RTT"
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

      {/* Actions rapides */}
      <motion.div variants={itemVariants}>
        <h3 className="text-lg font-semibold mb-4">Actions rapides</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.button
            onClick={() => definirOngletActif('mes-conges')}
            className="p-4 bg-card border border-border rounded-sm hover:border-primary/50 transition-colors text-left group"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-sm">
                <CalendarDays className="w-5 h-5 text-primary" />
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
            </div>
            <p className="font-medium">Demander un congé</p>
            <p className="text-sm text-muted-foreground">Soumettre une nouvelle demande</p>
          </motion.button>

          <motion.button
            onClick={() => definirOngletActif('mes-documents')}
            className="p-4 bg-card border border-border rounded-sm hover:border-primary/50 transition-colors text-left group"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-sm">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
            </div>
            <p className="font-medium">Demander un document</p>
            <p className="text-sm text-muted-foreground">Attestation, fiche de paie...</p>
          </motion.button>

          <motion.button
            onClick={() => definirOngletActif('mon-profil')}
            className="p-4 bg-card border border-border rounded-sm hover:border-primary/50 transition-colors text-left group"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-sm">
                <CheckCircle className="w-5 h-5 text-primary" />
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
            </div>
            <p className="font-medium">Mon profil</p>
            <p className="text-sm text-muted-foreground">Voir mes informations</p>
          </motion.button>

          <motion.button
            onClick={() => definirOngletActif('notifications')}
            className="p-4 bg-card border border-border rounded-sm hover:border-primary/50 transition-colors text-left group"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-sm">
                <AlertCircle className="w-5 h-5 text-primary" />
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
            </div>
            <p className="font-medium">Notifications</p>
            <p className="text-sm text-muted-foreground">Voir les alertes</p>
          </motion.button>
        </div>
      </motion.div>

      {/* Mes dernières demandes de congés */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Mes derniers congés</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => definirOngletActif('mes-conges')}
            className="gap-1"
          >
            Voir tout <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-3">
          {mesConges.length === 0 ? (
            <div className="p-6 bg-card border border-border rounded-sm text-center">
              <Calendar className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-muted-foreground">Aucune demande de congé</p>
            </div>
          ) : (
            mesConges.slice(0, 3).map((conge) => (
              <motion.div
                key={conge.id}
                className="p-4 bg-card border border-border rounded-sm flex items-center gap-4"
                whileHover={{ x: 4 }}
              >
                <div className="flex-1">
                  <p className="font-medium">{LABELS_TYPE_CONGE[conge.type]}</p>
                  <p className="text-sm text-muted-foreground">
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
          <h3 className="text-lg font-semibold">Mes derniers documents</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => definirOngletActif('mes-documents')}
            className="gap-1"
          >
            Voir tout <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-3">
          {mesDocuments.length === 0 ? (
            <div className="p-6 bg-card border border-border rounded-sm text-center">
              <FileText className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-muted-foreground">Aucune demande de document</p>
            </div>
          ) : (
            mesDocuments.slice(0, 3).map((doc) => (
              <motion.div
                key={doc.id}
                className="p-4 bg-card border border-border rounded-sm flex items-center gap-4"
                whileHover={{ x: 4 }}
              >
                <div className="flex-1">
                  <p className="font-medium">{LABELS_TYPE_DOCUMENT[doc.typeDocument]}</p>
                  <p className="text-sm text-muted-foreground">
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
