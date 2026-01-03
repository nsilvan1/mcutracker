'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Calendar, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  watchedCount: number;
  totalCount: number;
  onScrollToContent: () => void;
}

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function HeroSection({ watchedCount, totalCount, onScrollToContent }: HeroSectionProps) {
  const percentage = Math.round((watchedCount / totalCount) * 100);
  const targetDate = new Date('2026-12-18T00:00:00').getTime();

  const [countdown, setCountdown] = useState<Countdown>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
      }
    };

    // Atualizar imediatamente
    updateCountdown();

    // Atualizar a cada segundo
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            {/* Progress Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4 px-6 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl"
            >
              <div className="relative w-14 h-14">
                <svg className="w-14 h-14 transform -rotate-90">
                  <circle
                    cx="28"
                    cy="28"
                    r="24"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-white/10"
                  />
                  <motion.circle
                    cx="28"
                    cy="28"
                    r="24"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    className="text-marvel-red"
                    initial={{ strokeDasharray: '0 151' }}
                    animate={{ strokeDasharray: `${(percentage / 100) * 151} 151` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
                  {percentage}%
                </span>
              </div>
              <div className="text-left">
                <p className="text-white font-bold text-lg">{watchedCount} de {totalCount}</p>
                <p className="text-gray-500 text-sm">assistidos</p>
              </div>
            </motion.div>

            {/* Countdown Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="px-6 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl"
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-marvel-red" />
                <p className="text-gray-400 text-sm font-medium">até Doomsday</p>
              </div>
              <div className="flex items-baseline justify-center gap-1">
                {[
                  { value: countdown.days, label: 'd' },
                  { value: countdown.hours, label: 'h' },
                  { value: countdown.minutes, label: 'm' },
                  { value: countdown.seconds, label: 's' },
                ].map((item, index) => (
                  <div key={item.label} className="flex items-baseline">
                    {index > 0 && <span className="text-gray-600 text-lg mx-0.5">:</span>}
                    <motion.span
                      key={item.value}
                      initial={{ scale: 1.1, opacity: 0.7 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="text-2xl font-bold text-white tabular-nums"
                    >
                      {item.value.toString().padStart(2, '0')}
                    </motion.span>
                    <span className="text-xs text-gray-500 ml-0.5">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(229, 9, 20, 0.4)' }}
            whileTap={{ scale: 0.98 }}
            onClick={onScrollToContent}
            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-marvel-red via-red-600 to-marvel-red bg-[length:200%_100%] hover:bg-right rounded-2xl font-bold text-lg text-white shadow-xl shadow-marvel-red/25 transition-all duration-500 overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <Play className="w-6 h-6 fill-current group-hover:scale-110 transition-transform duration-300" />
            <span className="relative">Começar Maratona</span>
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
