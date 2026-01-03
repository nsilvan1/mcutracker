'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Share2,
  X,
  Twitter,
  Facebook,
  Copy,
  Check,
  MessageCircle,
  Link2,
} from 'lucide-react';
import { mcuData } from '@/data/mcu-data';

interface ShareProgressProps {
  watchedCount: number;
  totalCount: number;
  userName?: string;
}

export default function ShareProgress({
  watchedCount,
  totalCount,
  userName,
}: ShareProgressProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const percentage = Math.round((watchedCount / totalCount) * 100);

  const getShareText = () => {
    const baseText = userName
      ? `${userName} já assistiu ${watchedCount} de ${totalCount} títulos do MCU (${percentage}%)!`
      : `Já assisti ${watchedCount} de ${totalCount} títulos do MCU (${percentage}%)!`;

    let badge = '';
    if (percentage >= 100) badge = ' - Completista! ';
    else if (percentage >= 75) badge = ' - Veterano ';
    else if (percentage >= 50) badge = ' - Fã Marvel ';
    else if (percentage >= 25) badge = ' - Iniciante ';

    return `${baseText}${badge}\n\nPreparando para Vingadores: Doomsday!\n\n#MCUTracker #Marvel #Vingadores`;
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const handleCopy = async () => {
    const text = `${getShareText()}\n\n${shareUrl}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(getShareText());
    const url = encodeURIComponent(shareUrl);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const handleFacebookShare = () => {
    const url = encodeURIComponent(shareUrl);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`${getShareText()}\n\n${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <>
      {/* Share button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10 transition-all"
      >
        <Share2 className="w-4 h-4" />
        <span className="text-sm font-medium">Compartilhar</span>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-marvel-dark border border-white/10 rounded-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Share2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">
                        Compartilhar Progresso
                      </h2>
                      <p className="text-sm text-gray-400">
                        Mostre sua maratona Marvel!
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Progress preview */}
              <div className="p-6 border-b border-white/10 bg-gradient-to-br from-marvel-red/10 to-transparent">
                <div className="text-center">
                  <p className="text-4xl font-bold text-white mb-1">
                    {percentage}%
                  </p>
                  <p className="text-gray-400 text-sm">
                    {watchedCount} de {totalCount} títulos assistidos
                  </p>
                  <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-marvel-red to-red-500 rounded-full"
                    />
                  </div>
                </div>
              </div>

              {/* Share options */}
              <div className="p-6">
                <p className="text-sm text-gray-400 mb-4">
                  Compartilhar via:
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleTwitterShare}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 text-[#1DA1F2] rounded-xl transition-colors border border-[#1DA1F2]/30"
                  >
                    <Twitter className="w-5 h-5" />
                    <span className="font-medium">Twitter</span>
                  </button>

                  <button
                    onClick={handleFacebookShare}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1877F2]/20 hover:bg-[#1877F2]/30 text-[#1877F2] rounded-xl transition-colors border border-[#1877F2]/30"
                  >
                    <Facebook className="w-5 h-5" />
                    <span className="font-medium">Facebook</span>
                  </button>

                  <button
                    onClick={handleWhatsAppShare}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] rounded-xl transition-colors border border-[#25D366]/30"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-medium">WhatsApp</span>
                  </button>

                  <button
                    onClick={handleCopy}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-colors border ${
                      copied
                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                        : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span className="font-medium">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        <span className="font-medium">Copiar</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Preview text */}
                <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-xs text-gray-400 whitespace-pre-line">
                    {getShareText()}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
