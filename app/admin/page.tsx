'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Esta pagina agora redireciona para a home
// O acesso admin e feito via perfil do usuario logado
export default function AdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Verificar se o usuario esta logado e e admin
    const savedUser = localStorage.getItem('mcu-user');

    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        if (userData.isAdmin) {
          // Se for admin, redirecionar para o dashboard
          router.push('/admin/dashboard');
          return;
        }
      } catch (error) {
        console.error('Erro ao verificar usuario:', error);
      }
    }

    // Se nao for admin ou nao estiver logado, redirecionar para home
    router.push('/');
  }, [router]);

  return (
    <div className="min-h-screen bg-marvel-dark flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-marvel-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Verificando acesso...</p>
      </div>
    </div>
  );
}
