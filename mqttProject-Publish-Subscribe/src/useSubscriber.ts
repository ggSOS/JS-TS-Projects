import { useEffect, useRef, useState } from 'react';
import mqtt from 'mqtt';
import { API_URL, POLLING_INTERVALO_MS } from './config';
import type { Leitura } from './types';

interface RespostaLeitura {
  valor: string;
  atualizadoEm: number;
}

interface SubscriberState {
  conectado: boolean;
  ultimas: Map<string, Leitura>;
  historico: Map<string, Leitura[]>;
}

const TAMANHO_HISTORICO = 20;

export function useSubscriber(): SubscriberState {
  const [conectado, setConectado] = useState(false);
  const [ultimas, setUltimas] = useState<Map<string, Leitura>>(new Map());
  const [historico, setHistorico] = useState<Map<string, Leitura[]>>(new Map());
  const ultimoValorPorTopico = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    const client = mqtt.connect('ws://localhost:8083')

    client.on('close', () => {
      setConectado(false)
    })

    client.on('connect', () => {
      setConectado(true)
      client.subscribe('sensor/sala-a/temperatura')
      client.subscribe('sensor/corredor/temperatura')
      client.subscribe('sensor/sala-a/umidade')
      client.subscribe('sensor/status')
    })

    client.on('message', (topic: string, payload: Buffer) => {
      const leitura: Leitura = {
        recebidoEm: Date.now(),
        topico: topic,
        valor: payload.toString()
      }

      setUltimas(prev => {
        const novo = new Map(prev)
        novo.set(topic, leitura)
        return novo
      })
    })

    return () => {
      client.end()
    }
  }, []);

  return { conectado, ultimas, historico };
}
