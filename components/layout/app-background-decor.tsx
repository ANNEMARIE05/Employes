'use client'

/**
 * Fond décoratif commun (dashboard RH, employé, connexion, etc.)
 */
export function AppBackgroundDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-0 opacity-70">
      <div className="absolute left-[-6rem] top-[-4rem] h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute right-[-7rem] top-24 h-80 w-80 rounded-full bg-warning/20 blur-3xl" />
      <div className="absolute bottom-[-8rem] left-1/3 h-80 w-80 rounded-full bg-success/10 blur-3xl" />
    </div>
  )
}
