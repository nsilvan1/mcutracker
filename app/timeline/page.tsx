'use client';

import { useState, useEffect, useMemo } from 'react';
import { mcuData, MCUItem } from '@/data/mcu-data';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Film,
  Tv,
  Clock,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Star,
  Info,
  Zap,
  Users,
  Sparkles,
  AlertTriangle,
  Link2,
  X,
  AlertOctagon,
  Eye,
  EyeOff,
} from 'lucide-react';

// Informações detalhadas sobre cada fase
const phaseInfo: Record<number, {
  name: string;
  subtitle: string;
  years: string;
  description: string;
  keyEvents: string[];
  mainVillain?: string;
  infinityStones?: string[];
  color: string;
}> = {
  1: {
    name: 'Saga do Infinito: Início',
    subtitle: 'O Nascimento dos Heróis',
    years: '2008-2012',
    description: 'A Fase 1 estabelece os fundamentos do MCU, apresentando os heróis que formarão os Vingadores. Cada filme introduz um personagem icônico e planta sementes para o futuro do universo.',
    keyEvents: [
      'Tony Stark se revela como Homem de Ferro',
      'Steve Rogers é descongelado após 70 anos',
      'Thor é banido para a Terra',
      'Formação da Iniciativa Vingadores',
      'Batalha de Nova York contra os Chitauri',
    ],
    mainVillain: 'Loki',
    infinityStones: ['Tesseract (Espaço)', 'Cetro de Loki (Mente)'],
    color: 'from-blue-500 to-blue-700',
  },
  2: {
    name: 'A Era de Ultron',
    subtitle: 'Consequências e Novos Heróis',
    years: '2013-2015',
    description: 'A Fase 2 expande o universo, explorando as consequências da Batalha de Nova York e introduzindo novos heróis como os Guardiões da Galáxia e Homem-Formiga.',
    keyEvents: [
      'Queda da S.H.I.E.L.D. / HYDRA revelada',
      'Criação e destruição de Ultron',
      'Introdução dos Guardiões da Galáxia',
      'Jóias do Infinito começam a se revelar',
      'Hank Pym passa o manto de Homem-Formiga',
    ],
    mainVillain: 'Ultron',
    infinityStones: ['Éter (Realidade)', 'Orbe (Poder)'],
    color: 'from-purple-500 to-purple-700',
  },
  3: {
    name: 'A Saga do Infinito',
    subtitle: 'Guerra Infinita',
    years: '2016-2019',
    description: 'A Fase 3 é o clímax épico da Saga do Infinito. Thanos coleta as Joias do Infinito, causando o Blip, e os Vingadores se reúnem uma última vez para reverter a tragédia.',
    keyEvents: [
      'Guerra Civil divide os Vingadores',
      'Introdução de Pantera Negra e Doutor Estranho',
      'Thanos coleta todas as Joias do Infinito',
      'O Estalo elimina metade da vida no universo',
      'Vingadores derrotam Thanos / Tony Stark se sacrifica',
    ],
    mainVillain: 'Thanos',
    infinityStones: ['Olho de Agamotto (Tempo)', 'Joia da Alma'],
    color: 'from-red-500 to-orange-600',
  },
  4: {
    name: 'A Saga do Multiverso',
    subtitle: 'Infinitas Possibilidades',
    years: '2021-2022',
    description: 'A Fase 4 introduz o conceito do Multiverso, com variantes, linhas temporais alternativas e novas ameaças cósmicas. Novos heróis assumem os mantos dos Vingadores originais.',
    keyEvents: [
      'Loki abre o Multiverso',
      'Wanda se torna Feiticeira Escarlate',
      'Introdução de Kang, o Conquistador',
      'América Chavez e viagens multiversais',
      'Novos Vingadores começam a surgir',
    ],
    mainVillain: 'Kang, o Conquistador',
    color: 'from-emerald-500 to-teal-600',
  },
  5: {
    name: 'A Nova Era',
    subtitle: 'Dinastia Kang',
    years: '2023-2024',
    description: 'A Fase 5 aprofunda a ameaça de Kang e suas variantes, enquanto novos e antigos heróis se preparam para a maior batalha do Multiverso.',
    keyEvents: [
      'Conselho de Kangs é apresentado',
      'Guardiões da Galáxia se despedem',
      'Quarteto Fantástico entra no MCU',
      'Thunderbolts são formados',
      'Preparação para Guerras Secretas',
    ],
    mainVillain: 'Variantes de Kang',
    color: 'from-yellow-500 to-amber-600',
  },
  6: {
    name: 'O Futuro',
    subtitle: 'Guerras Secretas',
    years: '2025-2027',
    description: 'A Fase 6 promete ser o clímax da Saga do Multiverso, culminando em Vingadores: Doomsday e Guerras Secretas, onde todos os universos colidem.',
    keyEvents: [
      'Vingadores: Doomsday (Maio 2026)',
      'Vingadores: Guerras Secretas (Maio 2027)',
      'Retorno do Doutor Destino',
      'Colisão de múltiplos universos',
      'Nova formação dos Vingadores',
    ],
    mainVillain: 'Doutor Destino / Beyonder',
    color: 'from-rose-500 to-pink-600',
  },
};

