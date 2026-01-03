'use client';

import { useState } from 'react';
import { MCUItem } from '@/data/mcu-data';
import { motion } from 'framer-motion';
import { Check, Star, Heart } from 'lucide-react';
import Image from 'next/image';

// Blur placeholder base64 (dark gray)
const blurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAQQBAwUBAAAAAAAAAAAAAQACAwQFBhESEyExQVFh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAYEQADAQEAAAAAAAAAAAAAAAAAAQIREv/aAAwDAQACEEMPYAD/AJ0V1p0U3S1IJ6qJX4CedI9xdwBJ8dBuRERPFpfJ/9k=';

interface MCUCardProps {
  item: MCUItem;
  isWatched: boolean;
  isFavorite?: boolean;
  userRating?: number;
  onToggleWatched: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onOpenDetail: (item: MCUItem) => void;
  index?: number;
}

export default function MCUCard({
  item,
  isWatched,
  isFavorite = false,
  userRating,
  onToggleWatched,
  onToggleFavorite,
  onOpenDetail,
  index = 0,
}: MCUCardProps) {
  const handleCardClick = () => {
    onOpenDetail(item);
  };

  const handleWatchedClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWatched(item.id);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(item.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.02 }}
      className="relative group"
    >
      <div
        className={`relative bg-marvel-gray rounded-xl overflow-hidden transition-all duration-500 cursor-pointer
          ${isWatched ? 'ring-2 ring-green-500/60 ring-offset-2 ring-offset-marvel-dark' : 'hover:ring-2 hover:ring-white/20 hover:ring-offset-2 hover:ring-offset-marvel-dark'}
          transform hover:scale-[1.02] hover:z-10`}
        onClick={handleCardClick}
      >
        {/* Image container */}
        <div className="relative aspect-[2/3] bg-marvel-lightGray overflow-hidden">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            placeholder="blur"
            blurDataURL={blurDataURL}
            loading={index < 7 ? 'eager' : 'lazy'}
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

          {/* Top actions */}
          <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-10">
            {/* Watched check */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleWatchedClick}
              className={`rounded-full p-2 shadow-lg backdrop-blur-md transition-all ${
                isWatched
                  ? 'bg-green-500 text-white'
                  : 'bg-black/50 text-white/70 opacity-0 group-hover:opacity-100'
              }`}
              title={isWatched ? 'Marcar como não assistido' : 'Marcar como assistido'}
            >
              <Check className="w-4 h-4" strokeWidth={3} />
            </motion.button>

            {/* Favorite button */}
            {onToggleFavorite && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleFavoriteClick}
                className={`rounded-full p-2 shadow-lg backdrop-blur-md transition-all ${
                  isFavorite
                    ? 'bg-red-500 text-white'
                    : 'bg-black/50 text-white/70 opacity-0 group-hover:opacity-100'
                }`}
                title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </motion.button>
            )}
          </div>

          {/* Type badge */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="px-2 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium text-white">
              {item.type === 'movie' ? 'Filme' : 'Série'}
            </span>
          </div>

          {/* Rating badge */}
          {item.rating > 0 && (
            <div className="absolute top-14 right-2 flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-bold text-white">{item.rating.toFixed(1)}</span>
            </div>
          )}

          {/* User rating */}
          {userRating && (
            <div className="absolute top-14 left-2 flex items-center gap-1 px-2 py-1 bg-marvel-red/80 backdrop-blur-md rounded-lg">
              <Star className="w-3 h-3 text-white fill-white" />
              <span className="text-xs font-bold text-white">{userRating}</span>
            </div>
          )}

          {/* Content */}
          <div className="absolute inset-x-0 bottom-0 p-3">
            {/* Phase badge */}
            <div className="inline-block px-2 py-0.5 mb-2 bg-gradient-to-r from-marvel-red to-red-600 rounded text-xs font-bold text-white shadow-lg">
              Fase {item.phase}
            </div>

            <h3 className="font-bold text-white text-sm leading-tight mb-1.5 line-clamp-2 drop-shadow-lg">
              {item.title}
            </h3>

            <div className="flex items-center gap-2 text-xs text-gray-300">
              <span className="font-medium">{item.releaseYear}</span>
              {item.duration && (
                <>
                  <span className="w-1 h-1 rounded-full bg-gray-500" />
                  <span>{item.duration}</span>
                </>
              )}
              {item.seasons && (
                <>
                  <span className="w-1 h-1 rounded-full bg-gray-500" />
                  <span>{item.seasons} temporada{item.seasons > 1 ? 's' : ''}</span>
                </>
              )}
            </div>

            {/* Where to watch */}
            <div className="flex flex-wrap gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {item.whereToWatch.slice(0, 2).map((platform) => (
                platform === 'Disney+' ? (
                  <a
                    key={platform}
                    href="https://www.disneyplus.com/pt-br/brand/marvel"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="px-2 py-0.5 bg-blue-600/80 hover:bg-blue-500 backdrop-blur-md rounded-md text-xs text-white font-medium transition-colors"
                  >
                    {platform}
                  </a>
                ) : (
                  <span
                    key={platform}
                    className="px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-md text-xs text-white font-medium"
                  >
                    {platform}
                  </span>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
