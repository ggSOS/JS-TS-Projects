import { useCallback } from 'react';
import { API_URL } from './config';

interface PublisherState {
  conectado: boolean;
  publicar: (topico: string, valor: string) => Promise<void>;
}

export function usePublisher(): PublisherState {
  const publicar = useCallback(async (topico: string, valor: string): Promise<void> => {
    const resp = await fetch(`${API_URL}/api/publicar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topico, valor }),
    });
    if (!resp.ok) {
      console.error(`erro ao publicar: ${resp.status}`);
    }
  }, []);

  return { conectado: true, publicar };
}
