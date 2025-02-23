'use client';

import { 
  BanknotesIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  TruckIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useState } from 'react';

// Définition des couleurs en premier
const COLORS = [
  '#CCFF00', // Lime
  '#FF3B3B', // Rouge
  '#FFD600', // Jaune
  '#2A2A2A'  // Noir
];

const formatFCFA = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const revenueData = [
  { name: 'Jan', value: 1500000 },
  { name: 'Fév', value: 1800000 },
  { name: 'Mar', value: 2200000 },
  { name: 'Avr', value: 1900000 },
  { name: 'Mai', value: 2500000 },
  { name: 'Juin', value: 2800000 },
];

const projectsData = [
  { name: 'Construction', value: 5, color: COLORS[0] },
  { name: 'Rénovation', value: 3, color: COLORS[1] },
  { name: 'Infrastructure', value: 4, color: COLORS[2] },
  { name: 'Maintenance', value: 2, color: COLORS[3] }
];

const statsCards = [
  {
    title: "Chiffre d'affaires",
    value: formatFCFA(2800000),
    change: '+12.5%',
    isPositive: true,
    icon: BanknotesIcon,
    description: 'Ce mois-ci'
  },
  {
    title: 'Employés actifs',
    value: '28',
    change: '+2',
    isPositive: true,
    icon: UserGroupIcon,
    description: 'Sur les chantiers'
  },
  {
    title: 'Projets en cours',
    value: '12',
    change: '-1',
    isPositive: false,
    icon: ClipboardDocumentCheckIcon,
    description: 'En phase active'
  },
  {
    title: 'Stock',
    value: formatFCFA(450000),
    change: '-8%',
    isPositive: false,
    icon: TruckIcon,
    description: 'Valeur totale'
  },
  {
    title: 'Dépenses',
    value: formatFCFA(1200000),
    change: '+5%',
    isPositive: false,
    icon: ChartBarIcon,
    description: 'Ce mois-ci'
  },
  {
    title: 'Équipements',
    value: formatFCFA(3500000),
    change: '+2%',
    isPositive: true,
    icon: WrenchScrewdriverIcon,
    description: 'Valeur totale'
  }
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-pro-white dark:bg-pro-black-light p-4 border border-pro-white-dark dark:border-pro-black-dark rounded-xl shadow-lg">
        <p className="text-sm text-pro-black dark:text-pro-white-off font-medium">{label}</p>
        <p className="text-lg font-semibold text-pro-black dark:text-pro-white mt-1">
          {formatFCFA(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('6m');

  return (
    <div className="space-y-8 p-6 sm:p-8 bg-pro-white-off dark:bg-[#374151] min-h-screen">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => (
          <div 
            key={stat.title} 
            className={`${
              index < 2 ? 'bg-pro-lime dark:bg-[#1F2937]' : 'bg-pro-white dark:bg-[#1F2937]'
            } rounded-xl p-6 shadow-sm border ${
              index < 2 ? 'border-pro-lime dark:border-[#374151]' : 'border-pro-white-dark dark:border-[#374151]'
            } transition-all duration-200 ${
              index < 2 ? 'hover:bg-pro-lime/90 dark:hover:border-pro-lime' : 'hover:border-pro-lime dark:hover:border-pro-lime'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${
                  index < 2 ? 'text-pro-black dark:text-white' : 'text-pro-black-light dark:text-white'
                }`}>{stat.title}</p>
                <p className={`text-2xl font-bold mt-2 tracking-tight ${
                  index < 2 ? 'text-pro-black dark:text-white' : 'text-pro-black dark:text-white'
                }`}>{stat.value}</p>
                <p className={`text-sm mt-1 ${
                  index < 2 ? 'text-pro-black/70 dark:text-white/60' : 'text-pro-black-light/70 dark:text-white/60'
                }`}>{stat.description}</p>
              </div>
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 ml-4 ${
                index < 2 ? 'bg-pro-black/10 dark:bg-black/20' : 'bg-black/10 dark:bg-black/20'
              }`}>
                <stat.icon className={`h-6 w-6 transition-all hover:scale-110 ${
                  index < 2 ? 'text-pro-black dark:text-pro-lime' : 'text-pro-black dark:text-pro-lime'
                }`} />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium flex items-center ${
                stat.isPositive 
                  ? 'text-pro-lime dark:text-pro-lime' 
                  : 'text-red-500 dark:text-red-400'
              }`}>
                {stat.isPositive ? <ArrowTrendingUpIcon className="h-4 w-4 mr-1" /> : <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />}
                {stat.change}
              </span>
              <span className={`text-sm ml-2 ${
                index < 2 ? 'text-pro-black/70 dark:text-white/60' : 'text-pro-black-light/70 dark:text-white/60'
              }`}>vs mois précédent</span>
            </div>
          </div>
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chiffre d'affaires */}
        <div className="bg-pro-white dark:bg-[#1F2937] rounded-xl p-6 shadow-sm border border-pro-white-dark dark:border-[#374151]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
            <h3 className="text-lg font-semibold text-pro-black dark:text-white">Évolution du CA</h3>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 bg-pro-white-off dark:bg-[#374151] border border-pro-white-dark dark:border-[#374151] rounded-lg text-sm text-pro-black-light dark:text-white focus:outline-none focus:ring-2 focus:ring-pro-lime/50 dark:focus:ring-pro-lime/30 transition-all"
            >
              <option value="1m">1 mois</option>
              <option value="3m">3 mois</option>
              <option value="6m">6 mois</option>
              <option value="1y">1 an</option>
            </select>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#CCFF00" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#CCFF00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-pro-white-dark dark:stroke-pro-black-dark" />
                <XAxis 
                  dataKey="name" 
                  className="text-pro-black-light dark:text-pro-white-off/70"
                  tick={{ fill: 'currentColor', fontSize: '12px' }}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <YAxis 
                  className="text-pro-black-light dark:text-pro-white-off/70"
                  tickFormatter={(value) => `${value / 1000}K`}
                  tick={{ fill: 'currentColor', fontSize: '12px' }}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#CCFF00"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution des projets */}
        <div className="bg-pro-white dark:bg-[#1F2937] rounded-xl p-6 shadow-sm border border-pro-white-dark dark:border-[#374151]">
          <h3 className="text-lg font-semibold mb-6 text-pro-black dark:text-white">Distribution des projets</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Pie
                  data={projectsData}
                  innerRadius={80}
                  outerRadius={140}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {projectsData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      className={index === 0 ? 'dark:opacity-90' : 'dark:opacity-70'} 
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            {projectsData.map((item, index) => (
              <div key={item.name} className="flex items-center p-3 rounded-lg hover:bg-pro-white-off dark:hover:bg-pro-black-dark transition-colors">
                <div 
                  className="w-3 h-3 rounded-full mr-3" 
                  style={{ 
                    backgroundColor: item.color,
                    opacity: index === 0 ? 1 : 0.9
                  }} 
                />
                <span className="text-sm text-pro-black-light dark:text-pro-white-off/90 font-medium">{item.name}</span>
                <span className="ml-auto font-semibold text-sm text-pro-black dark:text-pro-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
