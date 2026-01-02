'use client';

import { motion } from 'framer-motion';

export default function SkeletonCard() {
  return (
    <div className="relative">
      <div className="relative bg-marvel-gray rounded-md overflow-hidden border-2 border-transparent">
        {/* Image skeleton */}
        <div className="relative aspect-[2/3] bg-marvel-lightGray overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </div>
    </div>
  );
}
