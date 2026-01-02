'use client';

import { motion } from 'framer-motion';
import { Film, Tv, Clock, Trophy } from 'lucide-react';

interface StatsCardProps {
  totalMovies: number;
  totalSeries: number;
  watchedMovies: number;
  watchedSeries: number;
  totalHours: number;
}

export default function StatsCard({
  totalMovies,
  totalSeries,
  watchedMovies,
  watchedSeries,
  totalHours,
}: StatsCardProps) {
  const stats = [
    {
      icon: Film,
      label: 'Filmes',
      value: `${watchedMovies}/${totalMovies}`,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
    },
    {
      icon: Tv,
      label: 'Séries',
      value: `${watchedSeries}/${totalSeries}`,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
    },
    {
      icon: Clock,
      label: 'Horas',
      value: `${totalHours}h`,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
    },
    {
      icon: Trophy,
      label: 'Conquista',
      value: watchedMovies + watchedSeries >= 50 ? 'Completista!' : 'Em progresso',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-3"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all group"
        >
          {/* Gradient background on hover */}
          <div className={`absolute inset-0 ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity`} />

          <div className="relative z-10">
            <div className={`inline-flex p-2 rounded-lg ${stat.bgColor} mb-2`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className="text-gray-400 text-xs mb-1">{stat.label}</p>
            <p className="text-white font-bold text-lg">{stat.value}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
