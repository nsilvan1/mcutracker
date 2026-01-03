'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, RefreshCw } from 'lucide-react';
import { useOfflineStatus } from '@/hooks/useServiceWorker';

export default function OfflineIndicator() {
  const isOffline = useOfflineStatus();

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-orange-600 to-red-600 text-white py-2 px-4 shadow-lg"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
            <WifiOff className="w-4 h-4" />
            <span className="text-sm font-medium">
              Você está offline. Algumas funcionalidades podem estar limitadas.
            </span>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-1 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-xs font-medium transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Tentar novamente
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Componente para mostrar quando há atualização disponível
export function UpdateAvailableToast({
  onUpdate,
  onDismiss,
}: {
  onUpdate: () => void;
  onDismiss: () => void;
}) {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-[100] bg-marvel-gray border border-white/10 rounded-xl p-4 shadow-2xl"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
          <RefreshCw className="w-5 h-5 text-green-400" />
        </div>
        <div className="flex-1">
          <h4 className="text-white font-semibold mb-1">Atualização disponível</h4>
          <p className="text-gray-400 text-sm mb-3">
            Uma nova versão do MCU Tracker está disponível.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onUpdate}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Atualizar agora
            </button>
            <button
              onClick={onDismiss}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-gray-300 text-sm font-medium rounded-lg transition-colors"
            >
              Depois
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
