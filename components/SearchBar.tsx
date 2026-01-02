'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'Buscar filmes e séries...' }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        inputRef.current?.blur();
        onChange('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onChange]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative flex items-center transition-all duration-300 ${
        isFocused ? 'w-full md:w-96' : 'w-full md:w-72'
      }`}
    >
      <div
        className={`relative w-full flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${
          isFocused
            ? 'bg-white/15 border-marvel-red shadow-lg shadow-marvel-red/20'
            : 'bg-white/5 border-white/10 hover:bg-white/10'
        } border backdrop-blur-sm`}
      >
        <Search className={`w-4 h-4 transition-colors ${isFocused ? 'text-marvel-red' : 'text-gray-400'}`} />

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-white placeholder-gray-500 text-sm outline-none"
        />

        <AnimatePresence>
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => onChange('')}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-3.5 h-3.5 text-gray-400" />
            </motion.button>
          )}
        </AnimatePresence>

        {!isFocused && !value && (
          <kbd className="hidden md:flex items-center gap-1 px-2 py-1 bg-white/10 rounded text-xs text-gray-500">
            <span className="text-[10px]">Ctrl</span>
            <span>K</span>
          </kbd>
        )}
      </div>
    </motion.div>
  );
}
