import express, { Request, Response } from 'express';
import cors from 'cors';

interface CorpoPublicacao {
  topico: string;
  valor: string;
}

interface Leitura {
  valor: string;
  atualizadoEm: number;
}

const PORT = 3000;
const estado = new Map<string, Leitura>();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/leituras/*', (req: Request, res: Response) => {
  const topico = req.params[0];
  const leitura = estado.get(topico);
  if (!leitura) {
    res.status(404).json({ erro: `topico nao encontrado: ${topico}` });
    return;
  }
  res.json(leitura);
});

app.post('/api/publicar', (req: Request<unknown, unknown, CorpoPublicacao>, res: Response) => {
  const { topico, valor } = req.body;
  if (typeof topico !== 'string' || typeof valor !== 'string') {
    res.status(400).json({ erro: 'topico e valor sao obrigatorios e devem ser strings' });
    return;
  }
  estado.set(topico, { valor, atualizadoEm: Date.now() });
  console.log(`[server] publicado em "${topico}": ${valor}`);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Server HTTP na porta ${PORT}`);
});
