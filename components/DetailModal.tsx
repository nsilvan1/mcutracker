'use client';

import { MCUItem } from '@/data/mcu-data';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Calendar, Star, Film, Tv, Play, Check, Clapperboard, Users, DollarSign, TrendingUp } from 'lucide-react';
import Image from 'next/image';

interface DetailModalProps {
  item: MCUItem | null;
  isOpen: boolean;
  isWatched: boolean;
  onClose: () => void;
  onToggleWatched: (id: string) => void;
}

export default function DetailModal({ item, isOpen, isWatched, onClose, onToggleWatched }: DetailModalProps) {
  if (!item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-10 lg:inset-20 z-50 overflow-hidden rounded-xl bg-marvel-dark border border-white/10 shadow-2xl flex flex-col"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 bg-black/60 hover:bg-black/80 rounded-full p-2 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1">
              {/* Hero section with backdrop */}
              <div className="relative h-64 md:h-80 lg:h-96">
                <Image
                  src={item.backdropUrl || item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-marvel-dark via-marvel-dark/60 to-transparent" />

                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <div className="flex items-start gap-4">
                    {/* Poster */}
                    <div className="hidden md:block relative w-32 lg:w-40 aspect-[2/3] rounded-lg overflow-hidden shadow-xl border-2 border-white/20 flex-shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-marvel-red px-2 py-1 rounded text-xs font-bold">
                          Fase {item.phase}
                        </span>
                        <span className="bg-white/20 px-2 py-1 rounded text-xs font-semibold">
                          {item.type === 'movie' ? 'Filme' : 'Série'}
                        </span>
                        {item.postCreditsScenes && item.postCreditsScenes > 0 && (
                          <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs font-semibold">
                            {item.postCreditsScenes} cena{item.postCreditsScenes > 1 ? 's' : ''} pós-créditos
                          </span>
                        )}
                      </div>

                      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1">
                        {item.title}
                      </h1>

                      {item.originalTitle !== item.title && (
                        <p className="text-gray-400 text-sm md:text-base mb-3">
                          {item.originalTitle}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{item.releaseYear}</span>
                        </div>

                        {item.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{item.duration}</span>
                          </div>
                        )}

                        {item.episodes && (
                          <div className="flex items-center gap-1">
                            <Tv className="w-4 h-4" />
                            <span>{item.episodes} episódios</span>
                          </div>
                        )}

                        {item.rating > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="font-semibold">{item.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 space-y-6">
                {/* Action buttons */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => onToggleWatched(item.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                      isWatched
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-white hover:bg-gray-200 text-black'
                    }`}
                  >
                    {isWatched ? (
                      <>
                        <Check className="w-5 h-5" />
                        Assistido
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        Marcar como Assistido
                      </>
                    )}
                  </button>

                  {item.whereToWatch.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">Disponível em:</span>
                      {item.whereToWatch.map((platform) => (
                        <span
                          key={platform}
                          className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Genres */}
                {item.genres && item.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.genres.map((genre) => (
                      <span
                        key={genre}
                        className="bg-marvel-red/20 text-marvel-red px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}

                {/* Synopsis */}
                <div>
                  <h2 className="text-lg font-bold text-white mb-2">Sinopse</h2>
                  <p className="text-gray-300 leading-relaxed">
                    {item.synopsis || item.description}
                  </p>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Director/Creator */}
                  {(item.director || item.creator) && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                        <Clapperboard className="w-4 h-4" />
                        <span>{item.type === 'movie' ? 'Direção' : 'Criação'}</span>
                      </div>
                      <p className="text-white font-semibold">
                        {item.director || item.creator}
                      </p>
                    </div>
                  )}

                  {/* Budget */}
                  {item.budget && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                        <DollarSign className="w-4 h-4" />
                        <span>Orçamento</span>
                      </div>
                      <p className="text-white font-semibold">{item.budget}</p>
                    </div>
                  )}

                  {/* Box Office */}
                  {item.boxOffice && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                        <TrendingUp className="w-4 h-4" />
                        <span>Bilheteria</span>
                      </div>
                      <p className="text-white font-semibold">{item.boxOffice}</p>
                    </div>
                  )}

                  {/* Timeline info */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                      <Film className="w-4 h-4" />
                      <span>Ordem de Visualização</span>
                    </div>
                    <p className="text-white">
                      <span className="font-semibold">Cronológica:</span> #{item.chronologicalOrder}
                      <span className="mx-2 text-gray-500">|</span>
                      <span className="font-semibold">Lançamento:</span> #{item.releaseOrder}
                    </p>
                  </div>
                </div>

                {/* Cast */}
                {item.cast && item.cast.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 text-lg font-bold text-white mb-3">
                      <Users className="w-5 h-5" />
                      <span>Elenco Principal</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.cast.map((actor) => (
                        <span
                          key={actor}
                          className="bg-white/10 px-3 py-2 rounded-lg text-sm text-gray-200"
                        >
                          {actor}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
