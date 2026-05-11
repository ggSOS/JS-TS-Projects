import { createBroker, Client, AedesPublishPacket } from 'aedes';
import { createServer } from 'net';
import { createServer as createHttpServer } from 'http';
import { WebSocketServer, createWebSocketStream } from 'ws';

const PORT_TCP = 1883;
const PORT_WS = 8083;

const broker = createBroker();

const tcpServer = createServer((socket) => broker.handle(socket));
tcpServer.listen(PORT_TCP, () => {
  console.log(`Broker MQTT (TCP) na porta ${PORT_TCP}`);
});

const httpServer = createHttpServer();
const wss = new WebSocketServer({ server: httpServer });
wss.on('connection', (ws) => {
  const stream = createWebSocketStream(ws);
  broker.handle(stream);
});
httpServer.listen(PORT_WS, () => {
  console.log(`Broker MQTT (WebSocket) na porta ${PORT_WS}`);
});

broker.on('client', (cliente: Client) => {
  console.log(`[broker] cliente conectado: ${cliente.id}`);
});

broker.on('clientDisconnect', (cliente: Client) => {
  console.log(`[broker] cliente desconectado: ${cliente.id}`);
});

broker.on('publish', (pacote: AedesPublishPacket, cliente: Client | null) => {
  if (!cliente) return;
  const payload = pacote.payload instanceof Buffer ? pacote.payload.toString() : pacote.payload;
  console.log(`[broker] publish em "${pacote.topic}": ${payload}`);
});
