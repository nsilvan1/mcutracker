'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Lock, Sparkles } from 'lucide-react';
import {
  getAllAchievementsWithStatus,
  rarityColors,
  rarityLabels,
  Achievement,
} from '@/lib/achievements';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  watchedItems: Set<string>;
}

export default function AchievementsModal({
  isOpen,
  onClose,
  watchedItems,
}: AchievementsModalProps) {
  const achievementsWithStatus = getAllAchievementsWithStatus(watchedItems);
  const unlockedCount = achievementsWithStatus.filter((a) => a.unlocked).length;
  const totalCount = achievementsWithStatus.length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[80vh] bg-marvel-dark border border-white/10 rounded-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-gradient-to-r from-marvel-red/10 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg shadow-yellow-500/20">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Conquistas</h2>
                    <p className="text-sm text-gray-400">
                      {unlockedCount} de {totalCount} desbloqueadas
                    </p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid gap-3">
                {achievementsWithStatus.map((achievement, index) => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface AchievementWithStatus extends Achievement {
  unlocked: boolean;
  progressData?: { current: number; total: number };
}

function AchievementCard({
  achievement,
  index,
}: {
  achievement: AchievementWithStatus;
  index: number;
}) {
  const colors = rarityColors[achievement.rarity];
  const progressPercent = achievement.progressData
    ? (achievement.progressData.current / achievement.progressData.total) * 100
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className={`relative p-4 rounded-xl border transition-all ${
        achievement.unlocked
          ? `${colors.bg} ${colors.border} shadow-lg ${colors.glow}`
          : 'bg-white/5 border-white/10 opacity-60'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
            achievement.unlocked
              ? `${colors.bg} border ${colors.border}`
              : 'bg-white/5 border border-white/10'
          }`}
        >
          {achievement.unlocked ? (
            achievement.icon
          ) : (
            <Lock className="w-5 h-5 text-gray-600" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-semibold ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`}>
              {achievement.title}
            </h3>
            {achievement.unlocked && (
              <Sparkles className={`w-4 h-4 ${colors.text}`} />
            )}
          </div>

          <p className="text-sm text-gray-500 mb-2">{achievement.description}</p>

          {/* Rarity badge */}
          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}
            >
              {rarityLabels[achievement.rarity]}
            </span>

            {/* Progress */}
            {achievement.progressData && !achievement.unlocked && (
              <span className="text-xs text-gray-500">
                {achievement.progressData.current}/{achievement.progressData.total}
              </span>
            )}
          </div>

          {/* Progress bar */}
          {achievement.progressData && !achievement.unlocked && (
            <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className={`h-full rounded-full ${
                  achievement.rarity === 'legendary'
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                    : achievement.rarity === 'epic'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                    : achievement.rarity === 'rare'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                    : 'bg-gray-500'
                }`}
              />
            </div>
          )}
        </div>

        {/* Unlocked indicator */}
        {achievement.unlocked && (
          <div className="shrink-0">
            <div className={`w-8 h-8 rounded-full ${colors.bg} border ${colors.border} flex items-center justify-center`}>
              <span className="text-lg">✓</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
