'use client'

import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

interface DonneeDepartement {
  departement: string
  effectif: number
}

interface GraphiquePartementsProps {
  donnees: DonneeDepartement[]
}

const COULEURS = [
  'oklch(0.82 0.165 85)', // jaune
  'oklch(0.25 0.01 60)',  // noir
  'oklch(0.72 0.14 80)',  // jaune foncé
  'oklch(0.55 0.01 60)',  // gris
  'oklch(0.65 0.12 85)',  // jaune moyen
  'oklch(0.40 0.01 60)',  // gris foncé
  'oklch(0.88 0.08 85)',  // jaune clair
]

export function GraphiqueDepartements({ donnees }: GraphiquePartementsProps) {
  // Trier par effectif décroissant
  const donneesTries = [...donnees].sort((a, b) => b.effectif - a.effectif)

  return (
    <motion.div
      className="luxury-panel flex h-full min-h-[360px] flex-col rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="mb-6">
        <h3 className="text-base font-semibold">Répartition par département</h3>
        <p className="text-sm text-muted-foreground">Effectif actuel</p>
      </div>

      <div className="h-56 flex-1 min-h-[224px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={donneesTries}
            layout="vertical"
            margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
          >
            <XAxis 
              type="number" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'oklch(0.45 0.01 60)', fontSize: 11 }}
            />
            <YAxis
              type="category"
              dataKey="departement"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'oklch(0.45 0.01 60)', fontSize: 11 }}
              width={90}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'oklch(1 0 0)',
                border: '1px solid oklch(0.88 0.01 90)',
                borderRadius: '4px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
              formatter={(value: number) => [`${value} personnes`, 'Effectif']}
            />
            <Bar 
              dataKey="effectif" 
              radius={[0, 2, 2, 0]}
              animationDuration={1000}
              animationEasing="ease-out"
            >
              {donneesTries.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COULEURS[index % COULEURS.length]} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Légende compacte */}
      <div className="mt-4 flex flex-wrap gap-2">
        {donneesTries.slice(0, 4).map((item, index) => (
          <div 
            key={item.departement} 
            className="flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <span 
              className="w-2 h-2 rounded-sm" 
              style={{ backgroundColor: COULEURS[index] }} 
            />
            <span>{item.departement}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
