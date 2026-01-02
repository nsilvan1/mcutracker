'use client';

import { MCUItem } from '@/data/mcu-data';
import { motion } from 'framer-motion';
import { Check, Info } from 'lucide-react';
import Image from 'next/image';

interface MCUCardProps {
  item: MCUItem;
  isWatched: boolean;
  onToggleWatched: (id: string) => void;
  onOpenDetail: (item: MCUItem) => void;
}

export default function MCUCard({ item, isWatched, onToggleWatched, onOpenDetail }: MCUCardProps) {
  const handleCardClick = (e: React.MouseEvent) => {
    // Abre o modal de detalhes
    onOpenDetail(item);
  };

  const handleWatchedClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Impede que o clique abra o modal
    onToggleWatched(item.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative group"
    >
      <div
        className={`relative bg-black rounded-md overflow-hidden border-2 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:z-10
          ${isWatched ? 'border-green-500/60' : 'border-transparent hover:border-white/20'}`}
        onClick={handleCardClick}
      >
        {/* Image */}
        <div className="relative aspect-[2/3] bg-marvel-lightGray">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          />

          {/* Watched check - clicável */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleWatchedClick}
            className={`absolute top-2 left-2 z-10 rounded-full p-1.5 shadow-lg transition-all ${
              isWatched
                ? 'bg-green-500/90 backdrop-blur-sm'
                : 'bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100'
            }`}
            title={isWatched ? 'Marcar como não assistido' : 'Marcar como assistido'}
          >
            <Check className={`w-4 h-4 ${isWatched ? 'text-white' : 'text-white/70'}`} strokeWidth={3} />
          </motion.button>

          {/* Phase badge */}
          <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-marvel-red">
            Fase {item.phase}
          </div>

          {/* Type badge */}
          <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold">
            {item.type === 'movie' ? 'Filme' : 'Série'}
          </div>
        </div>

        {/* Content - visible on hover */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/90 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h3 className="font-bold text-white text-sm leading-tight mb-1 line-clamp-2">
            {item.title}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-gray-300 mb-2">
            <span>{item.releaseYear}</span>
            {item.duration && <span>• {item.duration}</span>}
            {item.seasons && <span>• {item.seasons}T</span>}
          </div>

          {/* Where to watch */}
          <div className="flex flex-wrap gap-1">
            {item.whereToWatch.map((platform) => (
              <span
                key={platform}
                className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded text-xs text-white"
              >
                {platform}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
