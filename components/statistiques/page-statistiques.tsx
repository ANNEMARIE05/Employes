'use client'

import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  FileText,
  Clock,
  BarChart3,
  PieChart as PieChartIcon,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { AnimatedNumber } from '@/components/ui/animated-number'
import { statistiquesMock } from '@/lib/donnees-mock'

const COULEURS_PIE = [
  'oklch(0.82 0.165 85)',
  'oklch(0.25 0.01 60)',
  'oklch(0.72 0.14 80)',
  'oklch(0.55 0.01 60)',
]

// Données supplémentaires pour les graphiques
const donneesAbsenteisme = [
  { mois: 'Jan', taux: 2.8 },
  { mois: 'Fév', taux: 3.1 },
  { mois: 'Mar', taux: 2.5 },
  { mois: 'Avr', taux: 3.2 },
  { mois: 'Mai', taux: 2.9 },
  { mois: 'Juin', taux: 3.4 },
]

const donneesCongesParMois = [
  { mois: 'Jan', conges: 15, rtt: 8 },
  { mois: 'Fév', conges: 12, rtt: 10 },
  { mois: 'Mar', conges: 18, rtt: 12 },
  { mois: 'Avr', conges: 22, rtt: 15 },
  { mois: 'Mai', conges: 28, rtt: 18 },
  { mois: 'Juin', conges: 35, rtt: 20 },
]

export function PageStatistiques() {
  const stats = statistiquesMock

  return (
    <div className="space-y-6">
      {/* KPIs principaux */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <KPICard
          titre="Effectif total"
          valeur={stats.totalEmployes}
          tendance={{ valeur: 5.2, positif: true }}
          icone={<Users className="w-5 h-5" />}
          delai={0}
        />
        <KPICard
          titre="Taux d'absentéisme"
          valeur={stats.tauxAbsenteisme}
          suffixe="%"
          tendance={{ valeur: 0.5, positif: false }}
          icone={<TrendingDown className="w-5 h-5" />}
          delai={0.1}
        />
        <KPICard
          titre="Congés approuvés"
          valeur={stats.congesApprouvesCeMois}
          description="Ce mois"
          icone={<Calendar className="w-5 h-5" />}
          delai={0.2}
        />
        <KPICard
          titre="Documents traités"
          valeur={stats.documentsTraitesCeMois}
          description="Ce mois"
          icone={<FileText className="w-5 h-5" />}
          delai={0.3}
        />
      </motion.div>

      {/* Graphiques ligne 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Évolution absentéisme */}
        <motion.div
          className="p-6 bg-card border border-border rounded-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold">Taux d'absentéisme</h3>
              <p className="text-sm text-muted-foreground">Évolution sur 6 mois</p>
            </div>
            <div className="p-2 bg-primary/10 rounded-sm">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={donneesAbsenteisme}>
                <defs>
                  <linearGradient id="colorTaux" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.82 0.165 85)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="oklch(0.82 0.165 85)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.88 0.01 90)" />
                <XAxis dataKey="mois" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'oklch(1 0 0)',
                    border: '1px solid oklch(0.88 0.01 90)',
                    borderRadius: '4px',
                  }}
                  formatter={(value: number) => [`${value}%`, 'Taux']}
                />
                <Area
                  type="monotone"
                  dataKey="taux"
                  stroke="oklch(0.82 0.165 85)"
                  strokeWidth={2}
                  fill="url(#colorTaux)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Congés par type */}
        <motion.div
          className="p-6 bg-card border border-border rounded-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold">Répartition des congés</h3>
              <p className="text-sm text-muted-foreground">Par type</p>
            </div>
            <div className="p-2 bg-primary/10 rounded-sm">
              <PieChartIcon className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="h-64 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.typesCongesUtilises}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="nombre"
                  nameKey="type"
                  animationDuration={1000}
                >
                  {stats.typesCongesUtilises.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COULEURS_PIE[index % COULEURS_PIE.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'oklch(1 0 0)',
                    border: '1px solid oklch(0.88 0.01 90)',
                    borderRadius: '4px',
                  }}
                  formatter={(value: number) => [`${value} jours`, '']}
                />
                <Legend
                  verticalAlign="middle"
                  align="right"
                  layout="vertical"
                  iconType="square"
                  iconSize={10}
                  formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Graphique congés par mois */}
      <motion.div
        className="p-6 bg-card border border-border rounded-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold">Congés et RTT par mois</h3>
            <p className="text-sm text-muted-foreground">Comparaison sur 6 mois</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-primary" />
              <span className="text-sm text-muted-foreground">Congés</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'oklch(0.25 0.01 60)' }} />
              <span className="text-sm text-muted-foreground">RTT</span>
            </div>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={donneesCongesParMois} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.88 0.01 90)" />
              <XAxis dataKey="mois" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'oklch(1 0 0)',
                  border: '1px solid oklch(0.88 0.01 90)',
                  borderRadius: '4px',
                }}
                formatter={(value: number, name: string) => [
                  `${value} jours`,
                  name === 'conges' ? 'Congés' : 'RTT'
                ]}
              />
              <Bar dataKey="conges" fill="oklch(0.82 0.165 85)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="rtt" fill="oklch(0.25 0.01 60)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Répartition par département */}
      <motion.div
        className="p-6 bg-card border border-border rounded-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="mb-6">
          <h3 className="font-semibold">Effectif par département</h3>
          <p className="text-sm text-muted-foreground">Répartition actuelle</p>
        </div>
        <div className="space-y-4">
          {stats.repartitionDepartements.map((dept, index) => (
            <motion.div
              key={dept.departement}
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <span className="w-32 text-sm text-muted-foreground truncate">
                {dept.departement}
              </span>
              <div className="flex-1 h-6 bg-muted rounded-sm overflow-hidden">
                <motion.div
                  className="h-full rounded-sm"
                  style={{ 
                    backgroundColor: index % 2 === 0 ? 'oklch(0.82 0.165 85)' : 'oklch(0.25 0.01 60)',
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(dept.effectif / 15) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.1 * index }}
                />
              </div>
              <span className="w-12 text-sm font-medium text-right">
                {dept.effectif}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

// Composant KPI Card
interface KPICardProps {
  titre: string
  valeur: number
  suffixe?: string
  description?: string
  tendance?: { valeur: number; positif: boolean }
  icone: React.ReactNode
  delai?: number
}

function KPICard({ titre, valeur, suffixe = '', description, tendance, icone, delai = 0 }: KPICardProps) {
  return (
    <motion.div
      className="p-5 bg-card border border-border rounded-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delai }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 bg-primary/10 rounded-sm text-primary">
          {icone}
        </div>
        {tendance && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-sm ${
            tendance.positif ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
          }`}>
            {tendance.positif ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(tendance.valeur)}%
          </div>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-1">{titre}</p>
      <div className="flex items-end gap-1">
        <AnimatedNumber valeur={valeur} className="text-2xl font-semibold" decimales={suffixe === '%' ? 1 : 0} />
        {suffixe && <span className="text-xl font-semibold">{suffixe}</span>}
      </div>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </motion.div>
  )
}
