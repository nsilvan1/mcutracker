'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { mcuData, MCUItem } from '@/data/mcu-data';
import {
  Search,
  LogOut,
  Film,
  Tv,
  Edit2,
  Save,
  X,
  Youtube,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Check,
  AlertCircle,
  Shield,
  Home
} from 'lucide-react';
import Image from 'next/image';

interface EditableItem extends MCUItem {
  isEditing?: boolean;
  hasChanges?: boolean;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [items, setItems] = useState<EditableItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'movie' | 'series'>('all');
  const [filterPhase, setFilterPhase] = useState<number | null>(null);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<EditableItem | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [pendingChanges, setPendingChanges] = useState<Map<string, Partial<MCUItem>>>(new Map());

  // Verificar autenticação
  useEffect(() => {
    const adminAuth = localStorage.getItem('mcu-admin-auth');
    const authTime = localStorage.getItem('mcu-admin-auth-time');

    // Sessão expira em 24 horas
    const isExpired = authTime && (Date.now() - parseInt(authTime)) > 24 * 60 * 60 * 1000;

    if (adminAuth !== 'authenticated' || isExpired) {
      localStorage.removeItem('mcu-admin-auth');
      localStorage.removeItem('mcu-admin-auth-time');
      router.push('/admin');
    }
  }, [router]);

