'use client';

import { motion } from 'framer-motion';
import { Film, LogIn, LogOut, User } from 'lucide-react';

interface HeaderProps {
  user: { name: string; email: string } | null;
  onLoginClick: () => void;
  onLogout: () => void;
}

export default function Header({ user, onLoginClick, onLogout }: HeaderProps) {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-marvel-dark/95 backdrop-blur-sm border-b border-marvel-red/30 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Film className="w-7 h-7 text-marvel-red" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                <span className="text-white">MCU</span>
                <span className="text-marvel-red"> Tracker</span>
              </h1>
              <p className="text-gray-400 text-xs hidden md:block">
                Até <span className="text-marvel-red font-semibold">Vingadores: Doomsday</span>
              </p>
            </div>
          </div>

          {/* User section */}
          <div>
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 bg-marvel-gray px-3 py-2 rounded-lg">
                  <User className="w-4 h-4 text-marvel-red" />
                  <span className="text-sm text-gray-300">{user.name}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 bg-marvel-red hover:bg-red-600 px-4 py-2 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-semibold hidden sm:inline">Sair</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="flex items-center gap-2 bg-marvel-red hover:bg-red-600 px-4 py-2 rounded-lg transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span className="text-sm font-semibold">Entrar</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
