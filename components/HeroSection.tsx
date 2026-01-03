'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Play, Calendar, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { mcuData } from '@/data/mcu-data';

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

  // Pegar apenas filmes do MCU para os posters (18 para 3 fileiras)
  const heroPosters = useMemo(() => {
    return mcuData
      .filter(item => item.type === 'movie')
      .slice(0, 18)
      .map(item => ({
        id: item.id,
        url: item.imageUrl,
        title: item.title,
      }));
  }, []);

  // Dividir posters em 3 fileiras
  const posterRows = useMemo(() => {
    const row1 = heroPosters.slice(0, 6);
    const row2 = heroPosters.slice(6, 12);
    const row3 = heroPosters.slice(12, 18);
    return [row1, row2, row3];
  }, [heroPosters]);

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

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Base gradient - transparent to show Doomsday theme */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-doomsday-purple/5 to-transparent" />

      {/* Animated poster rows */}
      <div className="absolute inset-0 opacity-30">
        {posterRows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="absolute w-full flex gap-4 poster-row"
            style={{
              top: `${15 + rowIndex * 35}%`,
              transform: 'translateY(-50%)',
            }}
          >
            <motion.div
              className="flex gap-4 min-w-max"
              animate={{
                x: rowIndex % 2 === 0 ? ['0%', '-50%'] : ['-50%', '0%'],
              }}
              transition={{
                duration: 60,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              {/* Duplicar para loop infinito */}
              {[...row, ...row, ...row, ...row].map((poster, index) => (
                <div
                  key={`${poster.id}-${index}`}
                  className="relative w-32 md:w-40 aspect-[2/3] rounded-lg overflow-hidden flex-shrink-0"
                  style={{
                    transform: `rotate(${(index % 2 === 0 ? -3 : 3)}deg)`,
                  }}
                >
                  <Image
                    src={poster.url}
                    alt={poster.title}
                    fill
                    className="object-cover"
                    sizes="160px"
                    unoptimized
                  />
                </div>
              ))}
            </motion.div>
          </div>
        ))}
      </div>

      {/* Vignette overlay - transparent to show Doomsday theme */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />

      {/* Doomsday purple glow accent */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(107, 33, 168, 0.3) 0%, rgba(230, 36, 41, 0.15) 50%, transparent 70%)' }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.25, 0.4, 0.25],
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      {/* Multiverse Portal Rings */}
      <div className="absolute top-1/2 left-1/2 pointer-events-none">
        <div className="portal-ring portal-ring-1" />
        <div className="portal-ring portal-ring-2" />
        <div className="portal-ring portal-ring-3" />
      </div>

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
            className="inline-flex items-center gap-2 px-4 py-2 bg-marvel-red/20 backdrop-blur-sm border border-marvel-red/30 rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4 text-marvel-red" />
            <span className="text-sm text-marvel-red font-medium">Maratona até Vingadores: Doomsday</span>
          </motion.div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4">
            <span className="text-white drop-shadow-lg">Sua Jornada no </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-marvel-red to-red-400 drop-shadow-lg">
              MCU
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-2xl mx-auto drop-shadow-md">
            Acompanhe seu progresso assistindo todas as produções da Marvel em ordem cronológica ou de lançamento
          </p>

          {/* Stats */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            {/* Progress Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4 px-6 py-4 border border-white/20 rounded-2xl hover:bg-white/10 transition-colors"
              style={{ boxShadow: 'inset 0px 4px 24px 0px rgba(0, 0, 0, 0.15)' }}
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
                <p className="text-gray-400 text-sm">assistidos</p>
              </div>
            </motion.div>

            {/* Countdown Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="px-6 py-4 border border-white/20 rounded-2xl hover:bg-white/10 transition-colors"
              style={{ boxShadow: 'inset 0px 4px 24px 0px rgba(0, 0, 0, 0.15)' }}
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-marvel-red" />
                <p className="text-gray-300 text-sm font-medium">até Doomsday</p>
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
                    <span className="text-xs text-gray-400 ml-0.5">{item.label}</span>
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
            whileHover={{ scale: 1.02, boxShadow: '0 0 60px rgba(229, 9, 20, 0.6)' }}
            whileTap={{ scale: 0.98 }}
            onClick={onScrollToContent}
            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-marvel-red/80 hover:bg-marvel-red backdrop-blur-sm border border-marvel-red/50 rounded-2xl font-bold text-lg text-white shadow-2xl shadow-marvel-red/40 transition-all duration-300 overflow-hidden"
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
