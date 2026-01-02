'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';

interface OrderToggleProps {
  order: 'chronological' | 'release';
  onToggle: (order: 'chronological' | 'release') => void;
}

export default function OrderToggle({ order, onToggle }: OrderToggleProps) {
  return (
    <div className="flex items-center justify-center gap-2 bg-marvel-gray rounded-lg p-1">
      <button
        onClick={() => onToggle('chronological')}
        className="relative flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200"
      >
        {order === 'chronological' && (
          <motion.div
            layoutId="order-indicator"
            className="absolute inset-0 bg-marvel-red rounded-md"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
        <Clock className="w-4 h-4 relative z-10" />
        <span className="text-sm font-semibold relative z-10">Cronológica</span>
      </button>

      <button
        onClick={() => onToggle('release')}
        className="relative flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200"
      >
        {order === 'release' && (
          <motion.div
            layoutId="order-indicator"
            className="absolute inset-0 bg-marvel-red rounded-md"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
        <Calendar className="w-4 h-4 relative z-10" />
        <span className="text-sm font-semibold relative z-10">Lançamento</span>
      </button>
    </div>
  );
}
