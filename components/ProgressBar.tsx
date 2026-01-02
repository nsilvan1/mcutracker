'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  watched: number;
  total: number;
}

export default function ProgressBar({ watched, total }: ProgressBarProps) {
  const percentage = Math.round((watched / total) * 100);

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">Progresso da Maratona</span>
        <span className="text-sm font-bold text-marvel-red">{percentage}%</span>
      </div>

      <div className="relative w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="absolute inset-y-0 left-0 bg-marvel-red"
        />
      </div>
    </div>
  );
}
