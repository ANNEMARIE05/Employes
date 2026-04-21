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
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Loader } from '@/components/ui/loader'

type OngletParametres = 'profil' | 'notifications' | 'securite' | 'apparence'

const onglets: { id: OngletParametres; label: string; icone: React.ReactNode }[] = [
  { id: 'profil', label: 'Profil', icone: <User className="w-4 h-4" /> },
  { id: 'notifications', label: 'Notifications', icone: <Bell className="w-4 h-4" /> },
  { id: 'securite', label: 'Sécurité', icone: <Shield className="w-4 h-4" /> },
  { id: 'apparence', label: 'Apparence', icone: <Palette className="w-4 h-4" /> },
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
            <label className="text-sm font-medium">Prénom</label>
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
            <label className="text-sm font-medium">Téléphone</label>
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
      <h3 className="font-semibold mb-6">Préférences de notifications</h3>
      
      <div className="space-y-4">
        {[
          { id: 'email', label: 'Notifications par email', description: 'Recevoir les alertes par email' },
          { id: 'push', label: 'Notifications push', description: 'Recevoir les notifications dans le navigateur' },
          { id: 'conges', label: 'Demandes de congés', description: 'Être notifié des mises à jour de congés' },
          { id: 'documents', label: 'Documents', description: 'Être notifié quand un document est prêt' },
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
        <h3 className="font-semibold mb-4">Authentification à deux facteurs</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Ajoutez une couche de sécurité supplémentaire à votre compte.
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
      <h3 className="font-semibold mb-6">Préférences d'affichage</h3>
      
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
            <option value="fr">Français</option>
            <option value="en">English</option>
            <option value="es">Español</option>
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
