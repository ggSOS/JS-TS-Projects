import express from "express";
import cors from "cors";
import { randomUUID } from "crypto";
import { ALUNOS_PERMITIDOS } from "./dados/alunosPermitidos";
import { Equipe } from "./types";
import { SessaoManager, authMiddleware } from "./middleware/auth";

export const app = express();

app.use(cors());
app.use(express.json());

/*
  modelo de Body do Input:

  {
      "nomeUsuario": "Paulo Reis",
      "rm": "76729"
  }
    */
app.post("/api/login", (req, res) => {
  // checar dados completos
  const nomeUsuario = req.body.nomeUsuario;
  const rm = req.body.rm;
  if (!nomeUsuario || !rm) {
    res.status(400).json({
      error: "nomeUsuario e rm são obrigatorios",
    });
  }

  // checar permissao
  const aluno = ALUNOS_PERMITIDOS.find((i) => i.rm === String(rm));
  if (!aluno) {
    res.status(401).json({
      error: "nao autorizado",
    });
  }

  // salvar dados na sessão e enviar login completo
  const equipe = SessaoManager.atribuirEquipe();
  const token = randomUUID();
  SessaoManager.criar(token, {
    nome: nomeUsuario,
    rm,
    equipe,
  });
  // 200 por padrao
  res.json({
    token,
    aluno: {
      nomeUsuario,
      rm,
      equipe,
    },
  });

  res.status(501).json({ error: "Erro no Servidor" });
});

/*
  No Header ou no Authorization:

  Key             -   Value
  Authorization   -   Bearer 5ee836e8-c434-4b39-921a-4b95418636d4
*/
app.get("/api/alunos", authMiddleware, (req, res) => {
  const alunos = SessaoManager.listarTodos();
  res.json({
    alunos,
    totalAlunos: alunos,
  });

  res.status(501).json({ error: "Erro no Servidor" });
});

app.delete("/api/logout", authMiddleware, (req, res) => {
  
  res.status(204).send(SessaoManager.remover(req.usuario.rm)) // todo arrumar delete
});

// GET /api/me — Dados do aluno autenticado (protegida)
// TODO: Adicionar authMiddleware como segundo argumento
// TODO: Retornar (req as any).usuario
app.get("/api/me", (req, res) => {
  // Implementar aqui (não esquecer do authMiddleware!)
  res.status(501).json({ error: "Não implementado" });
});

// GET /health — Health check (pré-pronto)
app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});
