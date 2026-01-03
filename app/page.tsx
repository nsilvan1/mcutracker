'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { mcuData, MCUItem } from '@/data/mcu-data';
import { useAdminChanges } from '@/hooks/useAdminChanges';
import Header from '@/components/Header';
import OrderToggle from '@/components/OrderToggle';
import FilterBar from '@/components/FilterBar';
import MCUCard from '@/components/MCUCard';
import SkeletonCard from '@/components/SkeletonCard';
import AuthModal from '@/components/AuthModal';
import DetailModal from '@/components/DetailModal';
import HeroSection from '@/components/HeroSection';
import SearchBar from '@/components/SearchBar';
import PhaseFilter from '@/components/PhaseFilter';
import AdvancedFilters from '@/components/AdvancedFilters';
import AchievementsModal from '@/components/AchievementsModal';
import ShareProgress from '@/components/ShareProgress';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, Trophy } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
}

export default function Home() {
  const [order, setOrder] = useState<'chronological' | 'release'>('chronological');
  const [filter, setFilter] = useState<'all' | 'movies' | 'series'>('all');
  const [watchedItems, setWatchedItems] = useState<Set<string>>(new Set());
  const [favoriteItems, setFavoriteItems] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MCUItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhases, setSelectedPhases] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [selectedDirectors, setSelectedDirectors] = useState<string[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  // Usar dados com alterações do admin
  const { items: mcuItems, isLoaded: adminDataLoaded } = useAdminChanges();

  // Load user and token from localStorage
  useEffect(() => {
    setMounted(true);
    const savedToken = localStorage.getItem('mcu-token');
    const savedUser = localStorage.getItem('mcu-user');
    const savedFavorites = localStorage.getItem('mcu-favorites');

    if (savedFavorites) {
      setFavoriteItems(new Set(JSON.parse(savedFavorites)));
    }

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      loadUserProgress(savedToken);
    } else {
      const saved = localStorage.getItem('mcu-watched');
      if (saved) {
        setWatchedItems(new Set(JSON.parse(saved)));
      }
    }

    // Simulate loading for skeleton effect
    setTimeout(() => setIsLoading(false), 800);
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
      localStorage.setItem('mcu-watched', JSON.stringify(Array.from(watchedItems)));
    }
  }, [watchedItems, mounted, user, token]);

  // Save favorites to localStorage
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('mcu-favorites', JSON.stringify(Array.from(favoriteItems)));
  }, [favoriteItems, mounted]);

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

  const toggleFavorite = (id: string) => {
    setFavoriteItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const togglePhase = (phase: number) => {
    setSelectedPhases((prev) => {
      if (prev.includes(phase)) {
        return prev.filter((p) => p !== phase);
      }
      return [...prev, phase];
    });
  };

  const toggleYear = (year: number) => {
    setSelectedYears((prev) => {
      if (prev.includes(year)) {
        return prev.filter((y) => y !== year);
      }
      return [...prev, year];
    });
  };

  const toggleDirector = (director: string) => {
    setSelectedDirectors((prev) => {
      if (prev.includes(director)) {
        return prev.filter((d) => d !== director);
      }
      return [...prev, director];
    });
  };

  const clearAdvancedFilters = () => {
    setSelectedYears([]);
    setSelectedDirectors([]);
  };

  const openDetailModal = (item: MCUItem) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedItem(null);
  };

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let data = [...mcuItems];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      data = data.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.originalTitle?.toLowerCase().includes(query) ||
          item.director?.toLowerCase().includes(query) ||
          item.creator?.toLowerCase().includes(query) ||
          item.cast?.some((actor) => actor.toLowerCase().includes(query))
      );
    }

    // Type filter
    if (filter === 'movies') {
      data = data.filter((item) => item.type === 'movie');
    } else if (filter === 'series') {
      data = data.filter((item) => item.type === 'series');
    }

    // Phase filter
    if (selectedPhases.length > 0) {
      data = data.filter((item) => selectedPhases.includes(item.phase));
    }

    // Year filter
    if (selectedYears.length > 0) {
      data = data.filter((item) => selectedYears.includes(item.releaseYear));
    }

    // Director/Creator filter
    if (selectedDirectors.length > 0) {
      data = data.filter((item) =>
        selectedDirectors.includes(item.director || '') ||
        selectedDirectors.includes(item.creator || '')
      );
    }

    // Sort
    if (order === 'chronological') {
      data.sort((a, b) => a.chronologicalOrder - b.chronologicalOrder);
    } else {
      data.sort((a, b) => a.releaseOrder - b.releaseOrder);
    }

    return data;
  }, [order, filter, searchQuery, selectedPhases, selectedYears, selectedDirectors, mcuItems]);

  const totalItems = filteredAndSortedData.length;
  const watchedCount = filteredAndSortedData.filter((item) => watchedItems.has(item.id)).length;

  const hasActiveFilters = searchQuery || filter !== 'all' || selectedPhases.length > 0 || selectedYears.length > 0 || selectedDirectors.length > 0;

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-marvel-dark">
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

      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        watchedItems={watchedItems}
      />

      {/* Hero Section */}
      <HeroSection
        watchedCount={watchedItems.size}
        totalCount={mcuData.length}
        onScrollToContent={scrollToContent}
      />

      <main ref={contentRef} className="px-4 md:px-8 lg:px-12 py-8">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
                  showFilters || hasActiveFilters
                    ? 'bg-marvel-red text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="text-sm font-medium">Filtros</span>
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-white" />
                )}
              </button>

              <button
                onClick={() => setIsAchievementsOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-500 hover:from-yellow-500/30 hover:to-orange-500/30 border border-yellow-500/30 transition-all"
              >
                <Trophy className="w-4 h-4" />
                <span className="text-sm font-medium">Conquistas</span>
              </button>

              <ShareProgress
                watchedCount={watchedItems.size}
                totalCount={mcuData.length}
                userName={user?.name}
              />
            </div>

            <div className="text-sm text-gray-400">
              <span className="text-white font-semibold">{watchedCount}</span> de {totalItems} assistidos
            </div>
          </div>

          {/* Expandable Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                  <div className="flex flex-wrap items-center gap-6 mb-4">
                    <OrderToggle order={order} onToggle={setOrder} />
                    <div className="w-px h-8 bg-white/10 hidden sm:block" />
                    <FilterBar filter={filter} onFilterChange={setFilter} />
                    <div className="w-px h-8 bg-white/10 hidden sm:block" />
                    <PhaseFilter selectedPhases={selectedPhases} onTogglePhase={togglePhase} />
                  </div>

                  {/* Advanced Filters */}
                  <div className="pt-4 border-t border-white/10">
                    <AdvancedFilters
                      selectedYears={selectedYears}
                      selectedDirectors={selectedDirectors}
                      onYearToggle={toggleYear}
                      onDirectorToggle={toggleDirector}
                      onClearAll={clearAdvancedFilters}
                    />
                  </div>

                  {hasActiveFilters && (
                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                      <p className="text-sm text-gray-400">
                        {filteredAndSortedData.length} resultado{filteredAndSortedData.length !== 1 ? 's' : ''}
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setFilter('all');
                          setSelectedPhases([]);
                          setSelectedYears([]);
                          setSelectedDirectors([]);
                        }}
                        className="flex items-center gap-1 text-sm text-marvel-red hover:text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Limpar filtros
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Info message for logged out users */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 bg-gradient-to-r from-marvel-red/10 to-transparent backdrop-blur-sm border border-marvel-red/20 rounded-xl p-4"
          >
            <p className="text-gray-300 text-sm">
              <span className="text-marvel-red font-semibold">Dica:</span> Faça login para salvar seu progresso na nuvem e acessar de qualquer dispositivo
            </p>
          </motion.div>
        )}

        {/* Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 md:gap-4"
        >
          {isLoading
            ? Array.from({ length: 14 }).map((_, i) => <SkeletonCard key={i} index={i} />)
            : filteredAndSortedData.map((item, index) => (
                <MCUCard
                  key={item.id}
                  item={item}
                  isWatched={watchedItems.has(item.id)}
                  isFavorite={favoriteItems.has(item.id)}
                  onToggleWatched={toggleWatched}
                  onToggleFavorite={toggleFavorite}
                  onOpenDetail={openDetailModal}
                  index={index}
                />
              ))}
        </motion.div>

        {/* Empty state */}
        {!isLoading && filteredAndSortedData.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-400 text-lg mb-2">Nenhum resultado encontrado</p>
            <p className="text-gray-500 text-sm">Tente ajustar os filtros ou a busca</p>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 px-4 md:px-8 lg:px-12 border-t border-white/10 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-500 text-xs mb-1">
                © 2026 MCU Tracker. Projeto não oficial.
              </p>
              <p className="text-gray-600 text-xs">
                Marvel Studios e Disney detêm todos os direitos das produções.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Preparado para</span>
              <span className="px-3 py-1 bg-gradient-to-r from-marvel-red to-red-600 rounded-lg text-white font-bold text-sm">
                Vingadores: Doomsday
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
