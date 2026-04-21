'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface LoaderProps {
  taille?: 'sm' | 'md' | 'lg'
  variante?: 'spinner' | 'dots' | 'pulse' | 'bars'
  className?: string
  texte?: string
}

export function Loader({ 
  taille = 'md', 
  variante = 'spinner',
  className,
  texte 
}: LoaderProps) {
  const tailles = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  if (variante === 'spinner') {
    return (
      <div className={cn('flex flex-col items-center gap-3', className)}>
        <motion.div
          className={cn(
            'border-2 border-muted border-t-primary rounded-full',
            tailles[taille]
          )}
          animate={{ rotate: 360 }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        {texte && (
          <motion.span 
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {texte}
          </motion.span>
        )}
      </div>
    )
  }

  if (variante === 'dots') {
    return (
      <div className={cn('flex items-center gap-1.5', className)}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={cn(
              'bg-primary rounded-full',
              taille === 'sm' ? 'w-1.5 h-1.5' : taille === 'md' ? 'w-2 h-2' : 'w-3 h-3'
            )}
            animate={{
              y: [0, -8, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
          />
        ))}
        {texte && <span className="ml-2 text-sm text-muted-foreground">{texte}</span>}
      </div>
    )
  }

  if (variante === 'pulse') {
    return (
      <div className={cn('flex flex-col items-center gap-3', className)}>
        <motion.div
          className={cn(
            'bg-primary/30 rounded-sm',
            tailles[taille]
          )}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {texte && <span className="text-sm text-muted-foreground">{texte}</span>}
      </div>
    )
  }

  // Bars
  return (
    <div className={cn('flex items-end gap-1', className)}>
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className={cn(
            'bg-primary rounded-sm',
            taille === 'sm' ? 'w-1' : taille === 'md' ? 'w-1.5' : 'w-2'
          )}
          animate={{
            height: ['8px', '20px', '8px'],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeInOut',
          }}
        />
      ))}
      {texte && <span className="ml-2 text-sm text-muted-foreground">{texte}</span>}
    </div>
  )
}

// Skeleton loader pour les cartes
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('luxury-panel rounded-xl p-6', className)}>
      <div className="space-y-4">
        <div className="animate-shimmer h-4 w-1/3 rounded-sm" />
        <div className="space-y-2">
          <div className="animate-shimmer h-3 w-full rounded-sm" />
          <div className="animate-shimmer h-3 w-4/5 rounded-sm" />
        </div>
        <div className="flex gap-2">
          <div className="animate-shimmer h-8 w-20 rounded-sm" />
          <div className="animate-shimmer h-8 w-20 rounded-sm" />
        </div>
      </div>
    </div>
  )
}

// Skeleton pour tableaux
export function SkeletonTable({ lignes = 5 }: { lignes?: number }) {
  return (
    <div className="space-y-3">
      <div className="flex gap-4 p-4 border-b border-border">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-shimmer h-4 flex-1 rounded-sm" />
        ))}
      </div>
      {Array.from({ length: lignes }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4">
          {[1, 2, 3, 4].map((j) => (
            <div key={j} className="animate-shimmer h-4 flex-1 rounded-sm" />
          ))}
        </div>
      ))}
    </div>
  )
}

// Loader plein écran
export function LoaderPleinEcran({ texte = 'Chargement...' }: { texte?: string }) {
  return (
    <motion.div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-background/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-col items-center gap-4">
        <Loader taille="lg" variante="bars" />
        <motion.p
          className="text-sm text-muted-foreground font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {texte}
        </motion.p>
      </div>
    </motion.div>
  )
}
