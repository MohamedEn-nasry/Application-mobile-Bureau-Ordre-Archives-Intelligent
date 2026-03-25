import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts';
import { Download, Calendar, TrendingUp, ArrowDownLeft, ArrowUpRight, Clock, Archive } from 'lucide-react';
import { StatusBar } from '../layout/StatusBar';
import { TopBar } from '../layout/TopBar';
import { BottomNav } from '../layout/BottomNav';
import { monthlyChartData, categoryChartData, activityLineData, dashboardStats } from '../../data/mockData';

const dateRanges = ['7 jours', '30 jours', '3 mois', '6 mois', '1 an'];

export function ReportsScreen() {
  const [activeRange, setActiveRange] = useState('6 mois');

  const summaryStats = [
    { label: 'Entrant', value: dashboardStats.incoming, icon: ArrowDownLeft, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Sortant', value: dashboardStats.outgoing, icon: ArrowUpRight, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'En attente', value: dashboardStats.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Archivés', value: dashboardStats.archived, icon: Archive, color: 'text-slate-600', bg: 'bg-slate-50' },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      <StatusBar />
      <TopBar title="Rapports & Analytiques" showBack showMore />

      <div className="flex-1 overflow-y-auto bg-slate-50 pb-4" style={{ scrollbarWidth: 'none' }}>
        {/* Date range */}
        <div className="bg-white border-b border-slate-100 px-4 py-3 shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={13} className="text-blue-600" />
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Période</span>
          </div>
          <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {dateRanges.map((range) => (
              <button
                key={range}
                onClick={() => setActiveRange(range)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${activeRange === range ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Summary stats */}
        <div className="px-4 pt-4">
          <div className="grid grid-cols-2 gap-2.5">
            {summaryStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100 flex items-center gap-3">
                  <div className={`w-9 h-9 ${stat.bg} rounded-xl flex items-center justify-center shrink-0`}>
                    <Icon size={16} className={stat.color} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-slate-800">{stat.value}</p>
                    <p className="text-xs text-slate-500">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly bar chart */}
        <div className="mx-4 mt-4 bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-800">Courrier Mensuel</h3>
              <p className="text-xs text-slate-400">Entrant vs Sortant</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500" /><span className="text-xs text-slate-500">Entrant</span></div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-indigo-400" /><span className="text-xs text-slate-500">Sortant</span></div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={monthlyChartData} barSize={10} barGap={3}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={25} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 11 }}
                cursor={{ fill: '#f8fafc' }}
              />
              <Bar dataKey="entrant" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Entrant" />
              <Bar dataKey="sortant" fill="#818CF8" radius={[4, 4, 0, 0]} name="Sortant" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category pie chart */}
        <div className="mx-4 mt-3 bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <div className="mb-3">
            <h3 className="text-xs font-bold text-slate-800">Courrier par Catégorie</h3>
            <p className="text-xs text-slate-400">Répartition des 6 derniers mois</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="shrink-0">
              <PieChart width={120} height={120}>
                <Pie
                  data={categoryChartData}
                  cx={55}
                  cy={55}
                  innerRadius={35}
                  outerRadius={55}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </div>
            <div className="flex-1 space-y-2">
              {categoryChartData.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="text-xs text-slate-600">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${cat.value}%`, backgroundColor: cat.color }} />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 w-8 text-right">{cat.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User activity line chart */}
        <div className="mx-4 mt-3 bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={14} className="text-green-600" />
            <div>
              <h3 className="text-xs font-bold text-slate-800">Activité Utilisateurs</h3>
              <p className="text-xs text-slate-400">Actions cette semaine</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={110}>
            <LineChart data={activityLineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={25} />
              <Tooltip
                contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 11 }}
              />
              <Line
                type="monotone"
                dataKey="actions"
                stroke="#2563EB"
                strokeWidth={2.5}
                dot={{ fill: '#2563EB', r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Key metrics */}
        <div className="mx-4 mt-3 bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <h3 className="text-xs font-bold text-slate-800 mb-3">Indicateurs Clés</h3>
          <div className="space-y-3">
            {[
              { label: 'Taux de traitement', value: '87%', change: '+4%', good: true },
              { label: 'Délai moyen de traitement', value: '2.3j', change: '-0.5j', good: true },
              { label: 'Courriers en retard', value: '12', change: '+3', good: false },
              { label: 'Taux d\'archivage', value: '94%', change: '+2%', good: true },
            ].map((metric) => (
              <div key={metric.label} className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0">
                <p className="text-xs text-slate-600">{metric.label}</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-800">{metric.value}</span>
                  <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${metric.good ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {metric.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export button */}
        <div className="mx-4 mt-4 mb-2">
          <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 active:scale-95 transition-transform">
            <Download size={16} />
            Exporter le Rapport PDF
          </button>
        </div>
      </div>

      <BottomNav active="dashboard" />
    </div>
  );
}
