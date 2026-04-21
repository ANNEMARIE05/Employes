'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ModalConfirmationProps {
  ouvert: boolean
  onFermer: () => void
  onConfirmer: () => void
  titre: string
  message: string
  labelConfirmer?: string
  labelAnnuler?: string
  variante?: 'danger' | 'warning' | 'info'
  chargement?: boolean
}

export function ModalConfirmation({
  ouvert,
  onFermer,
  onConfirmer,
  titre,
  message,
  labelConfirmer = 'Confirmer',
  labelAnnuler = 'Annuler',
  variante = 'danger',
  chargement = false,
}: ModalConfirmationProps) {
  const couleurs = {
    danger: {
      icone: 'bg-destructive/10 text-destructive',
      bouton: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    },
    warning: {
      icone: 'bg-warning/10 text-warning',
      bouton: 'bg-warning text-warning-foreground hover:bg-warning/90',
    },
    info: {
      icone: 'bg-primary/10 text-primary',
      bouton: 'bg-primary text-primary-foreground hover:bg-primary/90',
    },
  }

  return (
    <AnimatePresence>
      {ouvert && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 overflow-y-auto bg-foreground/20 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onFermer}
        >
          <motion.div
            className="w-full max-w-md bg-card border border-border rounded-sm shadow-xl overflow-hidden my-auto"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start gap-4 p-6 pb-4">
              <div className={`p-3 ${couleurs[variante].icone}`}>
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{titre}</h3>
                <p className="text-sm text-muted-foreground mt-1">{message}</p>
              </div>
              <button
                onClick={onFermer}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 p-6 pt-4 bg-muted/30 border-t border-border">
              <Button
                variant="outline"
                onClick={onFermer}
                disabled={chargement}
                className="rounded-sm"
              >
                {labelAnnuler}
              </Button>
              <Button
                onClick={onConfirmer}
                disabled={chargement}
                className={`rounded-sm ${couleurs[variante].bouton}`}
              >
                {chargement ? (
                  <motion.span
                    className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                ) : (
                  labelConfirmer
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
