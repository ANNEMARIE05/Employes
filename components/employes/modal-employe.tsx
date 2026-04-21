'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppModalPortal, AppModalShell } from '@/components/ui/app-modal'
import { X, Save, User, Mail, Phone, Building2, Briefcase, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Loader } from '@/components/ui/loader'
import type { Employe } from '@/types'
import { departementsMock } from '@/lib/donnees-mock'

interface ModalEmployeProps {
  employe?: Employe | null
  mode: 'creation' | 'edition' | 'detail'
  onFermer: () => void
  onSauvegarder?: (donnees: Partial<Employe>) => void
}

export function ModalEmploye({ employe, mode, onFermer, onSauvegarder }: ModalEmployeProps) {
  const [chargement, setChargement] = useState(false)
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    poste: '',
    departement: '',
    dateEmbauche: new Date().toISOString().split('T')[0],
    statut: 'actif' as Employe['statut'],
    soldeConges: 25,
    soldeRTT: 10,
  })

  useEffect(() => {
    if (employe && (mode === 'edition' || mode === 'detail')) {
      setFormData({
        prenom: employe.prenom,
        nom: employe.nom,
        email: employe.email,
        telephone: employe.telephone,
        poste: employe.poste,
        departement: employe.departement,
        dateEmbauche: employe.dateEmbauche.split('T')[0],
        statut: employe.statut,
        soldeConges: employe.soldeConges,
        soldeRTT: employe.soldeRTT,
      })
    }
  }, [employe, mode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'detail') return

    setChargement(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    onSauvegarder?.({
      ...formData,
      id: employe?.id || crypto.randomUUID(),
      avatar: employe?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.prenom}`,
    })
    
    setChargement(false)
    onFermer()
  }

  const isReadOnly = mode === 'detail'

  const titres = {
    creation: 'Nouvel employé',
    edition: 'Modifier l\'employé',
    detail: 'Détails de l\'employé',
  }

  return (
    <AppModalPortal>
      <AnimatePresence>
        <AppModalShell key="modal-employe" onOverlayClick={onFermer} panelClassName="max-w-2xl">
        <motion.div
          className="w-full max-h-[min(90dvh,calc(100vh-6rem))] overflow-y-auto rounded-md border border-border bg-card shadow-xl"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
        >
          {/* Header */}
          <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-card z-10">
            <h2 className="text-xl font-semibold">{titres[mode]}</h2>
            <button
              onClick={onFermer}
              className="p-2 hover:bg-muted rounded-sm transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Contenu */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Avatar pour mode detail */}
            {mode === 'detail' && employe && (
              <div className="flex items-center gap-4 pb-6 border-b border-border">
                <img
                  src={employe.avatar}
                  alt={`${employe.prenom} ${employe.nom}`}
                  className="w-20 h-20 rounded-sm object-cover border border-border"
                />
                <div>
                  <h3 className="text-lg font-semibold">{employe.prenom} {employe.nom}</h3>
                  <p className="text-muted-foreground">{employe.poste}</p>
                  <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-sm mt-2 ${
                    employe.statut === 'actif' ? 'bg-success/10 text-success' :
                    employe.statut === 'conge' ? 'bg-primary/10 text-primary' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {employe.statut === 'actif' ? 'Actif' : employe.statut === 'conge' ? 'En congé' : employe.statut}
                  </span>
                </div>
              </div>
            )}

            {/* Informations personnelles */}
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <User className="w-4 h-4" />
                Informations personnelles
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Prénom</label>
                  <input
                    type="text"
                    value={formData.prenom}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    readOnly={isReadOnly}
                    required
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary read-only:bg-muted"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nom</label>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    readOnly={isReadOnly}
                    required
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary read-only:bg-muted"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    readOnly={isReadOnly}
                    required
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary read-only:bg-muted"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    readOnly={isReadOnly}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary read-only:bg-muted"
                  />
                </div>
              </div>
            </div>

            {/* Informations professionnelles */}
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Informations professionnelles
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Poste</label>
                  <input
                    type="text"
                    value={formData.poste}
                    onChange={(e) => setFormData({ ...formData, poste: e.target.value })}
                    readOnly={isReadOnly}
                    required
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary read-only:bg-muted"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Département
                  </label>
                  {isReadOnly ? (
                    <input
                      type="text"
                      value={formData.departement}
                      readOnly
                      className="w-full px-4 py-2.5 bg-muted border border-border rounded-sm text-sm"
                    />
                  ) : (
                    <select
                      value={formData.departement}
                      onChange={(e) => setFormData({ ...formData, departement: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="">Sélectionner</option>
                      {departementsMock.map(dep => (
                        <option key={dep.id} value={dep.nom}>{dep.nom}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date d&apos;embauche
                  </label>
                  <input
                    type="date"
                    value={formData.dateEmbauche}
                    onChange={(e) => setFormData({ ...formData, dateEmbauche: e.target.value })}
                    readOnly={isReadOnly}
                    required
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary read-only:bg-muted"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Statut</label>
                  {isReadOnly ? (
                    <input
                      type="text"
                      value={formData.statut === 'actif' ? 'Actif' : formData.statut === 'conge' ? 'En congé' : formData.statut}
                      readOnly
                      className="w-full px-4 py-2.5 bg-muted border border-border rounded-sm text-sm"
                    />
                  ) : (
                    <select
                      value={formData.statut}
                      onChange={(e) => setFormData({ ...formData, statut: e.target.value as Employe['statut'] })}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="actif">Actif</option>
                      <option value="conge">En congé</option>
                      <option value="absent">Absent</option>
                      <option value="demission">Démission</option>
                    </select>
                  )}
                </div>
              </div>
            </div>

            {/* Soldes congés */}
            <div className="space-y-4">
              <h3 className="font-medium">Soldes de congés</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Congés payés (jours)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.soldeConges}
                    onChange={(e) => setFormData({ ...formData, soldeConges: parseInt(e.target.value) || 0 })}
                    readOnly={isReadOnly}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary read-only:bg-muted"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">RTT (jours)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.soldeRTT}
                    onChange={(e) => setFormData({ ...formData, soldeRTT: parseInt(e.target.value) || 0 })}
                    readOnly={isReadOnly}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary read-only:bg-muted"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            {mode !== 'detail' && (
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onFermer}
                  className="rounded-sm"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={chargement}
                  className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm"
                >
                  {chargement ? (
                    <Loader taille="sm" variante="spinner" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {mode === 'creation' ? 'Créer' : 'Enregistrer'}
                    </>
                  )}
                </Button>
              </div>
            )}
          </form>
        </motion.div>
        </AppModalShell>
      </AnimatePresence>
    </AppModalPortal>
  )
}
