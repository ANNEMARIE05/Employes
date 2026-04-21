'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useSpring, useTransform, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AnimatedNumberProps {
  valeur: number
  duree?: number
  className?: string
  format?: 'nombre' | 'pourcentage' | 'monnaie'
  prefixe?: string
  suffixe?: string
  decimales?: number
}

export function AnimatedNumber({
  valeur,
  duree = 1.5,
  className,
  format = 'nombre',
  prefixe = '',
  suffixe = '',
  decimales = 0,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [hasAnimated, setHasAnimated] = useState(false)

  const spring = useSpring(0, {
    mass: 1,
    stiffness: 75,
    damping: 15,
    duration: duree * 1000,
  })

  const display = useTransform(spring, (current) => {
    const num = Math.round(current * Math.pow(10, decimales)) / Math.pow(10, decimales)
    
    if (format === 'pourcentage') {
      return `${prefixe}${num.toFixed(decimales)}%${suffixe}`
    }
    
    if (format === 'monnaie') {
      return `${prefixe}${num.toLocaleString('fr-FR', { 
        minimumFractionDigits: decimales,
        maximumFractionDigits: decimales 
      })} €${suffixe}`
    }
    
    return `${prefixe}${num.toLocaleString('fr-FR', {
      minimumFractionDigits: decimales,
      maximumFractionDigits: decimales,
    })}${suffixe}`
  })

  useEffect(() => {
    if (isInView && !hasAnimated) {
      spring.set(valeur)
      setHasAnimated(true)
    }
  }, [isInView, valeur, spring, hasAnimated])

  return (
    <motion.span
      ref={ref}
      className={cn('tabular-nums', className)}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
    >
      {display}
    </motion.span>
  )
}

// Compteur avec icône
interface CounterCardProps {
  icone: React.ReactNode
  titre: string
  valeur: number
  description?: string
  tendance?: { valeur: number; positif: boolean }
  format?: 'nombre' | 'pourcentage' | 'monnaie'
  delai?: number
}

export function CounterCard({
  icone,
  titre,
  valeur,
  description,
  tendance,
  format = 'nombre',
  delai = 0,
}: CounterCardProps) {
  return (
    <motion.div
      className="p-4 sm:p-5 bg-card border border-border min-h-[128px] sm:min-h-[140px] flex flex-col justify-between hover:border-foreground/20 transition-colors duration-300 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delai, duration: 0.5 }}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4">
        <div className="p-1.5 sm:p-2 bg-primary/10 text-primary rounded-sm shrink-0">
          {icone}
        </div>
        {tendance && (
          <motion.div
            className={cn(
              'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-sm shrink-0',
              tendance.positif 
                ? 'bg-success/10 text-success' 
                : 'bg-destructive/10 text-destructive'
            )}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delai + 0.3 }}
          >
            <span>{tendance.positif ? '↑' : '↓'}</span>
            <span>{Math.abs(tendance.valeur)}%</span>
          </motion.div>
        )}
      </div>
      
      <div className="space-y-1 min-w-0">
        <p className="text-xs sm:text-sm text-muted-foreground truncate">{titre}</p>
        <AnimatedNumber
          valeur={valeur}
          format={format}
          className="text-xl sm:text-2xl font-semibold text-foreground"
          decimales={format === 'pourcentage' ? 1 : 0}
        />
        {description && (
          <motion.p
            className="text-[11px] sm:text-xs text-muted-foreground mt-1.5 sm:mt-2 truncate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delai + 0.5 }}
          >
            {description}
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}
