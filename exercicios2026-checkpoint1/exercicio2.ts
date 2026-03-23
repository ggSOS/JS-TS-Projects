// ─── EXERCÍCIO 2 ───────────────────────────────────────────────────────────
// TODO: interface Endereco
interface Endereco {
  rua: string;
  numero: number;
  complemento?: string;
}
// TODO: type StatusEntrega
type StatusEntrega = "PENDENTE" | "EM_TRANSITO" | "ENTREGUE";
// TODO: interface Pacote
interface Pacote {
  id:(string),
  peso:(number),
  destino:(Endereco),
  status:(StatusEntrega)
}
// TODO: type ResultadoEntrega
type ResultadoEntrega = Pacote | null
// ─── Teste (não modifique) ───────────────────────────────────────────────────
const endereco: Endereco = { rua: "Av Paulista", numero: 1000 };
const enderecoCompleto: Endereco = {
  rua: "Rua Augusta",
  numero: 50,
  complemento: "Apto 3",
};
const pacote: Pacote = {
  id: "p1",
  peso: 2.5,
  destino: endereco,
  status: "EM_TRANSITO",
};
const encontrado: ResultadoEntrega = pacote;
const naoEncontrado: ResultadoEntrega = null;
const statusAtual: StatusEntrega = "PENDENTE";
const invalido: StatusEntrega = 'DEVOLVIDO'; // ← deve dar erro
console.log(pacote.destino.rua, statusAtual); // Av Paulista PENDENTE
