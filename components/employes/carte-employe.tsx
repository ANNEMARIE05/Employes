'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, Building2, Calendar, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Employe } from '@/types'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

interface CarteEmployeProps {
  employe: Employe
  index: number
}

const STATUT_STYLES: Record<Employe['statut'], { label: string; classe: string }> = {
  actif: { label: 'Actif', classe: 'bg-success/10 text-success border-success/20' },
  conge: { label: 'En congé', classe: 'bg-primary/10 text-primary border-primary/20' },
  absent: { label: 'Absent', classe: 'bg-destructive/10 text-destructive border-destructive/20' },
  demission: { label: 'Démission', classe: 'bg-muted text-muted-foreground border-muted' },
}

export function CarteEmploye({ employe, index }: CarteEmployeProps) {
  const statutInfo = STATUT_STYLES[employe.statut]

  return (
    <motion.div
      className="group p-5 bg-card border border-border rounded-sm hover:border-primary/30 hover:shadow-sm transition-all duration-300 cursor-pointer"
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
        <button className="p-1.5 opacity-0 group-hover:opacity-100 transition-opacity rounded-sm hover:bg-muted">
          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Nom et poste */}
      <div className="mb-3">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
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

      {/* Solde congés */}
      <div className="mt-4 pt-4 border-t border-border flex justify-between text-sm">
        <div>
          <span className="text-muted-foreground">Congés</span>
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
