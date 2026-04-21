'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AppModalPortal, AppModalShell } from '@/components/ui/app-modal'
import { X, FileText, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LABELS_TYPE_DOCUMENT, type TypeDocument } from '@/types'
import { Loader } from '@/components/ui/loader'
import { employesMock } from '@/lib/donnees-mock'

interface FormulaireDocumentProps {
  onFermer: () => void
  afficherSelectionEmploye?: boolean
}

export function FormulaireDocument({ onFermer, afficherSelectionEmploye = false }: FormulaireDocumentProps) {
  const [chargement, setChargement] = useState(false)
  const [formData, setFormData] = useState({
    employeId: employesMock[0]?.id ?? '',
    typeDocument: 'attestation_emploi' as TypeDocument,
    commentaire: '',
    urgent: false,
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
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">Demande de document</h2>
              <p className="text-sm text-muted-foreground">Sélectionnez le type de document</p>
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

          {/* Type de document */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Type de document</label>
            <select
              value={formData.typeDocument}
              onChange={(e) => setFormData({ ...formData, typeDocument: e.target.value as TypeDocument })}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {Object.entries(LABELS_TYPE_DOCUMENT).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* Commentaire */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Commentaire (optionnel)</label>
            <textarea
              value={formData.commentaire}
              onChange={(e) => setFormData({ ...formData, commentaire: e.target.value })}
              placeholder="Précisez l'usage ou des informations particulières..."
              rows={3}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          {/* Urgent */}
          <label className="flex items-center gap-3 p-4 bg-muted/50 rounded-sm cursor-pointer hover:bg-muted transition-colors">
            <input
              type="checkbox"
              checked={formData.urgent}
              onChange={(e) => setFormData({ ...formData, urgent: e.target.checked })}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
            />
            <div>
              <p className="text-sm font-medium">Demande urgente</p>
              <p className="text-xs text-muted-foreground">Le document sera traité en priorité</p>
            </div>
          </label>

          {/* Info délai */}
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-sm">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Délai de traitement :</span> 2-3 jours ouvrés
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Vous serez notifié par email lorsque votre document sera disponible.
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
