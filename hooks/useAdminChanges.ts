'use client';

import { useState, useEffect } from 'react';
import { mcuData, MCUItem } from '@/data/mcu-data';

export function useAdminChanges() {
  const [items, setItems] = useState<MCUItem[]>(mcuData);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Carregar alterações do admin do localStorage
    const savedChanges = localStorage.getItem('mcu-admin-changes');

    if (savedChanges) {
      try {
        const changes = JSON.parse(savedChanges);

        // Aplicar alterações aos itens
        const updatedItems = mcuData.map(item => {
          const itemChanges = changes[item.id];
          if (itemChanges) {
            return { ...item, ...itemChanges };
          }
          return item;
        });

        setItems(updatedItems);
      } catch (error) {
        console.error('Erro ao carregar alterações do admin:', error);
        setItems(mcuData);
      }
    }

    setIsLoaded(true);
  }, []);

  return { items, isLoaded };
}

// Função utilitária para obter os dados com alterações (pode ser usada fora de componentes)
export function getMCUDataWithChanges(): MCUItem[] {
  if (typeof window === 'undefined') {
    return mcuData;
  }

  const savedChanges = localStorage.getItem('mcu-admin-changes');

  if (!savedChanges) {
    return mcuData;
  }

  try {
    const changes = JSON.parse(savedChanges);

    return mcuData.map(item => {
      const itemChanges = changes[item.id];
      if (itemChanges) {
        return { ...item, ...itemChanges };
      }
      return item;
    });
  } catch (error) {
    console.error('Erro ao carregar alterações do admin:', error);
    return mcuData;
  }
}
