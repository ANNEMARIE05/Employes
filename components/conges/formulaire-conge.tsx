'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AppModalPortal, AppModalShell } from '@/components/ui/app-modal'
import { X, Calendar, FileText, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LABELS_TYPE_CONGE, type TypeConge } from '@/types'
import { Loader } from '@/components/ui/loader'
import { employesMock } from '@/lib/donnees-mock'

interface FormulaireCongeProps {
  onFermer: () => void
  afficherSelectionEmploye?: boolean
}

export function FormulaireConge({ onFermer, afficherSelectionEmploye = false }: FormulaireCongeProps) {
  const [chargement, setChargement] = useState(false)
  const [formData, setFormData] = useState({
    employeId: employesMock[0]?.id ?? '',
    typeConge: 'conge_paye' as TypeConge,
    dateDebut: '',
    dateFin: '',
    motif: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setChargement(true)
    
    // Simulation envoi
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setChargement(false)
    onFermer()
  }

  return (
    <AppModalPortal>
      <AppModalShell onOverlayClick={onFermer} panelClassName="max-w-lg">
      <motion.div
        className="w-full max-h-[min(90dvh,calc(100vh-6rem))] overflow-y-auto rounded-md border border-border bg-card shadow-xl"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-sm">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">Nouvelle demande de congé</h2>
              <p className="text-sm text-muted-foreground">Remplissez les informations</p>
            </div>
          </div>
          <button
            onClick={onFermer}
            className="p-2 hover:bg-muted rounded-sm transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {afficherSelectionEmploye && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Employe concerne</label>
              <select
                value={formData.employeId}
                onChange={(e) => setFormData({ ...formData, employeId: e.target.value })}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                required
              >
                {employesMock.map((employe) => (
                  <option key={employe.id} value={employe.id}>
                    {employe.prenom} {employe.nom}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Type de congé */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Type de congé</label>
            <select
              value={formData.typeConge}
              onChange={(e) => setFormData({ ...formData, typeConge: e.target.value as TypeConge })}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {Object.entries(LABELS_TYPE_CONGE).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date de début</label>
              <input
                type="date"
                value={formData.dateDebut}
                onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date de fin</label>
              <input
                type="date"
                value={formData.dateFin}
                onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
          </div>

          {/* Motif */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Motif (optionnel)</label>
            <textarea
              value={formData.motif}
              onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
              placeholder="Précisez le motif de votre demande..."
              rows={3}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          {/* Info jours disponibles */}
          <div className="p-4 bg-muted/50 rounded-sm">
            <p className="text-sm text-muted-foreground">
              Jours disponibles actuellement : <span className="font-medium text-foreground">25 jours</span> de congés payés et <span className="font-medium text-foreground">10 jours</span> de RTT
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onFermer}
              className="flex-1 rounded-sm"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={chargement}
              className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm"
            >
              {chargement ? (
                <Loader taille="sm" variante="spinner" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Envoyer
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
      </AppModalShell>
    </AppModalPortal>
  )
}
