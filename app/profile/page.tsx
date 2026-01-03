'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { mcuData } from '@/data/mcu-data';
import Link from 'next/link';
import {
  User,
  Film,
  Tv,
  Clock,
  Trophy,
  Calendar,
  TrendingUp,
  Star,
  ArrowLeft,
  Shield,
  CheckCircle2,
  Circle,
  Percent,
} from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [watchedItems, setWatchedItems] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('mcu-user');
    const savedToken = localStorage.getItem('mcu-token');

    if (!savedUser || !savedToken) {
      router.push('/');
      return;
    }

    setUser(JSON.parse(savedUser));

    // Carregar progresso
    const loadProgress = async () => {
      try {
        const response = await fetch('/api/user/progress', {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setWatchedItems(new Set(data.watchedItems));
        }
      } catch (error) {
        console.error('Erro ao carregar progresso:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, [router]);

  // Calcular estatisticas
  const stats = useMemo(() => {
    const movies = mcuData.filter(item => item.type === 'movie');
    const series = mcuData.filter(item => item.type === 'series');

    const watchedMovies = movies.filter(m => watchedItems.has(m.id));
    const watchedSeries = series.filter(s => watchedItems.has(s.id));

    // Calcular horas assistidas
    const totalMinutes = [...watchedMovies, ...watchedSeries].reduce((acc, item) => {
      if (item.duration) {
        const match = item.duration.match(/(\d+)h\s*(\d+)?/);
        if (match) {
          const hours = parseInt(match[1]) || 0;
          const mins = parseInt(match[2]) || 0;
          return acc + hours * 60 + mins;
        }
      }
      if (item.episodes) {
        return acc + item.episodes * 45; // Media de 45 min por episodio
      }
      return acc;
    }, 0);

    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);

    // Calcular progresso por fase
    const phases = [1, 2, 3, 4, 5, 6];
    const phaseStats = phases.map(phase => {
      const phaseItems = mcuData.filter(item => item.phase === phase);
      const phaseWatched = phaseItems.filter(item => watchedItems.has(item.id));
      return {
        phase,
        total: phaseItems.length,
        watched: phaseWatched.length,
        percentage: phaseItems.length > 0 ? Math.round((phaseWatched.length / phaseItems.length) * 100) : 0,
      };
    });

    // Proximos a assistir (nao assistidos, ordenados cronologicamente)
    const nextToWatch = mcuData
      .filter(item => !watchedItems.has(item.id))
      .sort((a, b) => a.chronologicalOrder - b.chronologicalOrder)
      .slice(0, 5);

    // Ultimos assistidos
    const recentlyWatched = mcuData
      .filter(item => watchedItems.has(item.id))
      .sort((a, b) => b.releaseOrder - a.releaseOrder)
      .slice(0, 5);

    const totalProgress = mcuData.length > 0
      ? Math.round((watchedItems.size / mcuData.length) * 100)
      : 0;

    return {
      totalMovies: movies.length,
      totalSeries: series.length,
      watchedMovies: watchedMovies.length,
      watchedSeries: watchedSeries.length,
      totalHours,
      totalDays,
      totalMinutes: totalMinutes % 60,
      phaseStats,
      nextToWatch,
      recentlyWatched,
      totalProgress,
      totalWatched: watchedItems.size,
      totalItems: mcuData.length,
    };
  }, [watchedItems]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-marvel-dark flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-marvel-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-marvel-dark">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-marvel-dark/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Voltar</span>
            </Link>

            {user.isAdmin && (
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 hover:bg-yellow-500/30 transition-all"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-marvel-red to-red-700 mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">{user.name}</h1>
          <p className="text-gray-400 text-sm">{user.email}</p>
          {user.isAdmin && (
            <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-500">
              <Shield className="w-3 h-3" />
              Administrador
            </span>
          )}
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Progresso Geral</h2>
            <span className="text-2xl font-bold text-marvel-red">{stats.totalProgress}%</span>
          </div>

          {/* Progress bar */}
          <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.totalProgress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-marvel-red to-red-500 rounded-full"
            />
          </div>

          <p className="text-gray-400 text-sm">
            {stats.totalWatched} de {stats.totalItems} titulos assistidos
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
        >
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Film className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            <p className="text-gray-400 text-xs mb-1">Filmes</p>
            <p className="text-white font-bold text-xl">{stats.watchedMovies}<span className="text-gray-500 text-sm font-normal">/{stats.totalMovies}</span></p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Tv className="w-4 h-4 text-purple-400" />
              </div>
            </div>
            <p className="text-gray-400 text-xs mb-1">Series</p>
            <p className="text-white font-bold text-xl">{stats.watchedSeries}<span className="text-gray-500 text-sm font-normal">/{stats.totalSeries}</span></p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Clock className="w-4 h-4 text-green-400" />
              </div>
            </div>
            <p className="text-gray-400 text-xs mb-1">Tempo Assistido</p>
            <p className="text-white font-bold text-xl">{stats.totalHours}<span className="text-gray-500 text-sm font-normal">h {stats.totalMinutes}m</span></p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <Trophy className="w-4 h-4 text-yellow-400" />
              </div>
            </div>
            <p className="text-gray-400 text-xs mb-1">Status</p>
            <p className="text-white font-bold text-sm">
              {stats.totalWatched >= stats.totalItems
                ? 'Completista!'
                : stats.totalWatched >= stats.totalItems / 2
                  ? 'Veterano'
                  : stats.totalWatched >= 10
                    ? 'Fan'
                    : 'Iniciante'}
            </p>
          </div>
        </motion.div>

        {/* Progress by Phase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Progresso por Fase</h2>

          <div className="space-y-3">
            {stats.phaseStats.map((phase) => (
              <div key={phase.phase} className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-400 w-16">Fase {phase.phase}</span>
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${phase.percentage}%` }}
                    transition={{ duration: 0.8, delay: phase.phase * 0.1 }}
                    className={`h-full rounded-full ${
                      phase.percentage === 100
                        ? 'bg-green-500'
                        : phase.percentage > 50
                          ? 'bg-yellow-500'
                          : 'bg-marvel-red'
                    }`}
                  />
                </div>
                <span className="text-sm text-white w-16 text-right">
                  {phase.watched}/{phase.total}
                </span>
                <span className={`text-xs font-medium w-10 text-right ${
                  phase.percentage === 100 ? 'text-green-400' : 'text-gray-400'
                }`}>
                  {phase.percentage}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Next to Watch & Recently Watched */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Next to Watch */}
          {stats.nextToWatch.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-marvel-red" />
                Proximos a Assistir
              </h2>

              <div className="space-y-3">
                {stats.nextToWatch.map((item, index) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-5">{index + 1}.</span>
                    <Circle className="w-4 h-4 text-gray-600" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{item.title}</p>
                      <p className="text-xs text-gray-500">
                        {item.type === 'movie' ? 'Filme' : 'Serie'} - Fase {item.phase}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Recently Watched */}
          {stats.recentlyWatched.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Assistidos Recentemente
              </h2>

              <div className="space-y-3">
                {stats.recentlyWatched.map((item, index) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-5">{index + 1}.</span>
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{item.title}</p>
                      <p className="text-xs text-gray-500">
                        {item.type === 'movie' ? 'Filme' : 'Serie'} - Fase {item.phase}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
