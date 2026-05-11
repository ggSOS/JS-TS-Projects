import { useState } from 'react';
import { useSubscriber } from './useSubscriber';
import { usePublisher } from './usePublisher';
import { corPorTopico } from './cores';

const HISTORICO_TAMANHO = 5;

export function App(): JSX.Element {
  const { conectado, ultimas, historico } = useSubscriber();
  const { publicar } = usePublisher();

  const [topico, setTopico] = useState('sensor/sala-a/temperatura');
  const [valor, setValor] = useState('40');

  const enviar = (): void => {
    publicar(topico, valor);
  };

  const topicos = Array.from(ultimas.keys()).sort();

  return (
    <div className="container">
      <h1>Dashboard Polling</h1>
      <span className={`status ${conectado ? 'conectado' : 'desconectado'}`}>
        {conectado ? 'conectado ao server' : 'desconectado'}
      </span>

      <h2>Leituras (polling por tópico)</h2>
      {topicos.length === 0 ? (
        <div className="vazio">aguardando primeira resposta do server...</div>
      ) : (
        <div className="cards">
          {topicos.map((t) => {
            const ultimo = ultimas.get(t);
            const hist = historico.get(t) ?? [];
            if (!ultimo) return null;
            const cor = corPorTopico(t, ultimo.valor);
            return (
              <div key={t} className="card" style={{ background: cor }}>
                <div className="topico">{t}</div>
                <div className="valor">{ultimo.valor}</div>
                <div className="historico">
                  {hist.slice(-HISTORICO_TAMANHO).reverse().map((l, i) => (
                    <div key={i}>{l.valor}</div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <h2>Publicar manualmente</h2>
      <div className="publisher">
        <label>
          tópico
          <input value={topico} onChange={(e) => setTopico(e.target.value)} />
        </label>
        <label>
          valor
          <input value={valor} onChange={(e) => setValor(e.target.value)} />
        </label>
        <button onClick={enviar}>publicar</button>
      </div>
    </div>
  );
}