// Conexões entre produções
const connections: Record<string, { connectsTo: string[]; description: string }> = {
  'iron-man': {
    connectsTo: ['iron-man-2', 'avengers'],
    description: 'Cena pós-créditos introduz Nick Fury e a Iniciativa Vingadores',
  },
  'captain-america-first-avenger': {
    connectsTo: ['avengers', 'captain-america-winter-soldier'],
    description: 'O Tesseract é recuperado. Steve acorda no presente.',
  },
  'avengers': {
    connectsTo: ['iron-man-3', 'thor-dark-world', 'captain-america-winter-soldier'],
    description: 'Thanos é revelado na cena pós-créditos',
  },
  'thor-dark-world': {
    connectsTo: ['guardians-of-the-galaxy', 'thor-ragnarok'],
    description: 'Joia da Realidade entregue ao Colecionador',
  },
  'captain-america-winter-soldier': {
    connectsTo: ['avengers-age-of-ultron', 'captain-america-civil-war'],
    description: 'HYDRA infiltrada na S.H.I.E.L.D. é revelada',
  },
  'avengers-age-of-ultron': {
    connectsTo: ['captain-america-civil-war', 'thor-ragnarok'],
    description: 'Hulk desaparece. Thor parte para investigar as Joias.',
  },
  'captain-america-civil-war': {
    connectsTo: ['black-panther', 'spider-man-homecoming', 'avengers-infinity-war'],
    description: 'Vingadores divididos. Bucky congelado em Wakanda.',
  },
  'doctor-strange': {
    connectsTo: ['thor-ragnarok', 'avengers-infinity-war'],
    description: 'Joia do Tempo apresentada no Olho de Agamotto',
  },
  'thor-ragnarok': {
    connectsTo: ['avengers-infinity-war'],
    description: 'Thanos intercepta a nave asgardiana',
  },
  'avengers-infinity-war': {
    connectsTo: ['ant-man-wasp', 'avengers-endgame'],
    description: 'O Estalo elimina metade do universo',
  },
  'avengers-endgame': {
    connectsTo: ['wandavision', 'falcon-winter-soldier', 'loki', 'spider-man-far-from-home'],
    description: 'Viagem no tempo cria ramificações. Tony e Natasha morrem.',
  },
  'loki': {
    connectsTo: ['doctor-strange-multiverse', 'ant-man-quantumania'],
    description: 'Multiverso é liberado. Kang é introduzido.',
  },
  'wandavision': {
    connectsTo: ['doctor-strange-multiverse'],
    description: 'Wanda se torna a Feiticeira Escarlate',
  },
  'spider-man-no-way-home': {
    connectsTo: ['doctor-strange-multiverse'],
    description: 'Multiverso rachado. Mundo esquece Peter Parker.',
  },
};

// Períodos cronológicos
const chronologicalPeriods: Record<string, { label: string; year: string; description: string }> = {
  'captain-america-first-avenger': { label: 'Segunda Guerra Mundial', year: '1942-1945', description: 'A origem do Capitão América' },
  'captain-marvel': { label: 'Era Pré-Vingadores', year: '1995', description: 'Skrulls e Kree na Terra' },
  'iron-man': { label: 'Início da Era dos Heróis', year: '2008', description: 'Tony Stark se revela ao mundo' },
  'avengers': { label: 'Batalha de Nova York', year: '2012', description: 'O mundo conhece os Vingadores' },
  'avengers-age-of-ultron': { label: 'Era de Ultron', year: '2015', description: 'Consequências da IA' },
  'captain-america-civil-war': { label: 'Guerra Civil', year: '2016', description: 'Vingadores divididos' },
  'avengers-infinity-war': { label: 'Guerra Infinita', year: '2018', description: 'Thanos ataca' },
  'avengers-endgame': { label: 'O Blip', year: '2023', description: '5 anos depois do Estalo' },
  'loki': { label: 'Fim dos Tempos', year: 'Fora do tempo', description: 'TVA e Multiverso' },
};

