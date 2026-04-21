'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  FileText, 
  Building2, 
  Briefcase,
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  Check,
  GripVertical,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Loader } from '@/components/ui/loader'

type OngletParametrage = 'types-conges' | 'types-documents' | 'departements' | 'postes'

const onglets: { id: OngletParametrage; label: string; icone: React.ReactNode }[] = [
  { id: 'types-conges', label: 'Types de congés', icone: <Calendar className="w-4 h-4" /> },
  { id: 'types-documents', label: 'Types de documents', icone: <FileText className="w-4 h-4" /> },
  { id: 'departements', label: 'Départements', icone: <Building2 className="w-4 h-4" /> },
  { id: 'postes', label: 'Postes', icone: <Briefcase className="w-4 h-4" /> },
]

interface ElementParametrage {
  id: string
  nom: string
  description?: string
  couleur?: string
  joursMax?: number
  actif: boolean
}

const couleursDisponibles = [
  { nom: 'Jaune', valeur: 'bg-primary' },
  { nom: 'Vert', valeur: 'bg-success' },
  { nom: 'Rouge', valeur: 'bg-destructive' },
  { nom: 'Bleu', valeur: 'bg-blue-500' },
  { nom: 'Violet', valeur: 'bg-purple-500' },
  { nom: 'Orange', valeur: 'bg-orange-500' },
]

const typesCongesInitiaux: ElementParametrage[] = [
  { id: '1', nom: 'Congés payés', description: 'Congés annuels légaux', joursMax: 25, couleur: 'bg-primary', actif: true },
  { id: '2', nom: 'RTT', description: 'Réduction du temps de travail', joursMax: 12, couleur: 'bg-success', actif: true },
  { id: '3', nom: 'Maladie', description: 'Arrêt maladie', joursMax: 90, couleur: 'bg-destructive', actif: true },
  { id: '4', nom: 'Maternité', description: 'Congé maternité', joursMax: 112, couleur: 'bg-purple-500', actif: true },
  { id: '5', nom: 'Paternité', description: 'Congé paternité', joursMax: 28, couleur: 'bg-blue-500', actif: true },
  { id: '6', nom: 'Sans solde', description: 'Congé non rémunéré', joursMax: 365, couleur: 'bg-orange-500', actif: true },
  { id: '7', nom: 'Formation', description: 'Formation professionnelle', joursMax: 30, couleur: 'bg-success', actif: true },
]

const typesDocumentsInitiaux: ElementParametrage[] = [
  { id: '1', nom: 'Attestation de travail', description: 'Certificat confirmant l\'emploi', actif: true },
  { id: '2', nom: 'Bulletin de paie', description: 'Fiche de paie mensuelle', actif: true },
  { id: '3', nom: 'Attestation de salaire', description: 'Pour les démarches administratives', actif: true },
  { id: '4', nom: 'Certificat de travail', description: 'Délivré à la fin du contrat', actif: true },
  { id: '5', nom: 'Attestation employeur', description: 'Pour Pôle Emploi', actif: true },
  { id: '6', nom: 'Relevé de carrière', description: 'Historique professionnel', actif: true },
]

const departementsInitiaux: ElementParametrage[] = [
  { id: '1', nom: 'Direction', description: 'Direction générale', actif: true },
  { id: '2', nom: 'Ressources Humaines', description: 'Gestion du personnel', actif: true },
  { id: '3', nom: 'Développement', description: 'Équipe technique', actif: true },
  { id: '4', nom: 'Marketing', description: 'Communication et marketing', actif: true },
  { id: '5', nom: 'Commercial', description: 'Vente et relations clients', actif: true },
  { id: '6', nom: 'Finance', description: 'Comptabilité et finances', actif: true },
]

const postesInitiaux: ElementParametrage[] = [
  { id: '1', nom: 'Directeur', description: 'Direction d\'équipe ou de département', actif: true },
  { id: '2', nom: 'Manager', description: 'Responsable d\'équipe', actif: true },
  { id: '3', nom: 'Développeur Senior', description: 'Développeur expérimenté', actif: true },
  { id: '4', nom: 'Développeur Junior', description: 'Développeur débutant', actif: true },
  { id: '5', nom: 'Designer UX/UI', description: 'Conception d\'interfaces', actif: true },
  { id: '6', nom: 'Chef de projet', description: 'Gestion de projets', actif: true },
  { id: '7', nom: 'Comptable', description: 'Gestion comptable', actif: true },
  { id: '8', nom: 'Assistant(e)', description: 'Assistance administrative', actif: true },
]