  // Carregar dados
  useEffect(() => {
    // Tentar carregar alterações salvas do localStorage
    const savedChanges = localStorage.getItem('mcu-admin-changes');
    if (savedChanges) {
      const changes = JSON.parse(savedChanges);
      setPendingChanges(new Map(Object.entries(changes)));

      // Aplicar alterações aos itens
      const updatedItems = mcuData.map(item => {
        const itemChanges = changes[item.id];
        if (itemChanges) {
          return { ...item, ...itemChanges, hasChanges: true };
        }
        return item;
      });
      setItems(updatedItems);
    } else {
      setItems(mcuData);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('mcu-admin-auth');
    localStorage.removeItem('mcu-admin-auth-time');
    router.push('/admin');
  };

  const handleEditItem = (item: EditableItem) => {
    setEditingItem({ ...item });
    setExpandedItem(item.id);
  };

  const handleSaveItem = (item: EditableItem) => {
    // Salvar alterações no localStorage
    const changes = new Map(pendingChanges);
    const itemChanges: Partial<MCUItem> = {
      trailerUrl: item.trailerUrl,
      trailerUrlDublado: item.trailerUrlDublado,
      trailerUrlLegendado: item.trailerUrlLegendado,
      imageUrl: item.imageUrl,
      backdropUrl: item.backdropUrl,
      rating: item.rating,
      synopsis: item.synopsis,
    };

    changes.set(item.id, itemChanges);
    setPendingChanges(changes);

    // Salvar no localStorage
    const changesObj = Object.fromEntries(changes);
    localStorage.setItem('mcu-admin-changes', JSON.stringify(changesObj));

    // Atualizar lista de itens
    setItems(prev => prev.map(i =>
      i.id === item.id ? { ...i, ...itemChanges, hasChanges: true } : i
    ));

    setEditingItem(null);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  const handleClearChanges = () => {
    if (confirm('Tem certeza que deseja limpar todas as alterações pendentes?')) {
      localStorage.removeItem('mcu-admin-changes');
      setPendingChanges(new Map());
      setItems(mcuData);
      setSaveStatus('idle');
    }
  };

  const handleExportChanges = () => {
    const changesObj = Object.fromEntries(pendingChanges);
    const dataStr = JSON.stringify(changesObj, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `mcu-changes-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Filtrar itens
  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.originalTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesPhase = filterPhase === null || item.phase === filterPhase;
    return matchesSearch && matchesType && matchesPhase;
  });

  // Estatísticas
  const stats = {
    total: items.length,
    movies: items.filter(i => i.type === 'movie').length,
    series: items.filter(i => i.type === 'series').length,
    withTrailer: items.filter(i => i.trailerUrl || i.trailerUrlDublado).length,
    withDublado: items.filter(i => i.trailerUrlDublado).length,
    pendingChanges: pendingChanges.size,
  };

  const phases = [1, 2, 3, 4, 5, 6];

  return (
    <div className="min-h-screen bg-marvel-dark">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-marvel-dark/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-marvel-red" />
              <div>
                <h1 className="text-xl font-bold text-white">Admin MCU Tracker</h1>
                <p className="text-xs text-gray-400">Painel de Administração</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="/"
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors"
              >
                <Home className="w-4 h-4" />
                Ver Site
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 text-sm transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-marvel-gray rounded-xl p-4 border border-white/5">
            <p className="text-gray-400 text-xs mb-1">Total</p>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-marvel-gray rounded-xl p-4 border border-white/5">
            <p className="text-gray-400 text-xs mb-1">Filmes</p>
            <p className="text-2xl font-bold text-blue-400">{stats.movies}</p>
          </div>
          <div className="bg-marvel-gray rounded-xl p-4 border border-white/5">
            <p className="text-gray-400 text-xs mb-1">Séries</p>
            <p className="text-2xl font-bold text-purple-400">{stats.series}</p>
          </div>
          <div className="bg-marvel-gray rounded-xl p-4 border border-white/5">
            <p className="text-gray-400 text-xs mb-1">Com Trailer</p>
            <p className="text-2xl font-bold text-green-400">{stats.withTrailer}</p>
          </div>
          <div className="bg-marvel-gray rounded-xl p-4 border border-white/5">
            <p className="text-gray-400 text-xs mb-1">Dublados</p>
            <p className="text-2xl font-bold text-yellow-400">{stats.withDublado}</p>
          </div>
          <div className="bg-marvel-gray rounded-xl p-4 border border-white/5">
            <p className="text-gray-400 text-xs mb-1">Alterações</p>
            <p className="text-2xl font-bold text-marvel-red">{stats.pendingChanges}</p>
          </div>
        </div>

        {/* Actions bar */}
        {pendingChanges.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <p className="text-yellow-400 text-sm">
                Você tem <strong>{pendingChanges.size}</strong> alterações pendentes salvas localmente.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportChanges}
                className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg text-yellow-400 text-sm transition-colors"
              >
                Exportar JSON
              </button>
              <button
                onClick={handleClearChanges}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 text-sm transition-colors"
              >
                Limpar Tudo
              </button>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <div className="bg-marvel-gray rounded-xl p-4 mb-6 border border-white/5">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar por título..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-marvel-dark border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-marvel-red focus:border-transparent"
              />
            </div>

            {/* Type filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  filterType === 'all'
                    ? 'bg-marvel-red text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterType('movie')}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  filterType === 'movie'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                <Film className="w-4 h-4" />
                Filmes
              </button>
              <button
                onClick={() => setFilterType('series')}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  filterType === 'series'
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                <Tv className="w-4 h-4" />
                Séries
              </button>
            </div>

            {/* Phase filter */}
            <div className="flex gap-1">
              <button
                onClick={() => setFilterPhase(null)}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  filterPhase === null
                    ? 'bg-marvel-red text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                Todas
              </button>
              {phases.map(phase => (
                <button
                  key={phase}
                  onClick={() => setFilterPhase(phase)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    filterPhase === phase
                      ? 'bg-marvel-red text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  F{phase}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Items list */}
        <div className="space-y-3">
          {filteredItems.map(item => (
            <motion.div
              key={item.id}
              layout
              className={`bg-marvel-gray rounded-xl border overflow-hidden ${
                item.hasChanges ? 'border-yellow-500/30' : 'border-white/5'
              }`}
            >
              {/* Item header */}
              <div
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
              >
                {/* Poster */}
                <div className="relative w-12 h-18 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    width={48}
                    height={72}
                    className="object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white truncate">{item.title}</h3>
                    {item.hasChanges && (
                      <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                        Alterado
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      {item.type === 'movie' ? <Film className="w-3 h-3" /> : <Tv className="w-3 h-3" />}
                      {item.type === 'movie' ? 'Filme' : 'Série'}
                    </span>
                    <span>Fase {item.phase}</span>
                    <span>{item.releaseYear}</span>
                  </div>
                </div>

                {/* Trailer status */}
                <div className="flex items-center gap-2">
                  {item.trailerUrlDublado ? (
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-lg">DUB</span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-500/20 text-gray-500 text-xs rounded-lg">DUB</span>
                  )}
                  {item.trailerUrlLegendado ? (
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-lg">LEG</span>
                  ) : item.trailerUrl ? (
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-lg">LEG</span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-500/20 text-gray-500 text-xs rounded-lg">LEG</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditItem(item);
                    }}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {expandedItem === item.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Expanded content */}
              <AnimatePresence>
                {expandedItem === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-white/5"
                  >
                    <div className="p-4 space-y-4">
                      {/* Trailer URLs */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1">
                            Trailer (Fallback)
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={item.trailerUrl || ''}
                              readOnly
                              className="flex-1 px-3 py-2 bg-marvel-dark border border-white/10 rounded-lg text-white text-sm"
                            />
                            {item.trailerUrl && (
                              <a
                                href={item.trailerUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-colors"
                              >
                                <Youtube className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1">
                            Trailer Dublado
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={item.trailerUrlDublado || ''}
                              readOnly
                              className="flex-1 px-3 py-2 bg-marvel-dark border border-white/10 rounded-lg text-white text-sm"
                            />
                            {item.trailerUrlDublado && (
                              <a
                                href={item.trailerUrlDublado}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-colors"
                              >
                                <Youtube className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1">
                            Trailer Legendado
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={item.trailerUrlLegendado || ''}
                              readOnly
                              className="flex-1 px-3 py-2 bg-marvel-dark border border-white/10 rounded-lg text-white text-sm"
                            />
                            {item.trailerUrlLegendado && (
                              <a
                                href={item.trailerUrlLegendado}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-colors"
                              >
                                <Youtube className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Other info */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Rating:</span>
                          <span className="text-white ml-2">{item.rating.toFixed(1)}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Ordem Cronológica:</span>
                          <span className="text-white ml-2">#{item.chronologicalOrder}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Ordem Lançamento:</span>
                          <span className="text-white ml-2">#{item.releaseOrder}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Cenas Pós-Créditos:</span>
                          <span className="text-white ml-2">{item.postCreditsScenes || 0}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">Nenhum item encontrado</p>
          </div>
        )}
      </main>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancelEdit}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 md:inset-10 lg:inset-20 z-50 overflow-auto"
            >
              <div className="bg-marvel-gray rounded-xl border border-white/10 shadow-2xl max-w-3xl mx-auto">
                {/* Modal header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-24 rounded-lg overflow-hidden">
                      <Image
                        src={editingItem.imageUrl}
                        alt={editingItem.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{editingItem.title}</h2>
                      <p className="text-gray-400 text-sm">{editingItem.originalTitle}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleCancelEdit}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Modal content */}
                <div className="p-6 space-y-6">
                  {/* Trailer URLs */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Youtube className="w-5 h-5 text-red-500" />
                      URLs dos Trailers
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Trailer Dublado (PT-BR)
                      </label>
                      <input
                        type="url"
                        value={editingItem.trailerUrlDublado || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, trailerUrlDublado: e.target.value })}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full px-4 py-3 bg-marvel-dark border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-marvel-red"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Trailer Legendado
                      </label>
                      <input
                        type="url"
                        value={editingItem.trailerUrlLegendado || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, trailerUrlLegendado: e.target.value })}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full px-4 py-3 bg-marvel-dark border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-marvel-red"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Trailer (Fallback)
                      </label>
                      <input
                        type="url"
                        value={editingItem.trailerUrl || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, trailerUrl: e.target.value })}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full px-4 py-3 bg-marvel-dark border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-marvel-red"
                      />
                    </div>
                  </div>

                  {/* Images */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Imagens</h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        URL do Poster
                      </label>
                      <input
                        type="url"
                        value={editingItem.imageUrl || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                        className="w-full px-4 py-3 bg-marvel-dark border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-marvel-red"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        URL do Backdrop
                      </label>
                      <input
                        type="url"
                        value={editingItem.backdropUrl || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, backdropUrl: e.target.value })}
                        className="w-full px-4 py-3 bg-marvel-dark border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-marvel-red"
                      />
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Rating (0-10)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={editingItem.rating}
                      onChange={(e) => setEditingItem({ ...editingItem, rating: parseFloat(e.target.value) || 0 })}
                      className="w-32 px-4 py-3 bg-marvel-dark border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-marvel-red"
                    />
                  </div>

                  {/* Synopsis */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Sinopse
                    </label>
                    <textarea
                      value={editingItem.synopsis || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, synopsis: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-marvel-dark border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-marvel-red resize-none"
                    />
                  </div>
                </div>

                {/* Modal footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
                  <button
                    onClick={handleCancelEdit}
                    className="px-6 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleSaveItem(editingItem)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-marvel-red hover:bg-red-600 rounded-lg text-white font-medium transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Salvar Alterações
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Save status toast */}
      <AnimatePresence>
        {saveStatus === 'saved' && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 bg-green-500 rounded-lg text-white shadow-lg"
          >
            <Check className="w-5 h-5" />
            Alterações salvas!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
