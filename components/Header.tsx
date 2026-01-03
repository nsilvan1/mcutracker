'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, LogIn, LogOut, User, ChevronDown, Shield, GitBranch } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  user: { name: string; email: string; isAdmin?: boolean } | null;
  onLoginClick: () => void;
  onLogout: () => void;
}

export default function Header({ user, onLoginClick, onLogout }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

          {/* Navigation */}
          <nav className="flex items-center gap-2 md:gap-4">
            <Link
              href="/timeline"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <GitBranch className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">Timeline</span>
            </Link>
          </nav>

          {/* User section */}
          <div>
            {user ? (
              <div className="flex items-center gap-3">
                {/* Dropdown do usuário */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 bg-marvel-gray hover:bg-marvel-gray/80 px-3 py-2 rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4 text-marvel-red" />
                    <span className="text-sm text-gray-300 hidden md:inline">{user.name}</span>
                    {user.isAdmin && (
                      <span title="Administrador">
                        <Shield className="w-3 h-3 text-yellow-500" />
                      </span>
                    )}
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-48 bg-marvel-gray border border-white/10 rounded-lg shadow-xl overflow-hidden z-50"
                      >
                        <Link
                          href="/profile"
                          onClick={() => setIsDropdownOpen(false)}
                          className="block px-4 py-3 border-b border-white/10 hover:bg-white/5 transition-colors"
                        >
                          <p className="text-sm font-medium text-white">{user.name}</p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                          <p className="text-xs text-marvel-red mt-1">Ver perfil</p>
                        </Link>

                        {user.isAdmin && (
                          <Link
                            href="/admin/dashboard"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-3 text-sm text-yellow-500 hover:bg-white/5 transition-colors"
                          >
                            <Shield className="w-4 h-4" />
                            Painel Admin
                          </Link>
                        )}

                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            onLogout();
                          }}
                          className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-400 hover:bg-white/5 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sair
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
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
