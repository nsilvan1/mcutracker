'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft, Zap } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-marvel-dark flex items-center justify-center px-4 overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-marvel-red/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[128px] animate-pulse delay-1000" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="relative z-10 text-center max-w-lg">
        {/* Animated 404 */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="relative mb-8"
        >
          <h1 className="text-[150px] sm:text-[200px] font-black text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-transparent leading-none select-none">
            404
          </h1>

          {/* Glitch effect overlay */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{
              x: [0, -2, 2, 0],
              opacity: [1, 0.8, 0.8, 1]
            }}
            transition={{
              duration: 0.2,
              repeat: Infinity,
              repeatDelay: 3
            }}
          >
            <span className="text-[150px] sm:text-[200px] font-black text-marvel-red/30 leading-none select-none">
              404
            </span>
          </motion.div>

          {/* Snap effect particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-marvel-red rounded-full"
              style={{
                top: `${30 + Math.random() * 40}%`,
                left: `${20 + Math.random() * 60}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                y: [0, -20],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </motion.div>

        {/* Icon */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-marvel-red to-red-700 flex items-center justify-center shadow-lg shadow-marvel-red/20">
            <Zap className="w-8 h-8 text-white" />
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Realidade não encontrada
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Parece que Thanos estalou os dedos e essa página desapareceu do multiverso.
            Mas não se preocupe, você pode voltar à sua maratona!
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-marvel-red to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-lg shadow-marvel-red/20 hover:shadow-marvel-red/40"
          >
            <Home className="w-5 h-5" />
            Voltar ao início
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/10"
          >
            <Search className="w-5 h-5" />
            Explorar MCU
          </Link>
        </motion.div>

        {/* Easter egg hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-gray-600 text-xs"
        >
          "Eu sou inevitável" - Página 404
        </motion.p>
      </div>
    </div>
  );
}
