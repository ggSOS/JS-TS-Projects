# Exercício: migrar do Polling para MQTT

Este boilerplate **já vem funcionando** numa implementação de polling REST. Seu trabalho é migrar para MQTT seguindo a apostila.

## O que está rodando

```bash
npm install
npm run dev
```

Sobe quatro processos em paralelo:

| Processo | O que faz | Porta(s) |
|----------|-----------|----------|
| `broker.ts` | Broker MQTT Aedes (TCP + WebSocket) | 1883, 8083 |
| `server.ts` | Express com `GET /api/leituras/:topico` e `POST /api/publicar` | 3000 |
| `sensor.ts` | A cada 5s, faz `fetch POST` em `/api/publicar` (estado inicial: usa polling) | — |
| Vite | Dashboard React | 5173 |

O broker fica **subindo de graça em paralelo**. Você ainda não o usa: o sensor publica via HTTP e o dashboard faz polling. Conforme a apostila avança, você passa a usar o broker que já está ativo.

## A migração

Você vai trocar a infra inteira sem mexer no layout (UI fica idêntica):

| Antes (polling) | Depois (MQTT) |
|-----------------|---------------|
| `server.ts` (Express) | `broker.ts` (Aedes, já está rodando) |
| `sensor.ts` faz `fetch POST` | `sensor.ts` faz `client.publish` |
| `useSubscriber` com `setInterval(fetch, 500)` por tópico | `useSubscriber` com `mqtt.connect` + `subscribe` + `on('message')` |
| `usePublisher` com `fetch POST` | `usePublisher` com `client.publish` + QoS + retain |
| `API_URL` em config | `BROKER_URL` em config |

Arquivos que **não mudam**: `cores.ts`, `styles.css`, `App.tsx` (só o header), `main.tsx`, `vite.config.ts`, `tsconfig.json`, `index.html`.

As dependências **já estão todas instaladas** (`aedes`, `mqtt`, `express`). Em produção real, ao final você removeria `express` e `cors`. Aqui mantemos os dois lados para você poder rodar e comparar.

Siga as seções da APOSTILA. Ao final, o card deve atualizar **no instante** em que o sensor publica, sem polling.

## O que comparar lado a lado

Cada decisão que o MQTT toma por você corresponde a algo que você precisou escrever no polling:

- Polling: um `fetch` explícito por tópico no `useSubscriber`, e uma rota correspondente no `server.ts`. Adicionar um sensor novo: editar dois arquivos.
- MQTT: `subscribe('sensor/#')` e pronto. Wildcard recebe tudo sem listar.

- Polling: dois clientes batem no server a cada 500ms cada.
- MQTT: broker faz fan-out, custo perto de zero.

- Polling: para manter o "último valor", o server guarda em `Map<string, Leitura>` em memória.
- MQTT: `retain: true` no publish, broker guarda automaticamente.
