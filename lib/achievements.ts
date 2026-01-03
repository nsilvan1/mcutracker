import { mcuData } from '@/data/mcu-data';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  condition: (watchedItems: Set<string>) => boolean;
  progress?: (watchedItems: Set<string>) => { current: number; total: number };
}

// Definição das conquistas
export const achievements: Achievement[] = [
  // Conquistas de progresso geral
  {
    id: 'first-watch',
    title: 'Primeira Missão',
    description: 'Assista seu primeiro título do MCU',
    icon: '🎬',
    rarity: 'common',
    condition: (watched) => watched.size >= 1,
    progress: (watched) => ({ current: Math.min(watched.size, 1), total: 1 }),
  },
  {
    id: 'getting-started',
    title: 'Iniciante',
    description: 'Assista 5 títulos do MCU',
    icon: '🌟',
    rarity: 'common',
    condition: (watched) => watched.size >= 5,
    progress: (watched) => ({ current: Math.min(watched.size, 5), total: 5 }),
  },
  {
    id: 'fan',
    title: 'Fã Marvel',
    description: 'Assista 15 títulos do MCU',
    icon: '❤️',
    rarity: 'rare',
    condition: (watched) => watched.size >= 15,
    progress: (watched) => ({ current: Math.min(watched.size, 15), total: 15 }),
  },
  {
    id: 'veteran',
    title: 'Veterano',
    description: 'Assista 30 títulos do MCU',
    icon: '🏆',
    rarity: 'epic',
    condition: (watched) => watched.size >= 30,
    progress: (watched) => ({ current: Math.min(watched.size, 30), total: 30 }),
  },
  {
    id: 'completionist',
    title: 'Completista',
    description: 'Assista todos os títulos do MCU',
    icon: '👑',
    rarity: 'legendary',
    condition: (watched) => watched.size >= mcuData.length,
    progress: (watched) => ({ current: watched.size, total: mcuData.length }),
  },

  // Conquistas por fase
  {
    id: 'phase1-complete',
    title: 'Saga do Infinito: Início',
    description: 'Complete toda a Fase 1',
    icon: '1️⃣',
    rarity: 'rare',
    condition: (watched) => {
      const phase1 = mcuData.filter(item => item.phase === 1);
      return phase1.every(item => watched.has(item.id));
    },
    progress: (watched) => {
      const phase1 = mcuData.filter(item => item.phase === 1);
      return { current: phase1.filter(item => watched.has(item.id)).length, total: phase1.length };
    },
  },
  {
    id: 'phase2-complete',
    title: 'Novos Heróis',
    description: 'Complete toda a Fase 2',
    icon: '2️⃣',
    rarity: 'rare',
    condition: (watched) => {
      const phase2 = mcuData.filter(item => item.phase === 2);
      return phase2.every(item => watched.has(item.id));
    },
    progress: (watched) => {
      const phase2 = mcuData.filter(item => item.phase === 2);
      return { current: phase2.filter(item => watched.has(item.id)).length, total: phase2.length };
    },
  },
  {
    id: 'phase3-complete',
    title: 'Guerra Infinita',
    description: 'Complete toda a Fase 3',
    icon: '3️⃣',
    rarity: 'epic',
    condition: (watched) => {
      const phase3 = mcuData.filter(item => item.phase === 3);
      return phase3.every(item => watched.has(item.id));
    },
    progress: (watched) => {
      const phase3 = mcuData.filter(item => item.phase === 3);
      return { current: phase3.filter(item => watched.has(item.id)).length, total: phase3.length };
    },
  },
  {
    id: 'phase4-complete',
    title: 'Multiverso',
    description: 'Complete toda a Fase 4',
    icon: '4️⃣',
    rarity: 'epic',
    condition: (watched) => {
      const phase4 = mcuData.filter(item => item.phase === 4);
      return phase4.every(item => watched.has(item.id));
    },
    progress: (watched) => {
      const phase4 = mcuData.filter(item => item.phase === 4);
      return { current: phase4.filter(item => watched.has(item.id)).length, total: phase4.length };
    },
  },
  {
    id: 'phase5-complete',
    title: 'Nova Era',
    description: 'Complete toda a Fase 5',
    icon: '5️⃣',
    rarity: 'epic',
    condition: (watched) => {
      const phase5 = mcuData.filter(item => item.phase === 5);
      return phase5.every(item => watched.has(item.id));
    },
    progress: (watched) => {
      const phase5 = mcuData.filter(item => item.phase === 5);
      return { current: phase5.filter(item => watched.has(item.id)).length, total: phase5.length };
    },
  },

  // Conquistas especiais
  {
    id: 'avengers-assembled',
    title: 'Vingadores Reunidos',
    description: 'Assista todos os filmes dos Vingadores',
    icon: '🔵',
    rarity: 'epic',
    condition: (watched) => {
      const avengersMovies = mcuData.filter(item =>
        item.title.toLowerCase().includes('vingadores') ||
        item.title.toLowerCase().includes('avengers')
      );
      return avengersMovies.every(item => watched.has(item.id));
    },
    progress: (watched) => {
      const avengersMovies = mcuData.filter(item =>
        item.title.toLowerCase().includes('vingadores') ||
        item.title.toLowerCase().includes('avengers')
      );
      return { current: avengersMovies.filter(item => watched.has(item.id)).length, total: avengersMovies.length };
    },
  },
  {
    id: 'movie-buff',
    title: 'Cinéfilo Marvel',
    description: 'Assista todos os filmes do MCU',
    icon: '🎥',
    rarity: 'legendary',
    condition: (watched) => {
      const movies = mcuData.filter(item => item.type === 'movie');
      return movies.every(item => watched.has(item.id));
    },
    progress: (watched) => {
      const movies = mcuData.filter(item => item.type === 'movie');
      return { current: movies.filter(item => watched.has(item.id)).length, total: movies.length };
    },
  },
  {
    id: 'series-binger',
    title: 'Maratonista de Séries',
    description: 'Assista todas as séries do MCU',
    icon: '📺',
    rarity: 'legendary',
    condition: (watched) => {
      const series = mcuData.filter(item => item.type === 'series');
      return series.every(item => watched.has(item.id));
    },
    progress: (watched) => {
      const series = mcuData.filter(item => item.type === 'series');
      return { current: series.filter(item => watched.has(item.id)).length, total: series.length };
    },
  },
  {
    id: 'iron-man-saga',
    title: 'Eu Sou o Homem de Ferro',
    description: 'Assista toda a trilogia do Homem de Ferro',
    icon: '🔴',
    rarity: 'rare',
    condition: (watched) => {
      const ironManMovies = mcuData.filter(item =>
        item.title.toLowerCase().includes('homem de ferro') ||
        item.title.toLowerCase().includes('iron man')
      );
      return ironManMovies.length >= 3 && ironManMovies.slice(0, 3).every(item => watched.has(item.id));
    },
  },
  {
    id: 'guardian-fan',
    title: 'Guardiões da Galáxia',
    description: 'Assista todos os títulos dos Guardiões',
    icon: '🚀',
    rarity: 'rare',
    condition: (watched) => {
      const guardiansMovies = mcuData.filter(item =>
        item.title.toLowerCase().includes('guardiões') ||
        item.title.toLowerCase().includes('guardians')
      );
      return guardiansMovies.every(item => watched.has(item.id));
    },
  },
  {
    id: 'spider-verse',
    title: 'Com Grandes Poderes',
    description: 'Assista todos os filmes do Homem-Aranha no MCU',
    icon: '🕷️',
    rarity: 'rare',
    condition: (watched) => {
      const spiderManMovies = mcuData.filter(item =>
        item.title.toLowerCase().includes('homem-aranha') ||
        item.title.toLowerCase().includes('spider-man')
      );
      return spiderManMovies.every(item => watched.has(item.id));
    },
  },
  {
    id: 'thor-saga',
    title: 'Deus do Trovão',
    description: 'Assista todos os filmes do Thor',
    icon: '⚡',
    rarity: 'rare',
    condition: (watched) => {
      const thorMovies = mcuData.filter(item =>
        item.title.toLowerCase().includes('thor')
      );
      return thorMovies.every(item => watched.has(item.id));
    },
  },
  {
    id: 'captain-saga',
    title: 'Posso Fazer Isso o Dia Todo',
    description: 'Assista todos os filmes do Capitão América',
    icon: '🛡️',
    rarity: 'rare',
    condition: (watched) => {
      const capMovies = mcuData.filter(item =>
        item.title.toLowerCase().includes('capitão américa') ||
        item.title.toLowerCase().includes('captain america')
      );
      return capMovies.every(item => watched.has(item.id));
    },
  },
];

