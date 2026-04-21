'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, ArrowRight, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Loader } from '@/components/ui/loader'

interface PageConnexionProps {
  onConnexion: (email: string, motDePasse: string) => Promise<void>
}

export function PageConnexion({ onConnexion }: PageConnexionProps) {
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [afficherMotDePasse, setAfficherMotDePasse] = useState(false)
  const [chargement, setChargement] = useState(false)
  const [erreur, setErreur] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErreur('')
    
    if (!email || !motDePasse) {
      setErreur('Veuillez remplir tous les champs')
      return
    }

    setChargement(true)
    try {
      await onConnexion(email, motDePasse)
    } catch {
      setErreur('Email ou mot de passe incorrect')
    } finally {
      setChargement(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Section gauche - Formulaire */}
      <motion.div 
        className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-background"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-foreground flex items-center justify-center">
                <Users className="w-6 h-6 text-background" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">MUFER</h1>
                <p className="text-xs text-primary font-semibold tracking-widest">EMPLOYES</p>
              </div>
            </div>
          </motion.div>

          {/* Titre */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-semibold text-foreground">
              Bienvenue
            </h2>
            <p className="text-muted-foreground mt-2">
              Connectez-vous pour accéder à votre espace RH
            </p>
          </motion.div>

          {/* Formulaire */}
          <motion.form 
            onSubmit={handleSubmit}
            className="space-y-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Adresse email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@entreprise.fr"
                className="w-full px-4 py-3 bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
              />
            </div>

            {/* Mot de passe */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  Mot de passe
                </label>
                <button
                  type="button"
                  className="text-xs text-primary hover:underline"
                >
                  Mot de passe oublié ?
                </button>
              </div>
              <div className="relative">
                <input
                  type={afficherMotDePasse ? 'text' : 'password'}
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  placeholder="Entrez votre mot de passe"
                  className="w-full px-4 py-3 pr-12 bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setAfficherMotDePasse(!afficherMotDePasse)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {afficherMotDePasse ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Erreur */}
            <AnimatePresence>
              {erreur && (
                <motion.p
                  className="text-sm text-destructive bg-destructive/10 px-4 py-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {erreur}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Se souvenir */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  className="peer sr-only"
                />
                <div className="w-5 h-5 border border-border peer-checked:bg-foreground peer-checked:border-foreground transition-all" />
                <svg
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-background opacity-0 peer-checked:opacity-100 transition-opacity"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                Rester connecté
              </span>
            </label>

            {/* Bouton connexion */}
            <Button
              type="submit"
              disabled={chargement}
              className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 font-medium gap-2 rounded-none"
            >
              {chargement ? (
                <Loader taille="sm" variante="spinner" className="text-background" />
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </motion.form>

          {/* Démo */}
          <motion.div
            className="pt-6 border-t border-border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm text-muted-foreground text-center mb-4">
              Accès démo rapide
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@mufer.fr')
                  setMotDePasse('demo123')
                }}
                className="px-4 py-2.5 border border-border text-sm hover:bg-muted transition-colors"
              >
                Admin RH
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('employe@mufer.fr')
                  setMotDePasse('demo123')
                }}
                className="px-4 py-2.5 border border-border text-sm hover:bg-muted transition-colors"
              >
                Employé
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Section droite - Image */}
      <motion.div 
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Image de fond */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=1600&fit=crop)',
          }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-foreground/60" />

        {/* Contenu */}
        <div className="relative z-10 flex flex-col justify-end p-12 text-background">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {/* Citation */}
            <blockquote className="space-y-4">
              <p className="text-2xl font-light leading-relaxed max-w-md">
                &ldquo;Simplifiez la gestion de vos ressources humaines avec une solution moderne et intuitive.&rdquo;
              </p>
              <footer className="flex items-center gap-4">
                <div className="w-12 h-0.5 bg-primary" />
                <div>
                  <p className="font-medium">MUFER Employes</p>
                  <p className="text-sm text-background/70">Votre partenaire RH</p>
                </div>
              </footer>
            </blockquote>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-background/20">
              <div>
                <p className="text-3xl font-bold text-primary">500+</p>
                <p className="text-sm text-background/70 mt-1">Entreprises</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">15K+</p>
                <p className="text-sm text-background/70 mt-1">Employés gérés</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">98%</p>
                <p className="text-sm text-background/70 mt-1">Satisfaction</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Décorations géométriques */}
        <motion.div
          className="absolute top-20 right-20 w-32 h-32 border border-primary/30"
          initial={{ opacity: 0, rotate: -10 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        />
        <motion.div
          className="absolute top-32 right-32 w-20 h-20 bg-primary/20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        />
      </motion.div>
    </div>
  )
}
