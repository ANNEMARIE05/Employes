'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  UserPlus,
  SlidersHorizontal,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { employesMock, departementsMock } from '@/lib/donnees-mock'
import { Button } from '@/components/ui/button'
import { CarteEmploye } from './carte-employe'
import { LigneEmploye } from './ligne-employe'
import { ModalEmploye } from './modal-employe'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination'
import type { Employe } from '@/types'

type VueType = 'grille' | 'liste'

const ELEMENTS_PAR_PAGE = 8

export function ListeEmployes() {
  const [vue, setVue] = useState<VueType>('grille')
  const [recherche, setRecherche] = useState('')
  const [departementFiltre, setDepartementFiltre] = useState('')
  const [statutFiltre, setStatutFiltre] = useState('')
  const [pageActuelle, setPageActuelle] = useState(1)
  const [filtresAvancesOuverts, setFiltresAvancesOuverts] = useState(false)
  
  // Modal states
  const [modalOuverte, setModalOuverte] = useState(false)
  const [modeModal, setModeModal] = useState<'creation' | 'edition' | 'detail'>('creation')
  const [employeSelectionne, setEmployeSelectionne] = useState<Employe | null>(null)
  const [employes, setEmployes] = useState(employesMock)

  // Filtrer les employes
  const employesFiltres = useMemo(() => {
    return employes.filter(employe => {
      const correspondRecherche = 
        `${employe.prenom} ${employe.nom}`.toLowerCase().includes(recherche.toLowerCase()) ||
        employe.email.toLowerCase().includes(recherche.toLowerCase()) ||
        employe.poste.toLowerCase().includes(recherche.toLowerCase())
      
      const correspondDepartement = 
        !departementFiltre || employe.departement === departementFiltre
      
      const correspondStatut =
        !statutFiltre || employe.statut === statutFiltre
      
      return correspondRecherche && correspondDepartement && correspondStatut
    })
  }, [employes, recherche, departementFiltre, statutFiltre])

  // Pagination
  const totalPages = Math.ceil(employesFiltres.length / ELEMENTS_PAR_PAGE)
  const employesPagines = useMemo(() => {
    const debut = (pageActuelle - 1) * ELEMENTS_PAR_PAGE
    return employesFiltres.slice(debut, debut + ELEMENTS_PAR_PAGE)
  }, [employesFiltres, pageActuelle])

  // Reset page when filters change
  const handleFiltreChange = (setter: (value: string) => void, value: string) => {
    setter(value)
    setPageActuelle(1)
  }

  const statsEmployes = {
    total: employes.length,
    actifs: employes.filter(e => e.statut === 'actif').length,
    enConge: employes.filter(e => e.statut === 'conge').length,
  }

  // Handlers for modal
  const handleOuvrirCreation = () => {
    setEmployeSelectionne(null)
    setModeModal('creation')
    setModalOuverte(true)
  }

  const handleOuvrirDetail = (employe: Employe) => {
    setEmployeSelectionne(employe)
    setModeModal('detail')
    setModalOuverte(true)
  }

  const handleOuvrirEdition = (employe: Employe) => {
    setEmployeSelectionne(employe)
    setModeModal('edition')
    setModalOuverte(true)
  }

  const handleSauvegarder = (donnees: Partial<Employe>) => {
    if (modeModal === 'creation') {
      const nouvelEmploye: Employe = {
        id: donnees.id || crypto.randomUUID(),
        prenom: donnees.prenom || '',
        nom: donnees.nom || '',
        email: donnees.email || '',
        telephone: donnees.telephone || '',
        poste: donnees.poste || '',
        departement: donnees.departement || '',
        dateEmbauche: donnees.dateEmbauche || new Date().toISOString(),
        avatar: donnees.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${donnees.prenom}`,
        statut: donnees.statut || 'actif',
        soldeConges: donnees.soldeConges || 25,
        soldeRTT: donnees.soldeRTT || 10,
        role: donnees.role || 'employe',
      }
      setEmployes([nouvelEmploye, ...employes])
    } else if (modeModal === 'edition' && employeSelectionne) {
      setEmployes(employes.map(e => 
        e.id === employeSelectionne.id ? { ...e, ...donnees } : e
      ))
    }
  }

  const handleSupprimer = (id: string) => {
    setEmployes(employes.filter(e => e.id !== id))
  }

  const reinitialiserFiltres = () => {
    setRecherche('')
    setDepartementFiltre('')
    setStatutFiltre('')
    setPageActuelle(1)
  }

  const filtresActifs = recherche || departementFiltre || statutFiltre

  // Generate page numbers
  const generatePageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (pageActuelle > 3) pages.push('ellipsis')
      const start = Math.max(2, pageActuelle - 1)
      const end = Math.min(totalPages - 1, pageActuelle + 1)
      for (let i = start; i <= end; i++) pages.push(i)
      if (pageActuelle < totalPages - 2) pages.push('ellipsis')
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <div className="space-y-6">
      {/* En-tete avec statistiques */}
      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="stat-card animate-float-soft rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-semibold">{statsEmployes.total}</p>
        </div>
        <div className="stat-card animate-float-soft rounded-xl p-4 [animation-delay:120ms]">
          <p className="text-sm text-muted-foreground">Actifs</p>
          <p className="text-2xl font-semibold text-success">{statsEmployes.actifs}</p>
        </div>
        <div className="stat-card animate-float-soft rounded-xl p-4 [animation-delay:240ms]">
          <p className="text-sm text-muted-foreground">En conge</p>
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
        <div className="flex flex-1 gap-3 w-full sm:w-auto flex-wrap">
          {/* Recherche */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher un employe..."
              value={recherche}
              onChange={(e) => handleFiltreChange(setRecherche, e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Filtre departement */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select
              value={departementFiltre}
              onChange={(e) => handleFiltreChange(setDepartementFiltre, e.target.value)}
              className="pl-10 pr-8 py-2 bg-background border border-border rounded-sm text-sm appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Tous les departements</option>
              {departementsMock.map(dep => (
                <option key={dep.id} value={dep.nom}>{dep.nom}</option>
              ))}
            </select>
          </div>

          {/* Bouton filtres avances */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFiltresAvancesOuverts(!filtresAvancesOuverts)}
            className={cn(
              'gap-2 rounded-sm',
              filtresAvancesOuverts && 'bg-primary/10 border-primary'
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtres
          </Button>

          {/* Bouton reinitialiser */}
          {filtresActifs && (
            <Button
              variant="ghost"
              size="sm"
              onClick={reinitialiserFiltres}
              className="gap-2 rounded-sm text-muted-foreground"
            >
              <X className="w-4 h-4" />
              Effacer
            </Button>
          )}
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
          <Button 
            onClick={handleOuvrirCreation}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Ajouter</span>
          </Button>
        </div>
      </motion.div>

      {/* Filtres avances */}
      <AnimatePresence>
        {filtresAvancesOuverts && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="luxury-panel space-y-4 rounded-xl p-4">
              <h4 className="font-medium text-sm">Filtres avances</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Statut</label>
                  <select
                    value={statutFiltre}
                    onChange={(e) => handleFiltreChange(setStatutFiltre, e.target.value)}
                    className="w-full px-4 py-2 bg-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">Tous les statuts</option>
                    <option value="actif">Actif</option>
                    <option value="conge">En conge</option>
                    <option value="absent">Absent</option>
                    <option value="demission">Demission</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info resultats */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {employesFiltres.length} resultat{employesFiltres.length > 1 ? 's' : ''} trouve{employesFiltres.length > 1 ? 's' : ''}
        </span>
        {totalPages > 1 && (
          <span>
            Page {pageActuelle} sur {totalPages}
          </span>
        )}
      </div>

      {/* Liste des employes */}
      <AnimatePresence mode="wait">
        {vue === 'grille' ? (
          <motion.div
            key="grille"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {employesPagines.map((employe, index) => (
              <CarteEmploye 
                key={employe.id} 
                employe={employe} 
                index={index}
                onVoirDetail={() => handleOuvrirDetail(employe)}
                onModifier={() => handleOuvrirEdition(employe)}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="liste"
            className="glass-surface overflow-hidden rounded-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* En-tete tableau */}
            <div className="grid grid-cols-12 gap-4 border-b border-border/70 bg-gradient-to-r from-muted/50 via-muted/20 to-transparent px-5 py-4 text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
              <div className="col-span-4">Employe</div>
              <div className="col-span-2">Departement</div>
              <div className="col-span-2">Poste</div>
              <div className="col-span-2">Statut</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
            {/* Lignes */}
            {employesPagines.map((employe, index) => (
              <LigneEmploye 
                key={employe.id} 
                employe={employe} 
                index={index}
                onVoirDetail={() => handleOuvrirDetail(employe)}
                onModifier={() => handleOuvrirEdition(employe)}
                onSupprimer={() => handleSupprimer(employe.id)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message si aucun resultat */}
      {employesFiltres.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">Aucun employe trouve</p>
          <p className="text-sm text-muted-foreground/70">
            Essayez de modifier vos criteres de recherche
          </p>
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center"
        >
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (pageActuelle > 1) setPageActuelle(pageActuelle - 1)
                  }}
                  className={pageActuelle === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {generatePageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === 'ellipsis' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setPageActuelle(page)
                      }}
                      isActive={pageActuelle === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (pageActuelle < totalPages) setPageActuelle(pageActuelle + 1)
                  }}
                  className={pageActuelle === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </motion.div>
      )}

      {/* Modal employe */}
      <AnimatePresence>
        {modalOuverte && (
          <ModalEmploye
            employe={employeSelectionne}
            mode={modeModal}
            onFermer={() => setModalOuverte(false)}
            onSauvegarder={handleSauvegarder}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
