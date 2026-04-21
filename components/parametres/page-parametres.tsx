'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe,
  Save,
  Camera,
  Search,
  Database,
  RefreshCw,
  Trash2,
  Plus,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Loader } from '@/components/ui/loader'

type OngletParametres = 'profil' | 'notifications' | 'securite' | 'apparence' | 'recherche'

const onglets: { id: OngletParametres; label: string; icone: React.ReactNode }[] = [
  { id: 'profil', label: 'Profil', icone: <User className="w-4 h-4" /> },
  { id: 'notifications', label: 'Notifications', icone: <Bell className="w-4 h-4" /> },
  { id: 'securite', label: 'Securite', icone: <Shield className="w-4 h-4" /> },
  { id: 'apparence', label: 'Apparence', icone: <Palette className="w-4 h-4" /> },
  { id: 'recherche', label: 'Recherche', icone: <Search className="w-4 h-4" /> },
]

export function PageParametres() {
  const [ongletActif, setOngletActif] = useState<OngletParametres>('profil')
  const [chargement, setChargement] = useState(false)

  const handleSave = async () => {
    setChargement(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setChargement(false)
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <motion.div
        className="flex flex-wrap gap-2 p-1 bg-muted rounded-sm"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {onglets.map((onglet) => (
          <button
            key={onglet.id}
            onClick={() => setOngletActif(onglet.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-medium transition-all',
              ongletActif === onglet.id
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {onglet.icone}
            {onglet.label}
          </button>
        ))}
      </motion.div>

      {/* Contenu */}
      <motion.div
        key={ongletActif}
        className="space-y-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {ongletActif === 'profil' && <SectionProfil />}
        {ongletActif === 'notifications' && <SectionNotifications />}
        {ongletActif === 'securite' && <SectionSecurite />}
        {ongletActif === 'apparence' && <SectionApparence />}
        {ongletActif === 'recherche' && <SectionRecherche />}
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
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm"
        >
          {chargement ? (
            <Loader taille="sm" variante="spinner" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              Enregistrer
            </>
          )}
        </Button>
      </motion.div>
    </div>
  )
}

function SectionProfil() {
  return (
    <div className="space-y-6">
      <div className="p-6 bg-card border border-border rounded-sm">
        <h3 className="font-semibold mb-6">Informations personnelles</h3>
        
        {/* Avatar */}
        <div className="flex items-center gap-6 mb-6">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
              alt="Avatar"
              className="w-20 h-20 rounded-sm object-cover"
            />
            <button className="absolute -bottom-2 -right-2 p-2 bg-primary text-primary-foreground rounded-full shadow-lg">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <p className="font-medium">Photo de profil</p>
            <p className="text-sm text-muted-foreground">JPG, PNG. Max 2MB</p>
          </div>
        </div>

        {/* Formulaire */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Prenom</label>
            <input
              type="text"
              defaultValue="Marie"
              className="w-full px-4 py-2.5 bg-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Nom</label>
            <input
              type="text"
              defaultValue="Dubois"
              className="w-full px-4 py-2.5 bg-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              defaultValue="marie.dubois@entreprise.fr"
              className="w-full px-4 py-2.5 bg-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Telephone</label>
            <input
              type="tel"
              defaultValue="01 23 45 67 89"
              className="w-full px-4 py-2.5 bg-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionNotifications() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    conges: true,
    documents: true,
    rappels: false,
  })

  return (
    <div className="p-6 bg-card border border-border rounded-sm">
      <h3 className="font-semibold mb-6">Preferences de notifications</h3>
      
      <div className="space-y-4">
        {[
          { id: 'email', label: 'Notifications par email', description: 'Recevoir les alertes par email' },
          { id: 'push', label: 'Notifications push', description: 'Recevoir les notifications dans le navigateur' },
          { id: 'conges', label: 'Demandes de conges', description: 'Etre notifie des mises a jour de conges' },
          { id: 'documents', label: 'Documents', description: 'Etre notifie quand un document est pret' },
          { id: 'rappels', label: 'Rappels', description: 'Recevoir des rappels pour les deadlines' },
        ].map((item) => (
          <label
            key={item.id}
            className="flex items-center justify-between p-4 rounded-sm border border-border hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <div>
              <p className="font-medium text-sm">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
            <input
              type="checkbox"
              checked={notifications[item.id as keyof typeof notifications]}
              onChange={(e) => setNotifications({ ...notifications, [item.id]: e.target.checked })}
              className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
            />
          </label>
        ))}
      </div>
    </div>
  )
}

function SectionSecurite() {
  return (
    <div className="space-y-6">
      <div className="p-6 bg-card border border-border rounded-sm">
        <h3 className="font-semibold mb-6">Changer le mot de passe</h3>
        
        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <label className="text-sm font-medium">Mot de passe actuel</label>
            <input
              type="password"
              className="w-full px-4 py-2.5 bg-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Nouveau mot de passe</label>
            <input
              type="password"
              className="w-full px-4 py-2.5 bg-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Confirmer le mot de passe</label>
            <input
              type="password"
              className="w-full px-4 py-2.5 bg-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      <div className="p-6 bg-card border border-border rounded-sm">
        <h3 className="font-semibold mb-4">Authentification a deux facteurs</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Ajoutez une couche de securite supplementaire a votre compte.
        </p>
        <Button variant="outline" className="rounded-sm">
          Activer la 2FA
        </Button>
      </div>
    </div>
  )
}

function SectionApparence() {
  const [langue, setLangue] = useState('fr')

  return (
    <div className="p-6 bg-card border border-border rounded-sm">
      <h3 className="font-semibold mb-6">Preferences d&apos;affichage</h3>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Langue
          </label>
          <select
            value={langue}
            onChange={(e) => setLangue(e.target.value)}
            className="w-full max-w-xs px-4 py-2.5 bg-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="fr">Francais</option>
            <option value="en">English</option>
            <option value="es">Espanol</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Format de date</label>
          <select className="w-full max-w-xs px-4 py-2.5 bg-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary">
            <option value="dd/mm/yyyy">JJ/MM/AAAA</option>
            <option value="mm/dd/yyyy">MM/JJ/AAAA</option>
            <option value="yyyy-mm-dd">AAAA-MM-JJ</option>
          </select>
        </div>
      </div>
    </div>
  )
}

function SectionRecherche() {
  const [indexation, setIndexation] = useState(false)
  const [moteursPrincipaux, setMoteursPrincipaux] = useState([
    { id: '1', nom: 'Employes', actif: true, champs: ['nom', 'prenom', 'email', 'poste', 'departement'] },
    { id: '2', nom: 'Conges', actif: true, champs: ['type', 'statut', 'motif'] },
    { id: '3', nom: 'Documents', actif: true, champs: ['type', 'nom', 'statut'] },
  ])

  const [filtresRecherche, setFiltresRecherche] = useState({
    rechercheGlobale: true,
    suggestionAutomatique: true,
    historique: true,
    nombreResultats: 20,
    pertinenceMin: 70,
  })

  const handleToggleMoteur = (id: string) => {
    setMoteursPrincipaux(moteursPrincipaux.map(m => 
      m.id === id ? { ...m, actif: !m.actif } : m
    ))
  }

  const handleReindexer = async () => {
    setIndexation(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIndexation(false)
  }

  return (
    <div className="space-y-6">
      {/* Moteurs de recherche */}
      <div className="p-6 bg-card border border-border rounded-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold flex items-center gap-2">
              <Database className="w-5 h-5" />
              Moteurs de recherche
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Configurez les sources de donnees indexees pour la recherche
            </p>
          </div>
          <Button
            onClick={handleReindexer}
            disabled={indexation}
            variant="outline"
            className="gap-2 rounded-sm"
          >
            {indexation ? (
              <>
                <Loader taille="sm" variante="spinner" />
                Indexation...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Reindexer
              </>
            )}
          </Button>
        </div>

        <div className="space-y-4">
          {moteursPrincipaux.map((moteur) => (
            <motion.div
              key={moteur.id}
              className={cn(
                'p-4 rounded-sm border transition-colors',
                moteur.actif ? 'border-primary/30 bg-primary/5' : 'border-border'
              )}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-3 h-3 rounded-full',
                    moteur.actif ? 'bg-success' : 'bg-muted-foreground'
                  )} />
                  <h4 className="font-medium">{moteur.nom}</h4>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={moteur.actif}
                    onChange={() => handleToggleMoteur(moteur.id)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                {moteur.champs.map((champ) => (
                  <span
                    key={champ}
                    className="text-xs px-2 py-1 bg-muted rounded-sm text-muted-foreground"
                  >
                    {champ}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Configuration de la recherche */}
      <div className="p-6 bg-card border border-border rounded-sm">
        <h3 className="font-semibold mb-6 flex items-center gap-2">
          <Search className="w-5 h-5" />
          Configuration de la recherche
        </h3>

        <div className="space-y-6">
          {/* Options de recherche */}
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 rounded-sm border border-border hover:bg-muted/50 transition-colors cursor-pointer">
              <div>
                <p className="font-medium text-sm">Recherche globale</p>
                <p className="text-xs text-muted-foreground">Rechercher dans toutes les sections simultanement</p>
              </div>
              <input
                type="checkbox"
                checked={filtresRecherche.rechercheGlobale}
                onChange={(e) => setFiltresRecherche({ ...filtresRecherche, rechercheGlobale: e.target.checked })}
                className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-sm border border-border hover:bg-muted/50 transition-colors cursor-pointer">
              <div>
                <p className="font-medium text-sm">Suggestions automatiques</p>
                <p className="text-xs text-muted-foreground">Afficher des suggestions pendant la saisie</p>
              </div>
              <input
                type="checkbox"
                checked={filtresRecherche.suggestionAutomatique}
                onChange={(e) => setFiltresRecherche({ ...filtresRecherche, suggestionAutomatique: e.target.checked })}
                className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-sm border border-border hover:bg-muted/50 transition-colors cursor-pointer">
              <div>
                <p className="font-medium text-sm">Historique de recherche</p>
                <p className="text-xs text-muted-foreground">Conserver l&apos;historique des recherches</p>
              </div>
              <input
                type="checkbox"
                checked={filtresRecherche.historique}
                onChange={(e) => setFiltresRecherche({ ...filtresRecherche, historique: e.target.checked })}
                className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
              />
            </label>
          </div>

          {/* Parametres avances */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre de resultats par page</label>
              <select
                value={filtresRecherche.nombreResultats}
                onChange={(e) => setFiltresRecherche({ ...filtresRecherche, nombreResultats: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value={10}>10 resultats</option>
                <option value={20}>20 resultats</option>
                <option value={50}>50 resultats</option>
                <option value={100}>100 resultats</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Score de pertinence minimum (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={filtresRecherche.pertinenceMin}
                onChange={(e) => setFiltresRecherche({ ...filtresRecherche, pertinenceMin: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Actions de maintenance */}
      <div className="p-6 bg-card border border-border rounded-sm">
        <h3 className="font-semibold mb-4">Maintenance</h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="gap-2 rounded-sm">
            <Trash2 className="w-4 h-4" />
            Vider le cache
          </Button>
          <Button variant="outline" className="gap-2 rounded-sm">
            <RefreshCw className="w-4 h-4" />
            Reconstruire l&apos;index
          </Button>
        </div>
      </div>
    </div>
  )
}
