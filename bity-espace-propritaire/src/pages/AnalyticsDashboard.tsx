import React from 'react';
import { Layout } from '../components/Layout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { MOCK_PROPERTIES } from '../constants';
import { ArrowUpRight, TrendingUp, Users, Wallet } from 'lucide-react';
import { motion } from 'motion/react';

const visitData = [
  { name: '1', views: 40 },
  { name: '5', views: 30 },
  { name: '10', views: 55 },
  { name: '15', views: 45 },
  { name: '20', views: 70 },
  { name: '25', views: 65 },
  { name: '30', views: 92 },
];

const revenueData = [
  { month: 'Jan', amount: 1200 },
  { month: 'Fév', amount: 1100 },
  { month: 'Mar', amount: 2400 },
  { month: 'Avr', amount: 2200 },
  { month: 'Mai', amount: 3200 },
  { month: 'Juin', amount: 4500 },
];

const AnalyticsDashboard = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
          <p className="text-on-surface-variant text-lg">Suivi & Analytique</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Views Chart */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 border border-surface-container-highest shadow-sm lg:col-span-2"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-primary">Attractivité de l'annonce</h2>
              <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-bold">30 Jours</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={visitData}>
                  <Line 
                    type="monotone" 
                    dataKey="views" 
                    stroke="#0051d5" 
                    strokeWidth={4} 
                    dot={false}
                    animationDuration={2000}
                  />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#76777d' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Reliability Score */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 border border-surface-container-highest shadow-sm flex flex-col items-center justify-center text-center"
          >
            <h2 className="text-xl font-bold text-primary mb-8">Score de Fiabilité</h2>
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="#eceef0" strokeWidth="10" fill="transparent" />
                <circle 
                  cx="80" cy="80" r="70" 
                  stroke="#0051d5" strokeWidth="10" 
                  fill="transparent" 
                  strokeDasharray={440} 
                  strokeDashoffset={440 - (440 * 0.92)} 
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-primary">92</span>
                <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold mt-1">+3%</span>
              </div>
            </div>
            <p className="text-xs font-medium text-on-surface-variant mt-6">Évolution positive sur les 3 derniers mois</p>
          </motion.div>

          {/* Revenue Chart */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 border border-surface-container-highest shadow-sm lg:col-span-3"
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <Wallet className="text-secondary" />
                <h2 className="text-xl font-bold text-primary">Revenus locatifs</h2>
              </div>
              <span className="text-sm font-medium text-on-surface-variant">Année en cours</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                    {revenueData.map((entry, index) => (
                      <Cell 
                        key={index} 
                        fill={index === revenueData.length - 1 ? '#0051d5' : '#316bf330'} 
                      />
                    ))}
                  </Bar>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#76777d' }} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Portfolio Table/List */}
        <section className="space-y-4">
          <div className="flex justify-between items-end border-b border-surface-container pb-2">
            <h2 className="text-xl font-bold text-primary">Suivi du Parc Immobilier</h2>
            <button className="text-secondary text-sm font-bold hover:underline">Voir tout</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_PROPERTIES.map(p => (
              <div key={p.id} className="bg-white p-4 rounded-xl border border-surface-container group hover:shadow-md transition-all flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-surface-dim overflow-hidden shrink-0">
                  <img src={p.image} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold truncate text-primary">{p.title}</h3>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold border border-emerald-100 shrink-0">100% Vérifié</span>
                  </div>
                  <p className="text-xs text-on-surface-variant truncate mb-2">{p.location} • {p.squareMeters}m²</p>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${p.status === 'Loué' ? 'bg-secondary' : 'bg-amber-500'}`} />
                    <span className={`text-xs font-bold ${p.status === 'Loué' ? 'text-secondary' : 'text-amber-600'}`}>
                      {p.status === 'Loué' ? `Loué à ${p.tenant}` : 'Disponible'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default AnalyticsDashboard;
