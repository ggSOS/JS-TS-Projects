import express from "express";
import cors from "cors";
import { randomUUID } from "crypto";
import { ALUNOS_PERMITIDOS } from "./dados/alunosPermitidos";
import { Equipe } from "./types";
import {
  SessaoManager,
  authMiddleware,
  AuthenticatedRequest,
} from "./middleware/auth";
import lutadoresJson from "../data/lutadores.json";

export const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/login", (req, res) => {
  // checar dados completos
  const { nomeUsuario, rm } = req.body;
  if (!nomeUsuario || !rm) {
    return res.status(400).json({
      error: "nomeUsuario e rm são obrigatorios",
    });
  }

  // evitar login duplicado
  const tokenExistente = SessaoManager.buscarPorRm(rm);
  if (tokenExistente) {
    SessaoManager.remover(tokenExistente);
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
      nome: nomeUsuario.trim(),
      rm,
      equipe,
    },
  });

  res.status(501).json({ error: "Erro no Servidor" });
});

app.post("/api/logout", authMiddleware, (req: AuthenticatedRequest, res) => {
  if (req.usuario) {
    const tokenExistente = SessaoManager.buscarPorRm(req.usuario.rm || "");

    if (tokenExistente) {
      SessaoManager.remover(tokenExistente);
    }
  }
  res.json({ message: "Logout realizado com sucesso" });

  res.status(501).json({ error: "Erro no Servidor" });
});

app.get("/api/personagens", (_req, res) => {
  res.json(lutadoresJson);

  res.status(501).json({ error: "Erro no Servidor" });
});

app.get("/api/alunos", authMiddleware, (_req, res) => {
  const alunos = SessaoManager.listarTodos();
  res.json({
    total: alunos.length,
    alunos,
  });

  res.status(501).json({ error: "Erro no Servidor" });
});

app.get("/api/me", authMiddleware, (req: AuthenticatedRequest, res) => {
  res.json({ aluno: req.usuario });

  res.status(501).json({ error: "Erro no Servidor" });
});

// GET /health — Health check (pré-pronto)
app.get("/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});
