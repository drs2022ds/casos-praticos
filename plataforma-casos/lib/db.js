"use strict";
// Postgres em produção (DATABASE_URL); PGlite (Postgres em WASM, ficheiro local) em desenvolvimento.
const SCHEMA = [
  `create table if not exists notas (
     id serial primary key,
     caso text not null,
     token text not null,
     grupo text not null,
     nota text not null,
     chars int not null,
     revelado boolean not null default false,
     criada timestamptz not null default now(),
     atualizada timestamptz not null default now(),
     unique (caso, token)
   )`,
  `create index if not exists notas_caso on notas (caso)`,
  `create table if not exists config (
     caso text primary key,
     painel_aberto boolean not null default true,
     anonimo boolean not null default false
   )`,
];

let ready;
async function open() {
  let q;
  if (process.env.DATABASE_URL) {
    const { Pool } = require("pg");
    const url = process.env.DATABASE_URL;
    const local = /@(localhost|127\.0\.0\.1)/.test(url);
    const pool = new Pool({ connectionString: url, ssl: local ? false : { rejectUnauthorized: false }, max: 3 });
    q = async (text, params) => (await pool.query(text, params)).rows;
  } else {
    const { PGlite } = await import("@electric-sql/pglite");
    const dir = process.env.PGLITE_DIR || ".data/pglite";
    if (dir !== "memory://") require("fs").mkdirSync(require("path").dirname(dir), { recursive: true });
    const db = new PGlite(dir);
    await db.waitReady;
    q = async (text, params) => (await db.query(text, params)).rows;
  }
  for (const s of SCHEMA) await q(s);
  return q;
}
const query = async (text, params) => {
  ready = ready || open();
  return (await ready)(text, params);
};
module.exports = { query };
