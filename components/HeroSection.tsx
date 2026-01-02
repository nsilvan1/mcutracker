'use client';

import { motion } from 'framer-motion';
import { Play, Calendar, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  watchedCount: number;
  totalCount: number;
  onScrollToContent: () => void;
}

export default function HeroSection({ watchedCount, totalCount, onScrollToContent }: HeroSectionProps) {
  const percentage = Math.round((watchedCount / totalCount) * 100);
  const daysUntilDoomsday = Math.ceil(
    (new Date('2026-05-01').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="relative min-h-[60vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-marvel-dark via-marvel-gray to-marvel-dark" />

      {/* Animated orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-marvel-red/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-marvel-red/20 border border-marvel-red/30 rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4 text-marvel-red" />
            <span className="text-sm text-marvel-red font-medium">Maratona até Vingadores: Doomsday</span>
          </motion.div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4">
            <span className="text-white">Sua Jornada no </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-marvel-red to-red-400">
              MCU
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Acompanhe seu progresso assistindo todas as produções da Marvel em ordem cronológica ou de lançamento
          </p>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-3 px-5 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl"
            >
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 transform -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-white/10"
                  />
                  <motion.circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    className="text-marvel-red"
                    initial={{ strokeDasharray: '0 126' }}
                    animate={{ strokeDasharray: `${(percentage / 100) * 126} 126` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                  {percentage}%
                </span>
              </div>
              <div className="text-left">
                <p className="text-white font-bold">{watchedCount} de {totalCount}</p>
                <p className="text-gray-500 text-sm">assistidos</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-3 px-5 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl"
            >
              <div className="p-2.5 bg-marvel-red/20 rounded-xl">
                <Calendar className="w-6 h-6 text-marvel-red" />
              </div>
              <div className="text-left">
                <p className="text-white font-bold">{daysUntilDoomsday} dias</p>
                <p className="text-gray-500 text-sm">até Doomsday</p>
              </div>
            </motion.div>
          </div>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onScrollToContent}
            className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-marvel-red to-red-600 rounded-xl font-bold text-white shadow-lg shadow-marvel-red/30 hover:shadow-xl hover:shadow-marvel-red/40 transition-all"
          >
            <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Começar Maratona</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
          <motion.div
            className="w-1.5 h-1.5 bg-white/50 rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </div>
  );
}
