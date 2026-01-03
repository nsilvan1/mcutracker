'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  GitBranch,
  Trophy,
  Share2,
  Filter,
  Wifi,
  WifiOff,
  Shield,
  Zap,
  Check,
  PartyPopper,
} from 'lucide-react';

const CURRENT_VERSION = '2.0.0';

interface WhatsNewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDontShowAgain: () => void;
  isLoggedIn: boolean;
}

const updates = [
  {
    icon: GitBranch,
    title: 'Timeline Interativa',
    description: 'Explore o MCU em ordem cronológica ou de lançamento com informações detalhadas sobre cada fase.',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
  },
  {
    icon: Trophy,
    title: 'Sistema de Conquistas',
    description: '18 conquistas para desbloquear conforme você assiste o MCU. Complete todas as fases!',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
  },
  {
    icon: Share2,
    title: 'Compartilhamento Social',
    description: 'Compartilhe seu progresso no Twitter, Facebook e WhatsApp.',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
  },
  {
    icon: Filter,
    title: 'Filtros Avançados',
    description: 'Filtre por ano de lançamento e diretor para encontrar exatamente o que procura.',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
  },
  {
    icon: WifiOff,
    title: 'Modo Offline',
    description: 'Acesse o MCU Tracker mesmo sem conexão com a internet (PWA).',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
  },
  {
    icon: Shield,
    title: 'Segurança Melhorada',
    description: 'Rate limiting e validação avançada para proteger sua conta.',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
  },
];

export default function WhatsNewModal({
  isOpen,
  onClose,
  onDontShowAgain,
  isLoggedIn,
}: WhatsNewModalProps) {
  const [dontShow, setDontShow] = useState(false);

  const handleClose = () => {
    if (dontShow) {
      onDontShowAgain();
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[90vh] overflow-hidden bg-marvel-dark border border-white/10 rounded-2xl shadow-2xl"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-marvel-red/20 via-purple-500/20 to-blue-500/20 p-6 border-b border-white/10">
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-4 -right-4 w-32 h-32 bg-marvel-red/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />
              </div>

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-marvel-red to-purple-600 flex items-center justify-center shadow-lg shadow-marvel-red/30">
                    <PartyPopper className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      Novidades!
                      <Sparkles className="w-5 h-5 text-yellow-400" />
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Versão {CURRENT_VERSION} - Janeiro 2026
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <p className="text-gray-300 mb-6">
                Preparamos várias novidades para melhorar sua experiência de maratona até{' '}
                <span className="text-marvel-red font-semibold">Vingadores: Doomsday</span>!
              </p>

              <div className="grid gap-3">
                {updates.map((update, index) => (
                  <motion.div
                    key={update.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-start gap-4 p-4 rounded-xl ${update.bgColor} border ${update.borderColor}`}
                  >
                    <div className={`p-2 rounded-lg ${update.bgColor}`}>
                      <update.icon className={`w-5 h-5 ${update.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{update.title}</h3>
                      <p className="text-sm text-gray-400">{update.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 bg-white/5">
              <label className="flex items-center gap-3 mb-4 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={dontShow}
                    onChange={(e) => setDontShow(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 transition-all ${
                      dontShow
                        ? 'bg-marvel-red border-marvel-red'
                        : 'border-gray-500 group-hover:border-gray-400'
                    }`}
                  >
                    {dontShow && <Check className="w-4 h-4 text-white" />}
                  </div>
                </div>
                <span className="text-sm text-gray-400 group-hover:text-gray-300">
                  Não mostrar novamente {!isLoggedIn && '(salvo localmente)'}
                </span>
              </label>

              <button
                onClick={handleClose}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-marvel-red to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold transition-all shadow-lg shadow-marvel-red/20"
              >
                <span className="flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5" />
                  Começar a explorar!
                </span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { CURRENT_VERSION };
