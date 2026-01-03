'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  MousePointer,
  Eye,
  Filter,
  Trophy,
  Share2,
  GitBranch,
  User,
  Sparkles,
} from 'lucide-react';

interface OnboardingTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  onDontShowAgain: () => void;
  isLoggedIn: boolean;
}

const steps = [
  {
    id: 1,
    title: 'Bem-vindo ao MCU Tracker!',
    description: 'Acompanhe sua jornada pelo Universo Cinematográfico Marvel e prepare-se para Vingadores: Doomsday!',
    icon: Sparkles,
    color: 'from-marvel-red to-red-600',
    tip: 'Este tutorial vai mostrar como usar todas as funcionalidades do site.',
  },
  {
    id: 2,
    title: 'Marque como Assistido',
    description: 'Clique no ícone de olho em qualquer card para marcar um filme ou série como assistido.',
    icon: Eye,
    color: 'from-green-500 to-emerald-600',
    tip: 'Seu progresso é salvo automaticamente. Se você criar uma conta, ele será sincronizado na nuvem!',
    highlight: 'card-eye-button',
  },
  {
    id: 3,
    title: 'Use os Filtros',
    description: 'Filtre por filmes, séries, fases do MCU, ano de lançamento ou diretor.',
    icon: Filter,
    color: 'from-blue-500 to-cyan-600',
    tip: 'Combine múltiplos filtros para encontrar exatamente o que procura.',
    highlight: 'filters',
  },
  {
    id: 4,
    title: 'Ordene a Lista',
    description: 'Escolha entre ordem cronológica (eventos no universo) ou ordem de lançamento (data de estreia).',
    icon: GitBranch,
    color: 'from-purple-500 to-pink-600',
    tip: 'A ordem cronológica é ótima para rewatches, mas pode ter spoilers se você é novo no MCU.',
  },
  {
    id: 5,
    title: 'Explore a Timeline',
    description: 'Acesse a Timeline para uma visão completa de todas as fases do MCU com conexões entre produções.',
    icon: GitBranch,
    color: 'from-orange-500 to-amber-600',
    tip: 'A Timeline mostra eventos-chave, vilões principais e as Joias do Infinito de cada fase.',
  },
  {
    id: 6,
    title: 'Desbloqueie Conquistas',
    description: 'Complete marcos e ganhe conquistas! Assista filmes específicos ou complete fases inteiras.',
    icon: Trophy,
    color: 'from-yellow-500 to-orange-600',
    tip: 'São 18 conquistas com diferentes raridades: comum, rara, épica e lendária!',
  },
  {
    id: 7,
    title: 'Compartilhe seu Progresso',
    description: 'Mostre para seus amigos quanto do MCU você já assistiu nas redes sociais.',
    icon: Share2,
    color: 'from-pink-500 to-rose-600',
    tip: 'Compartilhe no Twitter, Facebook ou WhatsApp!',
  },
  {
    id: 8,
    title: 'Crie uma Conta',
    description: 'Com uma conta, seu progresso é salvo na nuvem e sincronizado em qualquer dispositivo.',
    icon: User,
    color: 'from-indigo-500 to-violet-600',
    tip: 'Você também pode acessar seu perfil e ver estatísticas detalhadas.',
  },
];

export default function OnboardingTutorial({
  isOpen,
  onClose,
  onDontShowAgain,
  isLoggedIn,
}: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShow, setDontShow] = useState(false);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    if (dontShow) {
      onDontShowAgain();
    }
    onClose();
    setCurrentStep(0);
  };

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-[70] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-lg bg-marvel-dark border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Progress bar */}
            <div className="h-1 bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-marvel-red to-red-500"
              />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <span className="text-sm text-gray-500">
                Passo {currentStep + 1} de {steps.length}
              </span>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="text-center"
                >
                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div
                      className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}
                    >
                      <step.icon className="w-10 h-10 text-white" />
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl font-bold text-white mb-3">{step.title}</h2>

                  {/* Description */}
                  <p className="text-gray-400 mb-6">{step.description}</p>

                  {/* Tip */}
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-start gap-3">
                      <MousePointer className="w-5 h-5 text-marvel-red shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-300 text-left">{step.tip}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Step indicators */}
            <div className="flex justify-center gap-2 pb-4">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentStep
                      ? 'w-6 bg-marvel-red'
                      : index < currentStep
                      ? 'bg-green-500'
                      : 'bg-white/20'
                  }`}
                />
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 bg-white/5">
              {/* Don't show again checkbox */}
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
                  Não mostrar tutorial novamente {!isLoggedIn && '(salvo localmente)'}
                </span>
              </label>

              {/* Navigation buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className={`flex-1 py-3 rounded-xl border font-medium transition-all flex items-center justify-center gap-2 ${
                    currentStep === 0
                      ? 'border-white/5 text-gray-600 cursor-not-allowed'
                      : 'border-white/10 text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  Anterior
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-marvel-red to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium transition-all flex items-center justify-center gap-2"
                >
                  {currentStep === steps.length - 1 ? (
                    <>
                      <Check className="w-5 h-5" />
                      Concluir
                    </>
                  ) : (
                    <>
                      Próximo
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