export function PageParametrage() {
  const [ongletActif, setOngletActif] = useState<OngletParametrage>('types-conges')
  const [chargement, setChargement] = useState(false)

  const [typesConges, setTypesConges] = useState(typesCongesInitiaux)
  const [typesDocuments, setTypesDocuments] = useState(typesDocumentsInitiaux)
  const [departements, setDepartements] = useState(departementsInitiaux)
  const [postes, setPostes] = useState(postesInitiaux)

  const handleSave = async () => {
    setChargement(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setChargement(false)
  }

  const getDonnees = () => {
    switch (ongletActif) {
      case 'types-conges': return { data: typesConges, setData: setTypesConges, avecCouleur: true, avecJours: true }
      case 'types-documents': return { data: typesDocuments, setData: setTypesDocuments, avecCouleur: false, avecJours: false }
      case 'departements': return { data: departements, setData: setDepartements, avecCouleur: false, avecJours: false }
      case 'postes': return { data: postes, setData: setPostes, avecCouleur: false, avecJours: false }
    }
  }

  const { data, setData, avecCouleur, avecJours } = getDonnees()

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-semibold">Paramétrage</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configurez les éléments de base de votre application RH
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        className="luxury-panel flex flex-wrap gap-2 rounded-xl p-1.5"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {onglets.map((onglet) => (
          <button
            key={onglet.id}
            onClick={() => setOngletActif(onglet.id)}
            className={cn(
              'flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all',
              ongletActif === onglet.id
                ? 'bg-primary/15 text-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
            )}
          >
            {onglet.icone}
            <span className="hidden sm:inline">{onglet.label}</span>
          </button>
        ))}
      </motion.div>

      {/* Contenu */}
      <motion.div
        key={ongletActif}
        className="space-y-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ListeParametrage 
          elements={data}
          setElements={setData}
          avecCouleur={avecCouleur}
          avecJours={avecJours}
        />
      </motion.div>

      {/* Bouton sauvegarder */}
      <motion.div
        className="flex justify-end pt-4 border-t border-border"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          onClick={handleSave}
          disabled={chargement}
          className="gap-2 bg-foreground text-background hover:bg-foreground/90"
        >
          {chargement ? (
            <Loader taille="sm" variante="spinner" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              Enregistrer les modifications
            </>
          )}
        </Button>
      </motion.div>
    </div>
  )
}

interface ListeParametrageProps {
  elements: ElementParametrage[]
  setElements: React.Dispatch<React.SetStateAction<ElementParametrage[]>>
  avecCouleur: boolean
  avecJours: boolean
}

