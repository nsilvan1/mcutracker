'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clapperboard, X } from 'lucide-react';
import { mcuData } from '@/data/mcu-data';

interface AdvancedFiltersProps {
  selectedYears: number[];
  selectedDirectors: string[];
  onYearToggle: (year: number) => void;
  onDirectorToggle: (director: string) => void;
  onClearAll: () => void;
}

export default function AdvancedFilters({
  selectedYears,
  selectedDirectors,
  onYearToggle,
  onDirectorToggle,
  onClearAll,
}: AdvancedFiltersProps) {
  // Extrair anos únicos
  const years = useMemo(() => {
    const uniqueYears = [...new Set(mcuData.map((item) => item.releaseYear))];
    return uniqueYears.sort((a, b) => a - b);
  }, []);

  // Extrair diretores/criadores únicos
  const directors = useMemo(() => {
    const uniqueDirectors = new Set<string>();
    mcuData.forEach((item) => {
      if (item.director) uniqueDirectors.add(item.director);
      if (item.creator) uniqueDirectors.add(item.creator);
    });
    return [...uniqueDirectors].sort();
  }, []);

  const hasFilters = selectedYears.length > 0 || selectedDirectors.length > 0;

  return (
    <div className="space-y-4">
      {/* Years */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-400">Ano de Lançamento</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {years.map((year) => (
            <motion.button
              key={year}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onYearToggle(year)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedYears.includes(year)
                  ? 'bg-marvel-red text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {year}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Directors */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Clapperboard className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-400">Diretor/Criador</span>
        </div>
        <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto custom-scrollbar">
          {directors.map((director) => (
            <motion.button
              key={director}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onDirectorToggle(director)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedDirectors.includes(director)
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {director}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Clear button */}
      {hasFilters && (
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onClearAll}
          className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition-colors"
        >
          <X className="w-4 h-4" />
          Limpar filtros avançados
        </motion.button>
      )}
    </div>
  );
}
