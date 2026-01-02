'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, LogIn, Shield } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Verificar se já está autenticado
  useEffect(() => {
    const adminAuth = localStorage.getItem('mcu-admin-auth');
    if (adminAuth === 'authenticated') {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Senha simples para admin (em produção, use autenticação real)
    // A senha padrão é "mcuadmin2024" - pode ser alterada no código
    const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'mcuadmin2024';

    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('mcu-admin-auth', 'authenticated');
      localStorage.setItem('mcu-admin-auth-time', Date.now().toString());
      router.push('/admin/dashboard');
    } else {
      setError('Senha incorreta');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-marvel-dark flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-marvel-gray rounded-2xl p-8 shadow-2xl border border-white/10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-marvel-red/20 mb-4">
              <Shield className="w-8 h-8 text-marvel-red" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Admin MCU Tracker</h1>
            <p className="text-gray-400 text-sm">
              Acesse o painel de administração para gerenciar filmes e séries
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Senha de Administrador
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite a senha"
                  className="w-full pl-11 pr-4 py-3 bg-marvel-dark border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-marvel-red focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg"
              >
                <p className="text-red-400 text-sm text-center">{error}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-marvel-red hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition-all"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Entrar
                </>
              )}
            </button>
          </form>

          {/* Back link */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Voltar para o site
            </a>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs mt-4">
          Acesso restrito a administradores
        </p>
      </motion.div>
    </div>
  );
}
