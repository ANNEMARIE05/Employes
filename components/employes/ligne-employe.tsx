'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Employe } from '@/types'
import { useState } from 'react'

interface LigneEmployeProps {
  employe: Employe
  index: number
  onVoirDetail?: () => void
  onModifier?: () => void
  onSupprimer?: () => void
}

const STATUT_STYLES: Record<Employe['statut'], { label: string; classe: string }> = {
  actif: { label: 'Actif', classe: 'bg-success/10 text-success' },
  conge: { label: 'En conge', classe: 'bg-primary/10 text-primary' },
  absent: { label: 'Absent', classe: 'bg-destructive/10 text-destructive' },
  demission: { label: 'Demission', classe: 'bg-muted text-muted-foreground' },
}

export function LigneEmploye({ employe, index, onVoirDetail, onModifier, onSupprimer }: LigneEmployeProps) {
  const [menuOuvert, setMenuOuvert] = useState(false)
  const statutInfo = STATUT_STYLES[employe.statut]

  return (
    <motion.div
      className="list-row-luxe grid grid-cols-12 items-center gap-4 border-b border-border/60 px-5 py-3.5 last:border-0 transition-all duration-300 hover:bg-muted/25 group"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      {/* Employe */}
      <div className="col-span-4 flex items-center gap-3">
        <img
          src={employe.avatar}
          alt={`${employe.prenom} ${employe.nom}`}
          className="h-11 w-11 rounded-lg border border-border/60 object-cover shadow-sm"
        />
        <div className="min-w-0">
          <p 
            className="font-medium truncate cursor-pointer hover:text-primary transition-colors"
            onClick={onVoirDetail}
          >
            {employe.prenom} {employe.nom}
          </p>
          <p className="text-xs text-muted-foreground truncate">{employe.email}</p>
        </div>
      </div>

      {/* Departement */}
      <div className="col-span-2 text-sm text-muted-foreground truncate">
        {employe.departement}
      </div>

      {/* Poste */}
      <div className="col-span-2 text-sm truncate">
        {employe.poste}
      </div>

      {/* Statut */}
      <div className="col-span-2">
        <span className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium',
          statutInfo.classe
        )}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {statutInfo.label}
        </span>
      </div>

      {/* Actions */}
      <div className="col-span-2 flex justify-end gap-1">
        <motion.button
          onClick={onVoirDetail}
          className="rounded-md p-2 opacity-0 transition-all hover:bg-muted group-hover:opacity-100"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="Voir detail"
        >
          <Eye className="w-4 h-4 text-muted-foreground" />
        </motion.button>
        <motion.button
          onClick={onModifier}
          className="rounded-md p-2 opacity-0 transition-all hover:bg-muted group-hover:opacity-100"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="Modifier"
        >
          <Edit className="w-4 h-4 text-muted-foreground" />
        </motion.button>
        <div className="relative">
          <motion.button
            className="rounded-md p-2 opacity-0 transition-all hover:bg-muted group-hover:opacity-100"
            onClick={() => setMenuOuvert(!menuOuvert)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
          </motion.button>
          
          {menuOuvert && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setMenuOuvert(false)}
              />
              <motion.div
                className="absolute right-0 top-full z-20 mt-1 min-w-[140px] rounded-lg border border-border/70 bg-popover/95 py-1 shadow-xl backdrop-blur"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <button 
                  className="w-full px-3 py-2 text-sm text-left hover:bg-muted flex items-center gap-2"
                  onClick={() => {
                    setMenuOuvert(false)
                    window.location.href = `mailto:${employe.email}`
                  }}
                >
                  <Mail className="w-4 h-4" /> Contacter
                </button>
                <button 
                  className="w-full px-3 py-2 text-sm text-left hover:bg-muted flex items-center gap-2"
                  onClick={() => {
                    setMenuOuvert(false)
                    window.location.href = `tel:${employe.telephone}`
                  }}
                >
                  <Phone className="w-4 h-4" /> Appeler
                </button>
                <div className="border-t border-border my-1" />
                <button 
                  className="w-full px-3 py-2 text-sm text-left hover:bg-destructive/10 text-destructive flex items-center gap-2"
                  onClick={() => {
                    setMenuOuvert(false)
                    onSupprimer?.()
                  }}
                >
                  <Trash2 className="w-4 h-4" /> Supprimer
                </button>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}