export default function TimelinePage() {
  const [watchedItems, setWatchedItems] = useState<Set<string>>(new Set());
  const [expandedPhases, setExpandedPhases] = useState<Set<number>>(new Set([1, 2, 3, 4, 5, 6]));
  const [viewMode, setViewMode] = useState<'chronological' | 'release'>('chronological');
  const [selectedItem, setSelectedItem] = useState<MCUItem | null>(null);
  const [showConnections, setShowConnections] = useState(true);
  const [showSpoilerWarning, setShowSpoilerWarning] = useState(true);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('mcu-watched');
    if (saved) {
      setWatchedItems(new Set(JSON.parse(saved)));
    }

    // Verificar se o usuário já aceitou o aviso de spoiler
    const spoilerAccepted = localStorage.getItem('mcu-spoiler-warning-accepted');
    if (spoilerAccepted === 'true') {
      setShowSpoilerWarning(false);
    }
  }, []);

  const handleAcceptSpoilerWarning = () => {
    if (dontShowAgain) {
      localStorage.setItem('mcu-spoiler-warning-accepted', 'true');
    }
    setShowSpoilerWarning(false);
  };

  const groupedItems = useMemo(() => {
    // Primeiro agrupa por fase
    const groups: Map<number, MCUItem[]> = new Map();
    mcuData.forEach((item) => {
      const phase = item.phase;
      if (!groups.has(phase)) {
        groups.set(phase, []);
      }
      groups.get(phase)!.push(item);
    });

    // Converte para array e ordena as fases em ordem numérica (1, 2, 3, 4, 5, 6)
    const result = Array.from(groups.entries())
      .sort(([phaseA], [phaseB]) => phaseA - phaseB)
      .map(([phase, items]) => ({
        phase,
        // Ordena os items dentro de cada fase pela ordem escolhida
        items: [...items].sort((a, b) =>
          viewMode === 'chronological'
            ? a.chronologicalOrder - b.chronologicalOrder
            : a.releaseOrder - b.releaseOrder
        ),
      }));

    return result;
  }, [viewMode]);

  const togglePhase = (phase: number) => {
    setExpandedPhases((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(phase)) {
        newSet.delete(phase);
      } else {
        newSet.add(phase);
      }
      return newSet;
    });
  };

  const getPhaseProgress = (phase: number) => {
    const phaseItems = mcuData.filter((item) => item.phase === phase);
    const watched = phaseItems.filter((item) => watchedItems.has(item.id)).length;
    return { watched, total: phaseItems.length };
  };

  const totalProgress = {
    watched: mcuData.filter((item) => watchedItems.has(item.id)).length,
    total: mcuData.length,
  };

  return (
    <div className="min-h-screen bg-marvel-dark">
      {/* Spoiler Warning Modal */}
      <AnimatePresence>
        {showSpoilerWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-marvel-dark border border-yellow-500/30 rounded-2xl overflow-hidden shadow-2xl shadow-yellow-500/10"
            >
              {/* Warning Header */}
              <div className="bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 p-6 border-b border-yellow-500/20">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                    <AlertOctagon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-yellow-400">
                      Aviso de Spoilers!
                    </h2>
                    <p className="text-yellow-500/70 text-sm">
                      Esta página contém informações sensíveis
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                    <EyeOff className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-300">
                        A <strong className="text-white">Timeline</strong> revela a ordem cronológica dos eventos do MCU,
                        incluindo informações sobre conexões entre filmes e séries que podem conter <strong className="text-red-400">spoilers significativos</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                    <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-300">
                        Se você ainda não assistiu todo o MCU, recomendamos usar a <strong className="text-blue-400">página principal</strong> para
                        marcar seu progresso sem revelar spoilers.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                    <Eye className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-300">
                        Esta página é ideal para quem já assistiu o MCU e quer fazer uma <strong className="text-green-400">maratona em ordem cronológica</strong> ou
                        entender melhor as conexões entre as produções.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Checkbox */}
                <label className="flex items-center gap-3 mt-6 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={dontShowAgain}
                      onChange={(e) => setDontShowAgain(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 transition-all ${
                      dontShowAgain
                        ? 'bg-marvel-red border-marvel-red'
                        : 'border-gray-500 group-hover:border-gray-400'
                    }`}>
                      {dontShowAgain && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-gray-400 group-hover:text-gray-300">
                    Não mostrar este aviso novamente
                  </span>
                </label>

                {/* Buttons */}
                <div className="flex gap-3 mt-6">
                  <Link
                    href="/"
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-medium text-center transition-all"
                  >
                    Voltar para Home
                  </Link>
                  <button
                    onClick={handleAcceptSpoilerWarning}
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-marvel-red to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium transition-all shadow-lg shadow-marvel-red/20"
                  >
                    Entendi, continuar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-marvel-dark/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Voltar</span>
            </Link>

            <div className="text-center">
              <h1 className="text-xl md:text-2xl font-bold text-white">Timeline do MCU</h1>
              <p className="text-xs text-gray-500">
                {totalProgress.watched}/{totalProgress.total} assistidos ({Math.round((totalProgress.watched / totalProgress.total) * 100)}%)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowConnections(!showConnections)}
                className={`p-2 rounded-lg transition-all ${
                  showConnections
                    ? 'bg-marvel-red/20 text-marvel-red'
                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                }`}
                title="Mostrar conexões"
              >
                <Link2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('chronological')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'chronological'
                    ? 'bg-marvel-red text-white'
                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                }`}
              >
                Cronológica
              </button>
              <button
                onClick={() => setViewMode('release')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'release'
                    ? 'bg-marvel-red text-white'
                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                }`}
              >
                Lançamento
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mode description */}
      <div className="bg-gradient-to-r from-marvel-red/10 to-transparent border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3 text-sm">
            <Info className="w-4 h-4 text-marvel-red shrink-0" />
            {viewMode === 'chronological' ? (
              <p className="text-gray-400">
                <span className="text-white font-medium">Ordem Cronológica:</span> Eventos na ordem em que acontecem dentro do universo MCU,
                começando na Segunda Guerra Mundial com Capitão América.
              </p>
            ) : (
              <p className="text-gray-400">
                <span className="text-white font-medium">Ordem de Lançamento:</span> Filmes e séries na ordem em que foram lançados nos cinemas/streaming,
                a forma como a história foi originalmente contada.
              </p>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-marvel-red via-red-600/50 to-transparent rounded-full" />

          {groupedItems.map(({ phase, items }, groupIndex) => {
            const progress = getPhaseProgress(phase);
            const isExpanded = expandedPhases.has(phase);
            const info = phaseInfo[phase];

            return (
              <motion.div
                key={phase}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: groupIndex * 0.1 }}
                className="relative mb-12"
              >
                {/* Phase header */}
                <div className="relative z-10 mb-6">
                  {/* Phase marker */}
                  <div className={`absolute left-4 md:left-8 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-br ${info?.color || 'from-marvel-red to-red-700'} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                    {phase}
                  </div>

                  {/* Phase info card */}
                  <div className="ml-16 md:ml-20">
                    <button
                      onClick={() => togglePhase(phase)}
                      className="w-full text-left"
                    >
                      <div className={`bg-gradient-to-r ${info?.color || 'from-marvel-red to-red-700'} bg-opacity-10 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all`}
                        style={{ background: `linear-gradient(to right, rgba(0,0,0,0.3), transparent)` }}
                      >
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h2 className="text-xl md:text-2xl font-bold text-white">
                                Fase {phase}
                              </h2>
                              <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs text-gray-400">
                                {info?.years}
                              </span>
                            </div>
                            <h3 className="text-lg text-gray-300 font-medium">{info?.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">{info?.subtitle}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                              <div className="flex items-center gap-2 justify-end mb-1">
                                <div className="h-2 w-24 bg-white/10 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(progress.watched / progress.total) * 100}%` }}
                                    className="h-full bg-green-500 rounded-full"
                                  />
                                </div>
                                <span className="text-sm font-medium text-white">
                                  {progress.watched}/{progress.total}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">
                                {Math.round((progress.watched / progress.total) * 100)}% completo
                              </p>
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="w-6 h-6 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                        </div>

                        {/* Phase description */}
                        <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                          {info?.description}
                        </p>

                        {/* Phase metadata */}
                        <div className="flex flex-wrap gap-2">
                          {info?.mainVillain && (
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/20">
                              <AlertTriangle className="w-3 h-3 text-red-400" />
                              <span className="text-xs text-red-400">Vilão: {info.mainVillain}</span>
                            </div>
                          )}
                          {info?.infinityStones && info.infinityStones.length > 0 && (
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20">
                              <Sparkles className="w-3 h-3 text-purple-400" />
                              <span className="text-xs text-purple-400">
                                Joias: {info.infinityStones.join(', ')}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <Film className="w-3 h-3 text-blue-400" />
                            <span className="text-xs text-blue-400">
                              {items.filter(i => i.type === 'movie').length} filmes
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20">
                            <Tv className="w-3 h-3 text-purple-400" />
                            <span className="text-xs text-purple-400">
                              {items.filter(i => i.type === 'series').length} séries
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Key events */}
                    {info?.keyEvents && (
                      <div className="mt-3 p-4 bg-white/5 rounded-xl border border-white/5">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                          Eventos-chave desta fase
                        </h4>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {info.keyEvents.map((event, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <Zap className="w-3 h-3 text-yellow-500 mt-0.5 shrink-0" />
                              <span className="text-xs text-gray-400">{event}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Phase items */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-16 md:ml-20 space-y-4">
                        {items.map((item, itemIndex) => {
                          const period = chronologicalPeriods[item.id];
                          const connection = connections[item.id];

                          return (
                            <div key={item.id}>
                              {/* Period marker */}
                              {viewMode === 'chronological' && period && (
                                <motion.div
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="mb-3 flex items-center gap-3"
                                >
                                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                  <div className="px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                                    <span className="text-xs font-semibold text-yellow-400">
                                      {period.label}
                                    </span>
                                    <span className="text-xs text-yellow-500/70 ml-2">
                                      ({period.year})
                                    </span>
                                  </div>
                                </motion.div>
                              )}

                              <TimelineItem
                                item={item}
                                index={itemIndex}
                                isWatched={watchedItems.has(item.id)}
                                viewMode={viewMode}
                                onSelect={() => setSelectedItem(item)}
                                connection={showConnections ? connection : undefined}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10">
          <h3 className="text-lg font-bold text-white mb-4">Legenda</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-blue-500/30 border border-blue-500" />
              <span className="text-sm text-gray-400">Filme</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-purple-500/30 border border-purple-500" />
              <span className="text-sm text-gray-400">Série</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-green-500/30 border border-green-500" />
              <span className="text-sm text-gray-400">Assistido</span>
            </div>
            <div className="flex items-center gap-3">
              <Link2 className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-400">Conexão com outras produções</span>
            </div>
          </div>
        </div>

        {/* Chronology tip */}
        <div className="mt-6 p-4 bg-marvel-red/10 rounded-xl border border-marvel-red/20">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-marvel-red shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-white mb-1">Dica de Maratona</h4>
              <p className="text-xs text-gray-400">
                Para uma primeira vez assistindo o MCU, recomendamos a <strong className="text-white">ordem de lançamento</strong>.
                A ordem cronológica é melhor para rewatches, pois contém spoilers (como a cena pós-créditos de Capitã Marvel).
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Item detail modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-marvel-dark border border-white/10 rounded-2xl"
            >
              {/* Backdrop */}
              <div className="relative h-48 md:h-64">
                <Image
                  src={selectedItem.backdropUrl}
                  alt={selectedItem.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-marvel-dark via-marvel-dark/50 to-transparent" />
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="p-6 -mt-16 relative">
                <div className="flex gap-4">
                  <div className="relative w-24 h-36 rounded-lg overflow-hidden shrink-0 border-2 border-white/20 shadow-xl">
                    <Image
                      src={selectedItem.imageUrl}
                      alt={selectedItem.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 pt-12">
                    <h2 className="text-xl font-bold text-white mb-1">{selectedItem.title}</h2>
                    <p className="text-sm text-gray-400 mb-2">{selectedItem.originalTitle}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        selectedItem.type === 'movie'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-purple-500/20 text-purple-400'
                      }`}>
                        {selectedItem.type === 'movie' ? 'Filme' : 'Série'}
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs bg-white/10 text-gray-400">
                        Fase {selectedItem.phase}
                      </span>
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-yellow-500/20 text-yellow-400">
                        <Star className="w-3 h-3" />
                        {selectedItem.rating}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info grid */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Lançamento</p>
                    <p className="text-sm text-white font-medium">{selectedItem.releaseYear}</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Duração</p>
                    <p className="text-sm text-white font-medium">{selectedItem.duration || `${selectedItem.episodes} eps`}</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Ordem Cronológica</p>
                    <p className="text-sm text-white font-medium">#{selectedItem.chronologicalOrder}</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Ordem de Lançamento</p>
                    <p className="text-sm text-white font-medium">#{selectedItem.releaseOrder}</p>
                  </div>
                </div>

                {/* Synopsis */}
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-white mb-2">Sinopse</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{selectedItem.synopsis}</p>
                </div>

                {/* Cast */}
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-white mb-2">Elenco Principal</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.cast.slice(0, 6).map((actor) => (
                      <span key={actor} className="px-2 py-1 bg-white/5 rounded-lg text-xs text-gray-400">
                        {actor}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Director/Creator */}
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-white mb-2">
                    {selectedItem.director ? 'Diretor' : 'Criador'}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {selectedItem.director || selectedItem.creator}
                  </p>
                </div>

                {/* Connection info */}
                {connections[selectedItem.id] && (
                  <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Link2 className="w-4 h-4 text-yellow-500" />
                      <h3 className="text-sm font-semibold text-yellow-400">Conexões Importantes</h3>
                    </div>
                    <p className="text-sm text-gray-400">{connections[selectedItem.id].description}</p>
                  </div>
                )}

                {/* Post-credits info */}
                {selectedItem.postCreditsScenes && selectedItem.postCreditsScenes > 0 && (
                  <div className="mt-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <p className="text-sm text-purple-300">
                        <strong>{selectedItem.postCreditsScenes}</strong> cena{selectedItem.postCreditsScenes > 1 ? 's' : ''} pós-créditos - não saia do cinema!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TimelineItem({
  item,
  index,
  isWatched,
  viewMode,
  onSelect,
  connection,
}: {
  item: MCUItem;
  index: number;
  isWatched: boolean;
  viewMode: 'chronological' | 'release';
  onSelect: () => void;
  connection?: { connectsTo: string[]; description: string };
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="relative"
    >
      {/* Connector dot */}
      <div className="absolute -left-12 md:-left-12 w-3 h-3 rounded-full bg-white/20 border-2 border-white/30 mt-6" />

      {/* Card */}
      <div
        onClick={onSelect}
        className={`cursor-pointer bg-white/5 hover:bg-white/10 border rounded-xl p-4 transition-all ${
          isWatched ? 'border-green-500/30 bg-green-500/5' : 'border-white/10'
        }`}
      >
        <div className="flex gap-4">
          {/* Poster */}
          <div className="relative w-20 h-28 rounded-lg overflow-hidden shrink-0 group">
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="80px"
            />
            {isWatched && (
              <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                <Check className="w-8 h-8 text-green-500" />
              </div>
            )}
            {/* Order badge */}
            <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[10px] font-bold text-white">
              #{viewMode === 'chronological' ? item.chronologicalOrder : item.releaseOrder}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-white text-sm md:text-base leading-tight">
                {item.title}
              </h3>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="flex items-center gap-1 text-yellow-500 text-xs">
                  <Star className="w-3 h-3" />
                  {item.rating}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1 ${
                    item.type === 'movie'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-purple-500/20 text-purple-400'
                  }`}
                >
                  {item.type === 'movie' ? <Film className="w-3 h-3" /> : <Tv className="w-3 h-3" />}
                  <span className="hidden sm:inline">{item.type === 'movie' ? 'Filme' : 'Série'}</span>
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-500 mb-2">{item.originalTitle}</p>

            <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 mb-2">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {item.releaseYear}
              </span>
              {item.duration && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.duration}
                </span>
              )}
              {item.episodes && (
                <span className="flex items-center gap-1">
                  <Tv className="w-3 h-3" />
                  {item.episodes} episódios
                </span>
              )}
              {item.director && (
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {item.director}
                </span>
              )}
            </div>

            <p className="text-xs text-gray-400 line-clamp-2 mb-2">
              {item.description}
            </p>

            {/* Post-credits indicator */}
            {item.postCreditsScenes && item.postCreditsScenes > 0 && (
              <div className="flex items-center gap-1 text-purple-400 text-xs">
                <Sparkles className="w-3 h-3" />
                <span>{item.postCreditsScenes} cena{item.postCreditsScenes > 1 ? 's' : ''} pós-créditos</span>
              </div>
            )}
          </div>
        </div>

        {/* Connection info */}
        {connection && (
          <div className="mt-3 pt-3 border-t border-white/5">
            <div className="flex items-start gap-2">
              <Link2 className="w-3 h-3 text-yellow-500 mt-0.5 shrink-0" />
              <p className="text-xs text-yellow-400/80">{connection.description}</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
