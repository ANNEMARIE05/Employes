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
} from 'lucide-react'
import { CounterCard } from '@/components/ui/animated-number'
import { GraphiqueEffectif } from './graphique-effectif'
import { GraphiqueDepartements } from './graphique-departements'
import { DemandesRecentes } from './demandes-recentes'
import { EmployesEnConge } from './employes-en-conge'
import { statistiquesMock } from '@/lib/donnees-mock'
import { useAppStore } from '@/store/useAppStore'

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
  const { utilisateurConnecte } = useAppStore()

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
            Vous avez <span className="text-sidebar-primary font-medium">{stats.demandesEnAttente} demandes</span> en attente de traitement
          </p>
        </div>
        
        {/* Décoration géométrique */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2 opacity-20">
          <div className="w-16 h-16 border-2 border-sidebar-primary" />
          <div className="w-8 h-8 bg-sidebar-primary mt-8" />
        </div>
      </motion.div>

      {/* Cartes statistiques */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={itemVariants}
      >
        <CounterCard
          icone={<Users className="w-5 h-5" />}
          titre="Total employés"
          valeur={stats.totalEmployes}
          description={`${stats.employesActifs} actifs`}
          tendance={{ valeur: 5.2, positif: true }}
          delai={0}
        />
        <CounterCard
          icone={<Calendar className="w-5 h-5" />}
          titre="En congé"
          valeur={stats.employesEnConge}
          description="Cette semaine"
          delai={0.1}
        />
        <CounterCard
          icone={<Clock className="w-5 h-5" />}
          titre="Demandes en attente"
          valeur={stats.demandesEnAttente}
          description="À traiter"
          tendance={{ valeur: 2, positif: false }}
          delai={0.2}
        />
        <CounterCard
          icone={<TrendingUp className="w-5 h-5" />}
          titre="Taux d'absentéisme"
          valeur={stats.tauxAbsenteisme}
          format="pourcentage"
          description="Ce mois-ci"
          tendance={{ valeur: 0.5, positif: false }}
          delai={0.3}
        />
      </motion.div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div 
          className="lg:col-span-2"
          variants={itemVariants}
        >
          <GraphiqueEffectif donnees={stats.evolutionEffectif} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <GraphiqueDepartements donnees={stats.repartitionDepartements} />
        </motion.div>
      </div>

      {/* Actions rapides et demandes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div variants={itemVariants}>
          <DemandesRecentes />
        </motion.div>
        <motion.div variants={itemVariants}>
          <EmployesEnConge />
        </motion.div>
      </div>

      {/* Résumé du mois */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        variants={itemVariants}
      >
        <div className="p-5 bg-card border border-border h-[100px] flex items-center gap-4">
          <div className="p-3 bg-success/10">
            <CheckCircle className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="text-2xl font-semibold">{stats.congesApprouvesCeMois}</p>
            <p className="text-sm text-muted-foreground">Congés approuvés ce mois</p>
          </div>
        </div>
        
        <div className="p-5 bg-card border border-border h-[100px] flex items-center gap-4">
          <div className="p-3 bg-primary/10">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-semibold">{stats.documentsTraitesCeMois}</p>
            <p className="text-sm text-muted-foreground">Documents traités</p>
          </div>
        </div>
        
        <div className="p-5 bg-card border border-border h-[100px] flex items-center gap-4">
          <div className="p-3 bg-warning/10">
            <AlertCircle className="w-5 h-5 text-warning" />
          </div>
          <div>
            <p className="text-2xl font-semibold">3</p>
            <p className="text-sm text-muted-foreground">Contrats à renouveler</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
