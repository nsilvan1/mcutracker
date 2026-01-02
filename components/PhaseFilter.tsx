'use client';

import { motion } from 'framer-motion';

interface PhaseFilterProps {
  selectedPhases: number[];
  onTogglePhase: (phase: number) => void;
}

const phases = [1, 2, 3, 4, 5, 6];

export default function PhaseFilter({ selectedPhases, onTogglePhase }: PhaseFilterProps) {
  const allSelected = selectedPhases.length === 0;

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 mr-1">Fases:</span>
      <div className="flex gap-1">
        {phases.map((phase) => {
          const isSelected = allSelected || selectedPhases.includes(phase);
          return (
            <motion.button
              key={phase}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onTogglePhase(phase)}
              className={`w-7 h-7 rounded-full text-xs font-bold transition-all ${
                isSelected
                  ? 'bg-marvel-red text-white shadow-lg shadow-marvel-red/30'
                  : 'bg-white/5 text-gray-500 hover:bg-white/10'
              }`}
            >
              {phase}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
