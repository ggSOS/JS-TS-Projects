// ─── EXERCÍCIO 1 ─────────────────────────────────────────────────────────────
// TODO: enum GeneroEnum
enum GeneroEnum {
  FICCAO = "FICCAO",
  TECNICO = "TECNICO",
}
// TODO: interface Livro
interface Livro {
  id: string;
  titulo: string;
  genero: GeneroEnum;
  paginas: number;
  lido: boolean;
}
// TODO: interface Estante
interface Estante {
  [GeneroEnum.FICCAO]: number;
  [GeneroEnum.TECNICO]: number;
}
// ─── Teste (não modifique) ───────────────────────────────────────────────────
const g: GeneroEnum = GeneroEnum.FICCAO;
const livro: Livro = {
  id: "l1",
  titulo: "1984",
  genero: GeneroEnum.FICCAO,
  paginas: 328,
  lido: true,
};
const estante: Estante = {
  [GeneroEnum.FICCAO]: 0,
  [GeneroEnum.TECNICO]: 0,
};
console.log(livro.titulo, estante[GeneroEnum.FICCAO]); // 1984 0
