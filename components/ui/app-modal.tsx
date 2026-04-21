'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

/** Même coque que la modale employé : au-dessus du header, dégagement sous la barre, overlay identique */
export const appModalShellClass =
  'fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 pt-20 pb-6 sm:items-center sm:py-8'

export const appModalOverlayClass =
  'absolute inset-0 bg-foreground/25 backdrop-blur-sm'

export function AppModalPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  return createPortal(children, document.body)
}

type AppModalShellProps = {
  onOverlayClick: () => void
  panelClassName?: string
  children: React.ReactNode
  className?: string
}

export function AppModalShell({
  onOverlayClick,
  panelClassName = 'max-w-2xl',
  children,
  className,
}: AppModalShellProps) {
  return (
    <motion.div
      className={cn(appModalShellClass, className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={appModalOverlayClass}
        aria-hidden
        onClick={onOverlayClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <div className={cn('relative z-[1] my-auto w-full', panelClassName)}>{children}</div>
    </motion.div>
  )
}
