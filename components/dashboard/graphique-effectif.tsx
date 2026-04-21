'use client'

import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface DonneeEffectif {
  mois: string
  effectif: number
}

interface GraphiqueEffectifProps {
  donnees: DonneeEffectif[]
}

export function GraphiqueEffectif({ donnees }: GraphiqueEffectifProps) {
  return (
    <motion.div
      className="p-6 bg-card border border-border rounded-sm h-full min-h-[360px] flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold">Évolution de l'effectif</h3>
          <p className="text-sm text-muted-foreground">6 derniers mois</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-sm bg-primary" />
          <span className="text-sm text-muted-foreground">Effectif total</span>
        </div>
      </div>

      <div className="h-64 flex-1 min-h-[224px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={donnees}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorEffectif" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.82 0.165 85)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="oklch(0.82 0.165 85)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="oklch(0.88 0.01 90)" 
            />
            <XAxis 
              dataKey="mois" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'oklch(0.45 0.01 60)', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'oklch(0.45 0.01 60)', fontSize: 12 }}
              domain={['dataMin - 5', 'dataMax + 5']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'oklch(1 0 0)',
                border: '1px solid oklch(0.88 0.01 90)',
                borderRadius: '4px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
              labelStyle={{ color: 'oklch(0.15 0.01 60)', fontWeight: 500 }}
              formatter={(value: number) => [`${value} employés`, 'Effectif']}
            />
            <Area
              type="monotone"
              dataKey="effectif"
              stroke="oklch(0.82 0.165 85)"
              strokeWidth={2}
              fill="url(#colorEffectif)"
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
