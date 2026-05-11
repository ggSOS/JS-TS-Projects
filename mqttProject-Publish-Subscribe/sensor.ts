import mqtt from 'mqtt';
const INTERVAL = 1000
const API_URL = 'http://localhost:3000';
const BROKER = 'mqtt://localhost:1883';

type Status = 'online' | 'alerta' | 'offline';
const STATUS_CICLO: Status[] = ['online', 'online', 'online', 'online', 'alerta', 'online', 'online', 'offline'];

let tick = 0;

function proximaTemperatura(sala: 'sala-a' | 'corredor'): number {
  const base = sala === 'sala-a' ? 22 : 20;
  const oscilacao = Math.sin(tick / 6) * 8;
  const ruido = (Math.random() - 0.5) * 2;
  return Math.max(15, Math.min(35, base + oscilacao + ruido));
}

function proximaUmidade(): number {
  const base = 55;
  const oscilacao = Math.sin(tick / 8 + 1) * 25;
  const ruido = (Math.random() - 0.5) * 4;
  return Math.max(30, Math.min(85, base + oscilacao + ruido));
}

function proximoStatus(): Status {
  return STATUS_CICLO[tick % STATUS_CICLO.length];
}

async function publicar(topico: string, valor: string): Promise<void> {
  const resp = await fetch(`${API_URL}/api/publicar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topico, valor }),
  });
  if (!resp.ok) {
    console.log(`Sensor erro ao publicar em ${topico}: ${resp.status}`);
  }
}

console.log('Sensor iniciando. Publicando a cada 5 segundos...');

const client = mqtt.connect(BROKER);

setInterval(() => {
  tick++;
  const temperaturaSalaA = proximaTemperatura('sala-a').toFixed(1);
  const temperaturaCorredor = proximaTemperatura('corredor').toFixed(1);
  const umidade = proximaUmidade().toFixed(0);
  const status = proximoStatus();

  publicar('sensor/sala-a/temperatura', temperaturaSalaA);
  publicar('sensor/corredor/temperatura', temperaturaCorredor);
  publicar('sensor/sala-a/umidade', umidade);
  publicar('sensor/status', status);

  if (client.connected) {
    client.publish('sensor/sala-a/temperatura', temperaturaSalaA, { retain: true });
    client.publish('sensor/corredor/temperatura', temperaturaCorredor, { retain: true });
    client.publish('sensor/sala-a/umidade', umidade, { retain: true });
    client.publish('sensor/status', status, { retain: true });
  }

   console.log(`tick ${tick} | sala-a ${temperaturaSalaA}°C | corredor ${temperaturaCorredor}°C | umidade ${umidade}% | status ${status}`);
}, INTERVAL);
