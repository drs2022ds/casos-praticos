"use strict";
const crypto = require("crypto");
const db = require("./db");
const C = require("./cases");

const TRAINER_KEY = () => process.env.TRAINER_KEY || "formador";
const TOKEN_RE = /^[A-Za-z0-9-]{16,64}$/;

class HttpError extends Error {
  constructor(status, msg, extra) { super(msg); this.status = status; this.extra = extra; }
}
const send = (res, status, body, headers = {}) => {
  const isStr = typeof body === "string";
  res.writeHead(status, { "content-type": isStr ? "text/plain; charset=utf-8" : "application/json; charset=utf-8", "cache-control": "no-store", ...headers });
  res.end(isStr ? body : JSON.stringify(body));
};

async function readJson(req) {
  if (req.body !== undefined && req.body !== null) return typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body;
  const chunks = []; let size = 0;
  for await (const c of req) { size += c.length; if (size > 50_000) throw new HttpError(413, "Pedido demasiado grande."); chunks.push(c); }
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { throw new HttpError(400, "JSON inválido."); }
}
const caso = (id) => { const c = C.get(id); if (!c) throw new HttpError(404, "Caso desconhecido."); return c; };
const tokenOk = (t) => { if (typeof t !== "string" || !TOKEN_RE.test(t)) throw new HttpError(400, "Identificador de sessão inválido."); return t; };

function trainerAuth(req) {
  const k = String(req.headers["x-trainer-key"] || "");
  const a = Buffer.from(k), b = Buffer.from(TRAINER_KEY());
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new HttpError(401, "Chave do formador incorreta.");
}
async function config(casoId) {
  const r = await db.query("select painel_aberto, anonimo from config where caso=$1", [casoId]);
  return r[0] ? { painel_aberto: r[0].painel_aberto, anonimo: r[0].anonimo } : { painel_aberto: true, anonimo: false };
}
async function minha(casoId, token) {
  const r = await db.query("select * from notas where caso=$1 and token=$2", [casoId, token]);
  return r[0] || null;
}

// Monta os dados do painel. `viewerToken` = aluno; sem token = formador.
async function painel(c, { viewerToken, trainer }) {
  const cfg = await config(c.id);
  const rows = await db.query("select id, token, grupo, nota, chars, criada, atualizada from notas where caso=$1 and revelado=true or (caso=$1 and $2::boolean) order by criada", [c.id, !!trainer]);
  const notas = rows.map((r, i) => {
    const cov = C.cobertura(c, r.nota);
    const mine = !!viewerToken && r.token === viewerToken;
    const esconde = !trainer && cfg.anonimo && !mine;
    return {
      id: r.id, grupo: esconde ? "Nota " + (i + 1) : r.grupo, chars: r.chars, nota: r.nota, quando: r.atualizada,
      cobre: cov.cobre, alertas: cov.alertas, mine, revelado: undefined,
    };
  });
  const n = notas.length;
  const rubrica = C.rubricaPublica(c).map((r) => {
    const count = notas.filter((x) => x.cobre.includes(r.id)).length;
    return { ...r, count, pct: n ? Math.round((count / n) * 100) : 0 };
  });
  const alertas = C.alertasPublicos(c).map((a) => ({ ...a, count: notas.filter((x) => x.alertas.includes(a.id)).length }));
  const chars = notas.map((x) => x.chars).sort((a, b) => a - b);
  const mediana = n ? (n % 2 ? chars[(n - 1) / 2] : Math.round((chars[n / 2 - 1] + chars[n / 2]) / 2)) : 0;
  const media = n ? Math.round(notas.reduce((s, x) => s + x.cobre.length, 0) / n * 10) / 10 : 0;
  return { config: cfg, n, mediana, mediaPontos: media, totalPontos: rubrica.length, rubrica, alertas, notas };
}

const routes = [];
const route = (method, re, fn) => routes.push({ method, re, fn });

route("GET", /^\/api\/saude$/, async () => { await db.query("select 1"); return { ok: true }; });
route("GET", /^\/api\/casos$/, async () => C.list().map(C.resumo));
route("GET", /^\/api\/caso\/([\w-]+)$/, async (req, m) => C.publico(caso(m[1])));

route("POST", /^\/api\/caso\/([\w-]+)\/nota$/, async (req, m) => {
  const c = caso(m[1]); const b = await readJson(req);
  const token = tokenOk(b.token);
  const grupo = String(b.grupo || "").replace(/\s+/g, " ").trim().slice(0, 60);
  if (!grupo) throw new HttpError(400, "Indique o nome do grupo.");
  const nota = C.limpar(b.nota);
  if (nota.length < c.minChars) throw new HttpError(422, `A nota tem ${nota.length} caracteres. O mínimo é ${c.minChars}.`, { chars: nota.length, min: c.minChars });
  if (nota.length > c.maxChars) throw new HttpError(422, `A nota tem ${nota.length} caracteres. O máximo é ${c.maxChars}. Seja mais curto.`, { chars: nota.length, max: c.maxChars });
  if (C.palavras(nota) < 35) throw new HttpError(422, "A nota precisa de frases completas (pelo menos 35 palavras).");
  const ex = await minha(c.id, token);
  if (ex && ex.revelado) throw new HttpError(409, "Esta nota já foi entregue e a análise já foi revelada. Já não pode ser alterada.");
  await db.query(
    `insert into notas (caso, token, grupo, nota, chars) values ($1,$2,$3,$4,$5)
     on conflict (caso, token) do update set grupo=excluded.grupo, nota=excluded.nota, chars=excluded.chars, atualizada=now()`,
    [c.id, token, grupo, nota, nota.length]);
  return { ok: true, chars: nota.length };
});

