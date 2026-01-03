'use client';

import { useState, useEffect } from 'react';
import { mcuData, MCUItem } from '@/data/mcu-data';

interface DBChanges {
  [itemId: string]: {
    trailerUrl?: string;
    trailerUrlDublado?: string;
    trailerUrlLegendado?: string;
    customDescription?: string;
    customSynopsis?: string;
    customImageUrl?: string;
    customBackdropUrl?: string;
  };
}

export function useAdminChanges() {
  const [items, setItems] = useState<MCUItem[]>(mcuData);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Buscar alteracoes do MongoDB via API publica
    const fetchChanges = async () => {
      try {
        const response = await fetch('/api/mcu');

        if (response.ok) {
          const data = await response.json();
          const changes: DBChanges = data.items || {};

          // Função para validar URLs de imagem
          const isValidImageUrl = (url: string | undefined): boolean => {
            if (!url) return false;
            // Ignorar URLs do wikia e outras URLs problemáticas
            if (url.includes('wikia.nocookie.net')) return false;
            // URLs antigas que não funcionam mais
            if (url.includes('rAGiXaUfPu0D2jwU0xNkIgAKbNX')) return false;
            if (url.includes('glKDfE6btIRcVB5zrjspRFs4ltW')) return false;
            if (url.includes('7PiOxc7zqIqL9hg8G4imtcaOZKS')) return false;
            return true;
          };

          // Aplicar alteracoes aos itens
          const updatedItems = mcuData.map(item => {
            const itemChanges = changes[item.id];
            if (itemChanges) {
              return {
                ...item,
                trailerUrl: itemChanges.trailerUrl || item.trailerUrl,
                trailerUrlDublado: itemChanges.trailerUrlDublado || item.trailerUrlDublado,
                trailerUrlLegendado: itemChanges.trailerUrlLegendado || item.trailerUrlLegendado,
                description: itemChanges.customDescription || item.description,
                synopsis: itemChanges.customSynopsis || item.synopsis,
                imageUrl: (itemChanges.customImageUrl && isValidImageUrl(itemChanges.customImageUrl)) ? itemChanges.customImageUrl : item.imageUrl,
                backdropUrl: (itemChanges.customBackdropUrl && isValidImageUrl(itemChanges.customBackdropUrl)) ? itemChanges.customBackdropUrl : item.backdropUrl,
              };
            }
            return item;
          });

          setItems(updatedItems);
        } else {
          // Em caso de erro, usar dados locais
          setItems(mcuData);
        }
      } catch (error) {
        console.error('Erro ao carregar alteracoes do admin:', error);
        setItems(mcuData);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchChanges();
  }, []);

  return { items, isLoaded };
}

// Funcao utilitaria para obter os dados com alteracoes (pode ser usada fora de componentes)
export async function getMCUDataWithChanges(): Promise<MCUItem[]> {
  if (typeof window === 'undefined') {
    return mcuData;
  }

  try {
    const response = await fetch('/api/mcu');

    if (!response.ok) {
      return mcuData;
    }

    const data = await response.json();
    const changes: DBChanges = data.items || {};

    // Função para validar URLs de imagem
    const isValidImageUrl = (url: string | undefined): boolean => {
      if (!url) return false;
      // Ignorar URLs do wikia e outras URLs problemáticas
      if (url.includes('wikia.nocookie.net')) return false;
      // URLs antigas que não funcionam mais
      if (url.includes('rAGiXaUfPu0D2jwU0xNkIgAKbNX')) return false;
      if (url.includes('glKDfE6btIRcVB5zrjspRFs4ltW')) return false;
      if (url.includes('7PiOxc7zqIqL9hg8G4imtcaOZKS')) return false;
      return true;
    };

    return mcuData.map(item => {
      const itemChanges = changes[item.id];
      if (itemChanges) {
        return {
          ...item,
          trailerUrl: itemChanges.trailerUrl || item.trailerUrl,
          trailerUrlDublado: itemChanges.trailerUrlDublado || item.trailerUrlDublado,
          trailerUrlLegendado: itemChanges.trailerUrlLegendado || item.trailerUrlLegendado,
          description: itemChanges.customDescription || item.description,
          synopsis: itemChanges.customSynopsis || item.synopsis,
          imageUrl: (itemChanges.customImageUrl && isValidImageUrl(itemChanges.customImageUrl)) ? itemChanges.customImageUrl : item.imageUrl,
          backdropUrl: (itemChanges.customBackdropUrl && isValidImageUrl(itemChanges.customBackdropUrl)) ? itemChanges.customBackdropUrl : item.backdropUrl,
        };
      }
      return item;
    });
  } catch (error) {
    console.error('Erro ao carregar alteracoes do admin:', error);
    return mcuData;
  }
}
