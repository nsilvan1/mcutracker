'use client';

import { motion } from 'framer-motion';

interface SkeletonCardProps {
  index?: number;
}

export default function SkeletonCard({ index = 0 }: SkeletonCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="relative group"
    >
      <div className="relative bg-gradient-to-b from-marvel-gray to-marvel-dark rounded-xl overflow-hidden border border-white/5">
        {/* Image skeleton */}
        <div className="relative aspect-[2/3] bg-marvel-lightGray/50 overflow-hidden">
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: index * 0.1 }}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-marvel-dark via-transparent to-transparent" />
        </div>

        {/* Content skeleton */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          {/* Phase badge skeleton */}
          <div className="mb-2">
            <div className="h-4 w-12 bg-white/10 rounded-full" />
          </div>

          {/* Title skeleton */}
          <div className="space-y-1.5">
            <div className="h-3 w-3/4 bg-white/10 rounded" />
            <div className="h-3 w-1/2 bg-white/5 rounded" />
          </div>
        </div>

        {/* Top badges skeleton */}
        <div className="absolute top-2 left-2 right-2 flex justify-between">
          <div className="h-5 w-8 bg-white/10 rounded-full" />
          <div className="h-5 w-5 bg-white/10 rounded-full" />
        </div>
      </div>
    </motion.div>
  );
}

// Skeleton para cards maiores (timeline, etc)
export function SkeletonCardLarge({ index = 0 }: SkeletonCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/10"
    >
      {/* Poster skeleton */}
      <div className="w-24 h-36 bg-white/10 rounded-lg overflow-hidden relative shrink-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Content skeleton */}
      <div className="flex-1 py-1">
        <div className="h-5 w-3/4 bg-white/10 rounded mb-3" />
        <div className="h-3 w-1/4 bg-white/5 rounded mb-4" />
        <div className="space-y-2">
          <div className="h-2 w-full bg-white/5 rounded" />
          <div className="h-2 w-5/6 bg-white/5 rounded" />
          <div className="h-2 w-4/6 bg-white/5 rounded" />
        </div>
      </div>
    </motion.div>
  );
}

// Skeleton para estatísticas
export function SkeletonStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white/5 border border-white/10 rounded-xl p-4"
        >
          <div className="h-8 w-8 bg-white/10 rounded-lg mb-3" />
          <div className="h-3 w-1/2 bg-white/5 rounded mb-2" />
          <div className="h-6 w-3/4 bg-white/10 rounded" />
        </motion.div>
      ))}
    </div>
  );
}

// Skeleton para lista
export function SkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
        >
          <div className="w-10 h-10 bg-white/10 rounded-lg shrink-0" />
          <div className="flex-1">
            <div className="h-3 w-3/4 bg-white/10 rounded mb-1.5" />
            <div className="h-2 w-1/2 bg-white/5 rounded" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
