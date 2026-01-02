'use client';

import { motion } from 'framer-motion';
import { Film, Tv, Grid } from 'lucide-react';

interface FilterBarProps {
  filter: 'all' | 'movies' | 'series';
  onFilterChange: (filter: 'all' | 'movies' | 'series') => void;
}

export default function FilterBar({ filter, onFilterChange }: FilterBarProps) {
  return (
    <div className="flex items-center justify-center gap-2 bg-marvel-gray rounded-lg p-1">
      <button
        onClick={() => onFilterChange('all')}
        className="relative flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200"
      >
        {filter === 'all' && (
          <motion.div
            layoutId="filter-indicator"
            className="absolute inset-0 bg-marvel-red rounded-md"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
        <Grid className="w-4 h-4 relative z-10" />
        <span className="text-sm font-semibold relative z-10">Todos</span>
      </button>

      <button
        onClick={() => onFilterChange('movies')}
        className="relative flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200"
      >
        {filter === 'movies' && (
          <motion.div
            layoutId="filter-indicator"
            className="absolute inset-0 bg-marvel-red rounded-md"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
        <Film className="w-4 h-4 relative z-10" />
        <span className="text-sm font-semibold relative z-10">Filmes</span>
      </button>

      <button
        onClick={() => onFilterChange('series')}
        className="relative flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200"
      >
        {filter === 'series' && (
          <motion.div
            layoutId="filter-indicator"
            className="absolute inset-0 bg-marvel-red rounded-md"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
        <Tv className="w-4 h-4 relative z-10" />
        <span className="text-sm font-semibold relative z-10">Séries</span>
      </button>
    </div>
  );
}