// Função para obter conquistas desbloqueadas
export function getUnlockedAchievements(watchedItems: Set<string>): Achievement[] {
  return achievements.filter(achievement => achievement.condition(watchedItems));
}

// Função para obter conquistas em progresso
export function getInProgressAchievements(watchedItems: Set<string>): Achievement[] {
  return achievements.filter(achievement =>
    !achievement.condition(watchedItems) &&
    achievement.progress &&
    achievement.progress(watchedItems).current > 0
  );
}

// Função para obter todas as conquistas com status
export function getAllAchievementsWithStatus(watchedItems: Set<string>) {
  return achievements.map(achievement => ({
    ...achievement,
    unlocked: achievement.condition(watchedItems),
    progressData: achievement.progress?.(watchedItems),
  }));
}

// Cores por raridade
export const rarityColors = {
  common: {
    bg: 'bg-gray-500/20',
    border: 'border-gray-500/30',
    text: 'text-gray-400',
    glow: '',
  },
  rare: {
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    glow: 'shadow-blue-500/20',
  },
  epic: {
    bg: 'bg-purple-500/20',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    glow: 'shadow-purple-500/20',
  },
  legendary: {
    bg: 'bg-yellow-500/20',
    border: 'border-yellow-500/30',
    text: 'text-yellow-400',
    glow: 'shadow-yellow-500/30',
  },
};

export const rarityLabels = {
  common: 'Comum',
  rare: 'Raro',
  epic: 'Épico',
  legendary: 'Lendário',
};
