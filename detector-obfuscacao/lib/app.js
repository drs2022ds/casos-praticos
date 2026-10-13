"use strict";
const { config } = require("./config");
const { identify, sha } = require("./auth");
const limits = require("./limits");
const { stream, extractJson } = require("./anthropic");
const { MODES, buildPrompt } = require("./prompt");

const SEC = {
  "x-content-type-options": "nosniff",
  "referrer-policy": "no-referrer",
  "x-frame-options": "DENY",
  "cache-control": "no-store",
};
function json(res, status, obj) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", ...SEC });
  res.end(JSON.stringify(obj));
}
function readBody(req, max) {
  return new Promise((resolve, reject) => {
    if (req.body !== undefined && req.body !== null) { // Vercel já faz o parse
      const s = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
      return Buffer.byteLength(s) > max ? reject(Object.assign(new Error("grande"), { code: "prompt_too_large" })) : resolve(s);
    }
    let n = 0; const parts = [];
    req.on("data", (c) => { n += c.length; if (n > max) { reject(Object.assign(new Error("grande"), { code: "prompt_too_large" })); req.destroy(); } else parts.push(c); });
    req.on("end", () => resolve(Buffer.concat(parts).toString("utf8")));
    req.on("error", reject);
  });
}
function log(c, o) { // só metadados, nunca o texto
  const line = { t: new Date().toISOString(), ...o };
  if (!c.logUsers) delete line.user;
  console.log(JSON.stringify(line));
}

async function analisar(req, res) {
  const c = config();
  if (!c.apiKey) return json(res, 503, { err: "not_configured" });
  const me = identify(req);
  if (!me.ok) return json(res, 401, { err: "unauthorized" });

  let raw;
  try { raw = await readBody(req, c.maxInputBytes * 2 + 20000); }
  catch (e) { return json(res, 413, { err: "prompt_too_large" }); }
  let b; try { b = JSON.parse(raw); } catch (e) { return json(res, 400, { err: "invalid_json" }); }

  const paras = Array.isArray(b.paras) ? b.paras.filter((x) => typeof x === "string" && x.trim()).map((x) => x.trim()) : [];
  const apoio = typeof b.apoio === "string" ? b.apoio.trim() : "";
  const mode = typeof b.mode === "string" && MODES[b.mode] ? b.mode : null;
  if (!mode || !paras.length) return json(res, 400, { err: "too_short" });
  const chars = paras.reduce((n, p) => n + p.length, 0);
  const bytes = Buffer.byteLength(paras.join("\n")) + Buffer.byteLength(apoio);
  if (chars < c.minChars) return json(res, 400, { err: "too_short" });
  if (bytes > c.maxInputBytes) return json(res, 413, { err: "prompt_too_large" });

  const deep = !!b.deep && c.deepEnabled;
  const refusal = limits.reserve(me.user, c);
  if (refusal) return json(res, 429, { err: refusal });

  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(new Error("timeout")), c.timeoutMs);
  let finished = false;
  res.on("close", () => { if (!finished) ctl.abort(); });
  res.writeHead(200, { "content-type": "application/x-ndjson; charset=utf-8", "x-accel-buffering": "no", ...SEC });
  const send = (o) => { try { res.write(JSON.stringify(o) + "\n"); } catch (e) {} };

  let tokens = 0, status = "ok", last = 0;
  try {
    const r = await stream({
      cfg: c, model: deep ? c.modelDeep : c.model, prompt: buildPrompt(mode, paras, apoio), signal: ctl.signal,
      onProgress: (n) => { const now = Date.now(); if (now - last > 400) { last = now; send({ p: n }); } },
    });
    tokens = (r.usage.in || 0) + (r.usage.out || 0);
    if (r.stop === "refusal") { status = "refused"; send({ err: "refused" }); }
    else if (!r.text.trim()) { status = "empty"; send({ err: "empty_completion" }); }
    else {
      const out = r.stop === "max_tokens" ? null : extractJson(r.text);
      if (!out) { status = "invalid_json"; send({ err: "invalid_json" }); }
      else send({ ok: true, out });
    }
  } catch (e) {
    if (ctl.signal.aborted && String(ctl.signal.reason && ctl.signal.reason.message) === "timeout") { status = "timeout"; send({ err: "timeout" }); }
    else if (ctl.signal.aborted) { status = "cancelled"; }
    else if (e && e.status === 429) { status = "rate_limited"; send({ err: "rate_limited" }); }
    else { status = "upstream_" + ((e && e.status) || "erro"); send({ err: "upstream" }); }
  } finally {
    finished = true; clearTimeout(timer); limits.release(tokens);
    log(c, { evento: "analise", user: sha(me.user).slice(0, 10), modo: mode, profunda: deep, bytes, tokens, estado: status });
    try { res.end(); } catch (e) {}
  }
}

async function handle(req, res) {
  const c = config();
  const u = new URL(req.url, "http://x");
  let path = u.pathname.replace(/\/+$/, "") || "/";
  // Na Vercel o rewrite passa o caminho em ?p=
  if (/^\/api\/index(\.js)?$/.test(path)) path = "/api/" + (u.searchParams.get("p") || "");
  path = path.replace(/\/+$/, "");

  if (req.method === "GET" && path === "/api/saude") return json(res, 200, { ok: true });
  if (req.method === "GET" && path === "/api/config") {
    return json(res, 200, {
      autenticacao: c.authMode, limiteBytes: c.maxInputBytes, profunda: c.deepEnabled,
      privacidade: c.privacy, chaveConfigurada: !!c.apiKey,
    });
  }
  if (req.method === "GET" && path === "/api/eu") {
    const me = identify(req);
    if (!me.ok) return json(res, 401, { err: "unauthorized" });
    return json(res, 200, { ok: true, formador: !!me.formador, restantes: limits.remaining(me.user, c) });
  }
  if (req.method === "POST" && path === "/api/analisar") return analisar(req, res);
  return json(res, 404, { err: "nao_encontrado" });
}
module.exports = { handle };