function ListeParametrage({ elements, setElements, avecCouleur, avecJours }: ListeParametrageProps) {
  const [elementEnEdition, setElementEnEdition] = useState<string | null>(null)
  const [formulaireOuvert, setFormulaireOuvert] = useState(false)
  const [nouvelElement, setNouvelElement] = useState<Partial<ElementParametrage>>({
    nom: '',
    description: '',
    couleur: 'bg-primary',
    joursMax: 25,
    actif: true,
  })

  const handleAjouter = () => {
    if (!nouvelElement.nom) return
    
    const newItem: ElementParametrage = {
      id: crypto.randomUUID(),
      nom: nouvelElement.nom,
      description: nouvelElement.description,
      couleur: nouvelElement.couleur,
      joursMax: nouvelElement.joursMax,
      actif: true,
    }
    
    setElements([...elements, newItem])
    setNouvelElement({
      nom: '',
      description: '',
      couleur: 'bg-primary',
      joursMax: 25,
      actif: true,
    })
    setFormulaireOuvert(false)
  }

  const handleSupprimer = (id: string) => {
    setElements(elements.filter(e => e.id !== id))
  }

  const handleToggleActif = (id: string) => {
    setElements(elements.map(e => 
      e.id === id ? { ...e, actif: !e.actif } : e
    ))
  }

  const handleModifier = (id: string, champ: string, valeur: string | number) => {
    setElements(elements.map(e => 
      e.id === id ? { ...e, [champ]: valeur } : e
    ))
  }

  return (
    <div className="space-y-4">
      {/* Bouton ajouter */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {elements.filter(e => e.actif).length} élément(s) actif(s) sur {elements.length}
        </p>
        <Button
          onClick={() => setFormulaireOuvert(!formulaireOuvert)}
          variant="outline"
          className="gap-2"
        >
          {formulaireOuvert ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {formulaireOuvert ? 'Annuler' : 'Ajouter'}
        </Button>
      </div>

      {/* Formulaire ajout */}
      <AnimatePresence>
        {formulaireOuvert && (
          <motion.div
            className="luxury-panel space-y-4 rounded-xl p-5"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h4 className="font-medium">Nouvel élément</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nom *</label>
                <input
                  type="text"
                  value={nouvelElement.nom}
                  onChange={(e) => setNouvelElement({ ...nouvelElement, nom: e.target.value })}
                  placeholder="Nom de l'élément"
                  className="w-full px-4 py-2.5 bg-background border border-border text-sm focus:outline-none focus:border-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <input
                  type="text"
                  value={nouvelElement.description}
                  onChange={(e) => setNouvelElement({ ...nouvelElement, description: e.target.value })}
                  placeholder="Description optionnelle"
                  className="w-full px-4 py-2.5 bg-background border border-border text-sm focus:outline-none focus:border-foreground"
                />
              </div>
              {avecJours && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Jours maximum</label>
                  <input
                    type="number"
                    value={nouvelElement.joursMax}
                    onChange={(e) => setNouvelElement({ ...nouvelElement, joursMax: parseInt(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-background border border-border text-sm focus:outline-none focus:border-foreground"
                  />
                </div>
              )}
              {avecCouleur && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Couleur</label>
                  <div className="flex gap-2">
                    {couleursDisponibles.map((couleur) => (
                      <button
                        key={couleur.valeur}
                        onClick={() => setNouvelElement({ ...nouvelElement, couleur: couleur.valeur })}
                        className={cn(
                          'w-8 h-8 transition-all',
                          couleur.valeur,
                          nouvelElement.couleur === couleur.valeur && 'ring-2 ring-foreground ring-offset-2'
                        )}
                        title={couleur.nom}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setFormulaireOuvert(false)}>
                Annuler
              </Button>
              <Button 
                onClick={handleAjouter}
                disabled={!nouvelElement.nom}
                className="bg-foreground text-background hover:bg-foreground/90"
              >
                <Check className="w-4 h-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Liste */}
      <div className="luxury-panel overflow-hidden rounded-xl">
        <div className="divide-y divide-border">
          {elements.map((element, index) => (
            <motion.div
              key={element.id}
              className={cn(
                'flex items-center gap-4 p-4 group',
                !element.actif && 'opacity-50 bg-muted/30'
              )}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {/* Drag handle */}
              <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />

              {/* Couleur */}
              {avecCouleur && element.couleur && (
                <div className={cn('w-3 h-8', element.couleur)} />
              )}

              {/* Infos */}
              <div className="flex-1 min-w-0">
                {elementEnEdition === element.id ? (
                  <input
                    type="text"
                    value={element.nom}
                    onChange={(e) => handleModifier(element.id, 'nom', e.target.value)}
                    className="w-full px-2 py-1 bg-background border border-border text-sm focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <p className="font-medium text-sm">{element.nom}</p>
                )}
                {element.description && (
                  <p className="text-xs text-muted-foreground truncate">{element.description}</p>
                )}
              </div>

              {/* Jours max */}
              {avecJours && element.joursMax !== undefined && (
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{element.joursMax}</span> jours max
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setElementEnEdition(
                    elementEnEdition === element.id ? null : element.id
                  )}
                  className="p-2 hover:bg-muted transition-colors"
                  title="Modifier"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleSupprimer(element.id)}
                  className="p-2 hover:bg-destructive/10 text-destructive transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Toggle actif */}
              <button
                onClick={() => handleToggleActif(element.id)}
                className={cn(
                  'relative w-10 h-6 rounded-full transition-colors',
                  element.actif ? 'bg-success' : 'bg-muted'
                )}
              >
                <motion.div
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                  animate={{ left: element.actif ? '22px' : '4px' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {elements.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>Aucun élément configuré</p>
          <Button
            onClick={() => setFormulaireOuvert(true)}
            variant="outline"
            className="mt-4"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter le premier élément
          </Button>
        </div>
      )}
    </div>
  )
}