// Só devolve o trabalho do Claude a quem já entregou uma nota válida.
route("POST", /^\/api\/caso\/([\w-]+)\/revelar$/, async (req, m) => {
  const c = caso(m[1]); const token = tokenOk((await readJson(req)).token);
  const n = await minha(c.id, token);
  if (!n || n.chars < c.minChars) throw new HttpError(403, "Entregue primeiro a sua nota.");
  await db.query("update notas set revelado=true where id=$1", [n.id]);
  const cov = C.cobertura(c, n.nota);
  return { grupo: n.grupo, nota: n.nota, chars: n.chars, reveal: c.reveal, rubrica: C.rubricaPublica(c), alertas: C.alertasPublicos(c), cobre: cov.cobre, alertasMinha: cov.alertas };
});

route("POST", /^\/api\/caso\/([\w-]+)\/painel$/, async (req, m) => {
  const c = caso(m[1]); const token = tokenOk((await readJson(req)).token);
  const n = await minha(c.id, token);
  if (!n || !n.revelado) throw new HttpError(403, "Entregue primeiro a sua nota.");
  const cfg = await config(c.id);
  if (!cfg.painel_aberto) return { fechado: true, config: cfg };
  return painel(c, { viewerToken: token });
});

// ---- Formador ----
route("GET", /^\/api\/formador\/([\w-]+)\/painel$/, async (req, m) => { trainerAuth(req); return painel(caso(m[1]), { trainer: true }); });
route("POST", /^\/api\/formador\/([\w-]+)\/config$/, async (req, m) => {
  trainerAuth(req); const c = caso(m[1]); const b = await readJson(req);
  const cur = await config(c.id);
  const next = { painel_aberto: typeof b.painel_aberto === "boolean" ? b.painel_aberto : cur.painel_aberto, anonimo: typeof b.anonimo === "boolean" ? b.anonimo : cur.anonimo };
  await db.query(`insert into config (caso, painel_aberto, anonimo) values ($1,$2,$3)
    on conflict (caso) do update set painel_aberto=excluded.painel_aberto, anonimo=excluded.anonimo`, [c.id, next.painel_aberto, next.anonimo]);
  return next;
});
route("DELETE", /^\/api\/formador\/([\w-]+)\/notas\/(\d+)$/, async (req, m) => {
  trainerAuth(req); const c = caso(m[1]);
  await db.query("delete from notas where caso=$1 and id=$2", [c.id, Number(m[2])]);
  return { ok: true };
});
route("DELETE", /^\/api\/formador\/([\w-]+)\/notas$/, async (req, m) => {
  trainerAuth(req); const c = caso(m[1]);
  const r = await db.query("delete from notas where caso=$1 returning id", [c.id]);
  return { ok: true, apagadas: r.length };
});
route("GET", /^\/api\/formador\/([\w-]+)\/export$/, async (req, m) => {
  trainerAuth(req); const c = caso(m[1]); const p = await painel(c, { trainer: true });
  const esc = (v) => { v = v == null ? "" : String(v); return /[";\n\r]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
  const head = ["grupo", "caracteres", "pontos_cobertos", ...p.rubrica.map((r) => r.label), "alertas", "nota", "entregue"];
  const lines = [head.map(esc).join(";")];
  p.notas.forEach((x) => lines.push([x.grupo, x.chars, x.cobre.length, ...p.rubrica.map((r) => (x.cobre.includes(r.id) ? "sim" : "não")), x.alertas.join("|"), x.nota, new Date(x.quando).toISOString()].map(esc).join(";")));
  return { __csv: "﻿" + lines.join("\r\n"), nome: `notas-${c.id}.csv` };
});

async function handle(req, res) {
  try {
    const u = new URL(req.url, "http://x");
    let path = u.pathname.replace(/\/+$/, "") || "/";
    if (/^\/api\/index(\.js)?$/.test(path)) path = "/api/" + (u.searchParams.get("p") || "");
    for (const r of routes) {
      const m = r.method === req.method && path.match(r.re);
      if (!m) continue;
      const out = await r.fn(req, m);
      if (out && out.__csv) return send(res, 200, out.__csv, { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="${out.nome}"` });
      return send(res, 200, out);
    }
    throw new HttpError(404, "Não encontrado.");
  } catch (e) {
    if (e instanceof HttpError) return send(res, e.status, { erro: e.message, ...(e.extra || {}) });
    console.error(e);
    return send(res, 500, { erro: "Erro interno. Tente de novo dentro de momentos." });
  }
}
module.exports = { handle };
