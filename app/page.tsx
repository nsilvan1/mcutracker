'use client';

import { useState, useEffect, useMemo } from 'react';
import { mcuData, MCUItem } from '@/data/mcu-data';
import Header from '@/components/Header';
import OrderToggle from '@/components/OrderToggle';
import FilterBar from '@/components/FilterBar';
import ProgressBar from '@/components/ProgressBar';
import MCUCard from '@/components/MCUCard';
import AuthModal from '@/components/AuthModal';
import DetailModal from '@/components/DetailModal';
import { motion } from 'framer-motion';

interface User {
  id: string;
  name: string;
  email: string;
}

export default function Home() {
  const [order, setOrder] = useState<'chronological' | 'release'>('chronological');
  const [filter, setFilter] = useState<'all' | 'movies' | 'series'>('all');
  const [watchedItems, setWatchedItems] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MCUItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Load user and token from localStorage
  useEffect(() => {
    setMounted(true);
    const savedToken = localStorage.getItem('mcu-token');
    const savedUser = localStorage.getItem('mcu-user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      loadUserProgress(savedToken);
    } else {
      // Fallback to localStorage watched items
      const saved = localStorage.getItem('mcu-watched');
      if (saved) {
        setWatchedItems(new Set(JSON.parse(saved)));
      }
    }
  }, []);

  // Load user progress from API
  const loadUserProgress = async (authToken: string) => {
    try {
      const response = await fetch('/api/user/progress', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWatchedItems(new Set(data.watchedItems));
      }
    } catch (error) {
      console.error('Erro ao carregar progresso:', error);
    }
  };

  // Save progress to API or localStorage
  useEffect(() => {
    if (!mounted) return;

    if (user && token) {
      // Save to API
      const saveProgress = async () => {
        try {
          await fetch('/api/user/progress', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              watchedItems: Array.from(watchedItems),
            }),
          });
        } catch (error) {
          console.error('Erro ao salvar progresso:', error);
        }
      };

      saveProgress();
    } else {
      // Save to localStorage
      localStorage.setItem('mcu-watched', JSON.stringify(Array.from(watchedItems)));
    }
  }, [watchedItems, mounted, user, token]);

  const handleLogin = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erro ao fazer login');
    }

    setToken(data.token);
    setUser(data.user);
    setWatchedItems(new Set(data.user.watchedItems));

    localStorage.setItem('mcu-token', data.token);
    localStorage.setItem('mcu-user', JSON.stringify(data.user));
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erro ao criar conta');
    }

    // After registration, login automatically
    await handleLogin(email, password);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setWatchedItems(new Set());
    localStorage.removeItem('mcu-token');
    localStorage.removeItem('mcu-user');
    localStorage.removeItem('mcu-watched');
  };

  const toggleWatched = (id: string) => {
    setWatchedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const openDetailModal = (item: MCUItem) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedItem(null);
  };

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let data = [...mcuData];

    if (filter === 'movies') {
      data = data.filter((item) => item.type === 'movie');
    } else if (filter === 'series') {
      data = data.filter((item) => item.type === 'series');
    }

    if (order === 'chronological') {
      data.sort((a, b) => a.chronologicalOrder - b.chronologicalOrder);
    } else {
      data.sort((a, b) => a.releaseOrder - b.releaseOrder);
    }

    return data;
  }, [order, filter]);

  const totalItems = filteredAndSortedData.length;
  const watchedCount = filteredAndSortedData.filter((item) => watchedItems.has(item.id)).length;

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Header
        user={user}
        onLoginClick={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />

      <DetailModal
        item={selectedItem}
        isOpen={isDetailModalOpen}
        isWatched={selectedItem ? watchedItems.has(selectedItem.id) : false}
        onClose={closeDetailModal}
        onToggleWatched={toggleWatched}
      />

      <main className="px-4 md:px-8 lg:px-12 py-6">
        {/* Controls - Netflix style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
        >
          <div className="flex items-center gap-3">
            <OrderToggle order={order} onToggle={setOrder} />
            <FilterBar filter={filter} onFilterChange={setFilter} />
          </div>

          <div className="text-sm text-gray-400">
            <span className="text-white font-semibold">{watchedCount}</span> de {totalItems} assistidos
          </div>
        </motion.div>

        {/* Progress Bar - Compacta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <ProgressBar watched={watchedCount} total={totalItems} />
        </motion.div>

        {/* Info message for logged out users */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-md p-3 text-center"
          >
            <p className="text-gray-300 text-sm">
              💡 <span className="font-semibold">Faça login</span> para salvar seu progresso na nuvem
            </p>
          </motion.div>
        )}

        {/* Grid - Netflix style com gap menor */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-2 md:gap-3"
        >
          {filteredAndSortedData.map((item) => (
            <MCUCard
              key={item.id}
              item={item}
              isWatched={watchedItems.has(item.id)}
              onToggleWatched={toggleWatched}
              onOpenDetail={openDetailModal}
            />
          ))}
        </motion.div>
      </main>

      {/* Footer - Netflix style */}
      <footer className="mt-16 py-6 px-4 md:px-8 lg:px-12 border-t border-white/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            © 2026 MCU Tracker. Marvel Studios e Disney detêm todos os direitos.
          </p>
          <p className="text-gray-400 text-sm">
            Preparado para{' '}
            <span className="text-marvel-red font-semibold">Vingadores: Doomsday</span> 🎬
          </p>
        </div>
      </footer>
    </div>
  );
}
