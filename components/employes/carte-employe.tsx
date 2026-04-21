'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, Building2, Calendar, Eye, Edit } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Employe } from '@/types'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

interface CarteEmployeProps {
  employe: Employe
  index: number
  onVoirDetail?: () => void
  onModifier?: () => void
}

const STATUT_STYLES: Record<Employe['statut'], { label: string; classe: string }> = {
  actif: { label: 'Actif', classe: 'bg-success/10 text-success border-success/20' },
  conge: { label: 'En conge', classe: 'bg-primary/10 text-primary border-primary/20' },
  absent: { label: 'Absent', classe: 'bg-destructive/10 text-destructive border-destructive/20' },
  demission: { label: 'Demission', classe: 'bg-muted text-muted-foreground border-muted' },
}

export function CarteEmploye({ employe, index, onVoirDetail, onModifier }: CarteEmployeProps) {
  const statutInfo = STATUT_STYLES[employe.statut]

  return (
    <motion.div
      className="luxury-panel group rounded-xl p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -4 }}
    >
      {/* Header avec avatar et actions */}
      <div className="flex items-start justify-between mb-4">
        <motion.img
          src={employe.avatar}
          alt={`${employe.prenom} ${employe.nom}`}
          className="w-14 h-14 rounded-sm object-cover border border-border"
          whileHover={{ scale: 1.05 }}
        />
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={onVoirDetail}
            className="p-1.5 rounded-sm hover:bg-muted transition-colors"
            title="Voir detail"
          >
            <Eye className="w-4 h-4 text-muted-foreground" />
          </button>
          <button 
            onClick={onModifier}
            className="p-1.5 rounded-sm hover:bg-muted transition-colors"
            title="Modifier"
          >
            <Edit className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Nom et poste */}
      <div className="mb-3">
        <h3 
          className="font-semibold text-foreground group-hover:text-primary transition-colors cursor-pointer"
          onClick={onVoirDetail}
        >
          {employe.prenom} {employe.nom}
        </h3>
        <p className="text-sm text-muted-foreground">{employe.poste}</p>
      </div>

      {/* Badge statut */}
      <div className="mb-4">
        <span className={cn(
          'inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-sm border',
          statutInfo.classe
        )}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {statutInfo.label}
        </span>
      </div>

      {/* Infos */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Building2 className="w-4 h-4" />
          <span className="truncate">{employe.departement}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Mail className="w-4 h-4" />
          <span className="truncate">{employe.email}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>Depuis {format(parseISO(employe.dateEmbauche), 'MMM yyyy', { locale: fr })}</span>
        </div>
      </div>

      {/* Solde conges */}
      <div className="mt-4 pt-4 border-t border-border flex justify-between text-sm">
        <div>
          <span className="text-muted-foreground">Conges</span>
          <p className="font-medium">{employe.soldeConges}j</p>
        </div>
        <div className="text-right">
          <span className="text-muted-foreground">RTT</span>
          <p className="font-medium">{employe.soldeRTT}j</p>
        </div>
      </div>
    </motion.div>
  )
}
