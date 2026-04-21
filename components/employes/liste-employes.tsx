'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Mail, 
  Phone,
  Building2,
  MoreHorizontal,
  UserPlus,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { employesMock, departementsMock } from '@/lib/donnees-mock'
import { Button } from '@/components/ui/button'
import { CarteEmploye } from './carte-employe'
import { LigneEmploye } from './ligne-employe'

type VueType = 'grille' | 'liste'

export function ListeEmployes() {
  const [vue, setVue] = useState<VueType>('grille')
  const [recherche, setRecherche] = useState('')
  const [departementFiltre, setDepartementFiltre] = useState('')

  // Filtrer les employés
  const employesFiltres = employesMock.filter(employe => {
    const correspondRecherche = 
      `${employe.prenom} ${employe.nom}`.toLowerCase().includes(recherche.toLowerCase()) ||
      employe.email.toLowerCase().includes(recherche.toLowerCase()) ||
      employe.poste.toLowerCase().includes(recherche.toLowerCase())
    
    const correspondDepartement = 
      !departementFiltre || employe.departement === departementFiltre
    
    return correspondRecherche && correspondDepartement
  })

  const statsEmployes = {
    total: employesMock.length,
    actifs: employesMock.filter(e => e.statut === 'actif').length,
    enConge: employesMock.filter(e => e.statut === 'conge').length,
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="p-4 bg-card border border-border rounded-sm">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-semibold">{statsEmployes.total}</p>
        </div>
        <div className="p-4 bg-card border border-border rounded-sm">
          <p className="text-sm text-muted-foreground">Actifs</p>
          <p className="text-2xl font-semibold text-success">{statsEmployes.actifs}</p>
        </div>
        <div className="p-4 bg-card border border-border rounded-sm">
          <p className="text-sm text-muted-foreground">En congé</p>
          <p className="text-2xl font-semibold text-primary">{statsEmployes.enConge}</p>
        </div>
      </motion.div>

      {/* Barre d'outils */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-1 gap-3 w-full sm:w-auto">
          {/* Recherche */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher un employé..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Filtre département */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select
              value={departementFiltre}
              onChange={(e) => setDepartementFiltre(e.target.value)}
              className="pl-10 pr-8 py-2 bg-background border border-border rounded-sm text-sm appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Tous les départements</option>
              {departementsMock.map(dep => (
                <option key={dep.id} value={dep.nom}>{dep.nom}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle vue */}
          <div className="flex border border-border rounded-sm overflow-hidden">
            <button
              onClick={() => setVue('grille')}
              className={cn(
                'p-2 transition-colors',
                vue === 'grille' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              )}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setVue('liste')}
              className={cn(
                'p-2 transition-colors',
                vue === 'liste' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Bouton ajouter */}
          <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm">
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Ajouter</span>
          </Button>
        </div>
      </motion.div>

      {/* Liste des employés */}
      <AnimatePresence mode="wait">
        {vue === 'grille' ? (
          <motion.div
            key="grille"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {employesFiltres.map((employe, index) => (
              <CarteEmploye key={employe.id} employe={employe} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="liste"
            className="bg-card border border-border rounded-sm overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* En-tête tableau */}
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-muted/30 text-sm font-medium text-muted-foreground">
              <div className="col-span-4">Employé</div>
              <div className="col-span-2">Département</div>
              <div className="col-span-2">Poste</div>
              <div className="col-span-2">Statut</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
            {/* Lignes */}
            {employesFiltres.map((employe, index) => (
              <LigneEmploye key={employe.id} employe={employe} index={index} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message si aucun résultat */}
      {employesFiltres.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">Aucun employé trouvé</p>
          <p className="text-sm text-muted-foreground/70">
            Essayez de modifier vos critères de recherche
          </p>
        </motion.div>
      )}
    </div>
  )
}
