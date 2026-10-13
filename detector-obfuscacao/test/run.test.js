"use strict";
const http = require("http"), fs = require("fs"), path = require("path"), vm = require("vm");
const assert = require("assert");
const root = path.join(__dirname, "..");
const limits = require(path.join(root, "lib/limits"));
const { start } = require(path.join(root, "lib/standalone"));
const { buildPrompt } = require(path.join(root, "lib/prompt"));

let passed = 0;
const ok = (name) => { passed++; console.log("  ok  " + name); };

// ---------- API simulada da Anthropic (SSE) ----------
const mock = { mode: "ok", calls: [], aborted: 0, delay: 0 };
const SSE = (o) => "event: x\ndata: " + JSON.stringify(o) + "\n\n";
const goodOut = { resumo: { leitor_apressado: "Tudo bem.", texto_permite: "Pouco." }, conclusoes: [{ id: "C1", par: 1, trecho: "Par um", afirmada: 5, sustentada: 2, premissas_em_falta: ["x"] }], achados: [{ id: "A1", par: 1, trecho: "Par um", tecnica: "dupla_negacao", tipo: "pressuposto", gravidade: "alta", porque: "p", em_linguagem_directa: "d", evidencia_necessaria: "e", acao_sugerida: "a" }], diligencias: ["d1"] };
const mockSrv = http.createServer((req, res) => {
  let body = ""; req.on("data", (c) => (body += c)); req.on("end", async () => {
    const b = JSON.parse(body || "{}");
    mock.calls.push({ headers: req.headers, body: b });
    if (mock.mode === "500") { res.writeHead(500); return res.end("erro interno"); }
    if (mock.mode === "429") { res.writeHead(429); return res.end("limite"); }
    res.writeHead(200, { "content-type": "text/event-stream" });
    req.on("close", () => { if (!res.writableEnded) mock.aborted++; });
    res.write(SSE({ type: "message_start", message: { usage: { input_tokens: 1000 } } }));
    if (mock.delay) await new Promise((r) => setTimeout(r, mock.delay));
    let text = JSON.stringify(goodOut), stop = "end_turn";
    if (mock.mode === "bad") text = "isto não é json";
    if (mock.mode === "fence") text = "```json\n" + JSON.stringify(goodOut) + "\n```";
    if (mock.mode === "empty") text = "";
    if (mock.mode === "maxtok") stop = "max_tokens";
    if (mock.mode === "refusal") { text = ""; stop = "refusal"; }
    const mid = Math.floor(text.length / 2);
    if (text) { res.write(SSE({ type: "content_block_delta", delta: { type: "text_delta", text: text.slice(0, mid) } })); await new Promise((r) => setTimeout(r, 450)); res.write(SSE({ type: "content_block_delta", delta: { type: "text_delta", text: text.slice(mid) } })); }
    res.write(SSE({ type: "message_delta", delta: { stop_reason: stop }, usage: { output_tokens: 500 } }));
    res.end(SSE({ type: "message_stop" }));
  });
});

const long = "O relatório conclui, sem prejuízo de reservas deslocadas e de pressupostos por demonstrar, que a operação é compatível com o interesse social, não se afigurando possível excluir que venha a ser reconduzida à gestão corrente da sociedade, nos termos expostos.";
const payload = (o = {}) => ({ mode: "documento", paras: ["Par um", long], apoio: "", deep: false, ...o });
let base;
async function post(p, headers = {}, url = "/api/analisar") {
  const r = await fetch(base + url, { method: "POST", headers: { "content-type": "application/json", ...headers }, body: JSON.stringify(p) });
  const text = await r.text();
  const lines = text.split("\n").filter(Boolean).map((l) => { try { return JSON.parse(l); } catch (e) { return l; } });
  return { status: r.status, lines, json: lines[0] };
}
const get = async (u, headers = {}) => { const r = await fetch(base + u, { headers }); let j = null; try { j = await r.clone().json(); } catch (e) {} return { status: r.status, j, r }; };
const reset = () => { limits.reset(); mock.calls.length = 0; mock.aborted = 0; mock.mode = "ok"; mock.delay = 0; };
const set = (o) => { for (const k of Object.keys(o)) { if (o[k] === null) delete process.env[k]; else process.env[k] = o[k]; } };
const CLEAN = ["AUTH_MODE", "ACCESS_CODES", "TRAINER_CODES", "PROXY_USER_HEADER", "ALLOWED_EMAIL_DOMAINS", "TRAINER_USERS", "PER_USER_DAILY", "GLOBAL_DAILY", "GLOBAL_DAILY_TOKENS", "MAX_CONCURRENT", "MAX_INPUT_BYTES", "MIN_CHARS", "REQUEST_TIMEOUT_MS", "DEEP_ENABLED", "MAX_OUTPUT_TOKENS", "DETECTOR_MODEL", "DETECTOR_MODEL_DEEP"];
const clean = () => set(Object.fromEntries(CLEAN.map((k) => [k, null])));

(async () => {
  await new Promise((r) => mockSrv.listen(0, r));
  const srv = await start(0); base = "http://localhost:" + srv.address().port;
  set({ ANTHROPIC_API_KEY: "chave-secreta-de-teste", ANTHROPIC_BASE_URL: "http://localhost:" + mockSrv.address().port });
  clean();

  console.log("1. Estado e configuração pública");
  let r = await get("/api/saude"); assert.strictEqual(r.status, 200); ok("saúde");
  r = await get("/api/config");
  assert.strictEqual(r.j.chaveConfigurada, true); assert.ok(!JSON.stringify(r.j).includes("chave-secreta"));
  assert.strictEqual(r.j.limiteBytes, 50000); ok("config não expõe a chave");
  set({ ANTHROPIC_API_KEY: "" }); r = await post(payload()); assert.strictEqual(r.status, 503); assert.strictEqual(r.json.err, "not_configured");
  set({ ANTHROPIC_API_KEY: "chave-secreta-de-teste" }); ok("sem chave devolve not_configured");

  console.log("2. Prompt igual ao do artefacto original");
  const orig = fs.readFileSync(path.join(__dirname, "fixtures/artefacto-original.html"), "utf8");
  const A = orig.indexOf("const TEC={"), Z = orig.indexOf("/* ---------- análise local");
  const i = orig.indexOf("function buildPrompt(){"), j = orig.indexOf("const ERR={");
  const hz = fs.readFileSync(path.join(root, "public/index.html"), "utf8");
  const sm = JSON.parse(orig.split("\n")[245].replace(/^const SAMPLES=/, "").replace(/;\s*$/, ""));
  for (const [k, s] of Object.entries(sm)) {
    const paras = s.main.split(/\r?\n+/).map((x) => x.trim()).filter(Boolean);
    for (const mode of ["contraparte", "minha", "documento"]) {
      const ctx = { state: { mode, paras: paras.map((t) => ({ t })) }, $: () => ({ value: s.apoio || "" }) };
      vm.createContext(ctx);
      vm.runInContext(orig.slice(A, Z) + orig.slice(i, j) + "; out = buildPrompt();", ctx);
      assert.strictEqual(buildPrompt(mode, paras, (s.apoio || "").trim()), ctx.out, k + "/" + mode);
    }
  }
  ok("prompt do servidor idêntico ao original (4 exemplos × 3 modos)");

  console.log("3. Análise: protocolo, cabeçalhos e modelos");
  reset(); r = await post(payload());
  assert.strictEqual(r.status, 200);
  assert.ok(r.lines.some((l) => l.p > 0), "progresso"); const fin = r.lines.find((l) => l.ok);
  assert.deepStrictEqual(fin.out, goodOut); ok("progresso e resultado");
  const c0 = mock.calls[0];
  assert.strictEqual(c0.headers["x-api-key"], "chave-secreta-de-teste"); assert.strictEqual(c0.headers["anthropic-version"], "2023-06-01");
  assert.strictEqual(c0.body.model, "claude-sonnet-5-5"); assert.strictEqual(c0.body.max_tokens, 8000); assert.strictEqual(c0.body.stream, true);
  assert.ok(c0.body.messages[0].content.includes("[P2] " + long.slice(0, 40))); ok("pedido à API: chave, versão, modelo, prompt");
  reset(); await post(payload({ deep: true })); assert.strictEqual(mock.calls[0].body.model, "claude-opus-5-5"); ok("análise profunda usa o modelo profundo");
  reset(); set({ DEEP_ENABLED: "0" }); await post(payload({ deep: true })); assert.strictEqual(mock.calls[0].body.model, "claude-sonnet-5-5"); clean(); ok("DEEP_ENABLED=0 ignora o pedido de análise profunda");
  reset(); set({ DETECTOR_MODEL: "modelo-x", MAX_OUTPUT_TOKENS: "1234" }); await post(payload()); assert.strictEqual(mock.calls[0].body.model, "modelo-x"); assert.strictEqual(mock.calls[0].body.max_tokens, 1234); clean(); ok("modelo e tokens configuráveis");
  reset(); mock.mode = "fence"; r = await post(payload()); assert.ok(r.lines.find((l) => l.ok)); ok("JSON dentro de ```json é aceite");

  console.log("4. Erros da API e respostas inválidas");
  for (const [m, err] of [["bad", "invalid_json"], ["maxtok", "invalid_json"], ["empty", "empty_completion"], ["refusal", "refused"], ["500", "upstream"], ["429", "rate_limited"]]) {
    reset(); mock.mode = m; r = await post(payload()); assert.ok(r.lines.some((l) => l.err === err), m + " → " + JSON.stringify(r.lines)); ok(m + " → " + err);
  }
  reset(); mock.delay = 800; set({ REQUEST_TIMEOUT_MS: "300" }); r = await post(payload()); assert.ok(r.lines.some((l) => l.err === "timeout")); clean(); ok("timeout");
  await new Promise((r) => setTimeout(r, 900));

  console.log("5. Validação do pedido");
  reset();
  r = await post(payload({ mode: "nada" })); assert.strictEqual(r.json.err, "too_short"); ok("modo inválido rejeitado");
  r = await post(payload({ paras: ["curto"] })); assert.strictEqual(r.status, 400); assert.strictEqual(r.json.err, "too_short"); ok("texto curto");
  r = await post(payload({ paras: ["x".repeat(60000)] })); assert.strictEqual(r.json.err, "prompt_too_large"); ok("texto acima do limite");
  set({ MAX_INPUT_BYTES: "300" }); r = await post(payload({ paras: [long, long] })); assert.strictEqual(r.json.err, "prompt_too_large"); clean(); ok("limite de tamanho configurável");
  r = await post("isto não é json" && { mode: 1, paras: "x" }); assert.strictEqual(r.status, 400); ok("corpo inválido");
  assert.strictEqual(mock.calls.length, 0); ok("nenhum pedido inválido chegou à API");

  console.log("6. Acesso: código");
  reset(); set({ AUTH_MODE: "code", ACCESS_CODES: "alfa,beta", TRAINER_CODES: "mestre" });
  r = await post(payload()); assert.strictEqual(r.status, 401); ok("sem código: 401");
  r = await post(payload(), { "x-access-code": "errado" }); assert.strictEqual(r.status, 401); ok("código errado: 401");
  r = await post(payload(), { "x-access-code": "alfa" }); assert.ok(r.lines.find((l) => l.ok)); ok("código válido");
  r = await get("/api/eu", { "x-access-code": "alfa" }); assert.strictEqual(r.j.formador, false); r = await get("/api/eu", { "x-access-code": "mestre" }); assert.strictEqual(r.j.formador, true); ok("código de formador");
  r = await get("/api/eu"); assert.strictEqual(r.status, 401); ok("/api/eu sem código: 401");
  assert.strictEqual(mock.calls.length, 1); ok("pedidos recusados não chegaram à API");

  console.log("7. Acesso: proxy do SSO");
  reset(); set({ AUTH_MODE: "proxy", ALLOWED_EMAIL_DOMAINS: "firma.pt", TRAINER_USERS: "ana@firma.pt", ACCESS_CODES: null, TRAINER_CODES: null });
  r = await post(payload()); assert.strictEqual(r.status, 401); ok("sem cabeçalho: 401");
  r = await post(payload(), { "x-forwarded-email": "x@outra.com" }); assert.strictEqual(r.status, 401); ok("domínio não autorizado: 401");
  r = await post(payload(), { "x-forwarded-email": "Joao@Firma.pt" }); assert.ok(r.lines.find((l) => l.ok)); ok("domínio autorizado");
  r = await get("/api/eu", { "x-forwarded-email": "ana@firma.pt" }); assert.strictEqual(r.j.formador, true); ok("formador por e-mail");
  set({ PROXY_USER_HEADER: "x-ms-client-principal-name" }); r = await post(payload(), { "x-ms-client-principal-name": "b@firma.pt" }); assert.ok(r.lines.find((l) => l.ok)); ok("cabeçalho configurável");

  console.log("8. Limites de utilização");
  reset(); clean(); set({ AUTH_MODE: "code", ACCESS_CODES: "u1,u2", PER_USER_DAILY: "2" });
  for (let n = 0; n < 2; n++) { r = await post(payload(), { "x-access-code": "u1" }); assert.ok(r.lines.find((l) => l.ok)); }
  r = await post(payload(), { "x-access-code": "u1" }); assert.strictEqual(r.status, 429); assert.strictEqual(r.json.err, "quota_user"); ok("limite por utilizador");
  r = await post(payload(), { "x-access-code": "u2" }); assert.ok(r.lines.find((l) => l.ok)); ok("outro utilizador não é afectado");
  r = await get("/api/eu", { "x-access-code": "u1" }); assert.strictEqual(r.j.restantes, 0); ok("restantes visível");
  reset(); set({ PER_USER_DAILY: "0", GLOBAL_DAILY: "2" });
  await post(payload(), { "x-access-code": "u1" }); await post(payload(), { "x-access-code": "u2" });
  r = await post(payload(), { "x-access-code": "u1" }); assert.strictEqual(r.json.err, "quota_global"); ok("limite global diário");
  reset(); set({ GLOBAL_DAILY: "0", GLOBAL_DAILY_TOKENS: "1400" });
  r = await post(payload(), { "x-access-code": "u1" }); assert.ok(r.lines.find((l) => l.ok));
  r = await post(payload(), { "x-access-code": "u1" }); assert.strictEqual(r.json.err, "quota_global"); ok("limite global de tokens (1500 consumidos > 1400)");
  reset(); set({ GLOBAL_DAILY_TOKENS: "0", PER_USER_DAILY: "0", MAX_CONCURRENT: "1" }); mock.delay = 700;
  const [a, b] = await Promise.all([post(payload(), { "x-access-code": "u1" }), (async () => { await new Promise((r) => setTimeout(r, 150)); return post(payload(), { "x-access-code": "u2" }); })()]);
  assert.ok(a.lines.find((l) => l.ok)); assert.strictEqual(b.status, 429); assert.strictEqual(b.json.err, "busy"); ok("limite de pedidos simultâneos");
  r = await post(payload(), { "x-access-code": "u2" }); assert.ok(r.lines.find((l) => l.ok)); ok("vaga libertada depois de terminar");
  reset(); mock.mode = "500"; set({ MAX_CONCURRENT: "1", PER_USER_DAILY: "0" }); await post(payload(), { "x-access-code": "u1" }); await post(payload(), { "x-access-code": "u1" }); mock.mode = "ok"; r = await post(payload(), { "x-access-code": "u1" }); assert.ok(r.lines.find((l) => l.ok), JSON.stringify(r.lines)); ok("falha da API não deixa a vaga presa");
  { const logs = []; const orig = console.log; console.log = (...a) => logs.push(a.join(" ")); reset(); await post(payload({ paras: ["TEXTO-CONFIDENCIAL-XYZ " + long] }), { "x-access-code": "u1" }); console.log = orig;
    const l = logs.filter((x) => x.includes("analise")); assert.ok(l.length === 1); assert.ok(!l.join("").includes("TEXTO-CONFIDENCIAL") && !l.join("").includes("u1")); assert.ok(/"tokens":1500/.test(l[0])); ok("registo só tem metadados (sem texto nem código)"); }

  console.log("9. Cancelamento pelo cliente");
  reset(); clean(); set({ AUTH_MODE: "none" }); mock.delay = 1500;
  const ctl = new AbortController(); const p = fetch(base + "/api/analisar", { method: "POST", signal: ctl.signal, headers: { "content-type": "application/json" }, body: JSON.stringify(payload()) }).catch(() => {});
  await new Promise((r) => setTimeout(r, 400)); ctl.abort(); await p; await new Promise((r) => setTimeout(r, 600));
  assert.ok(mock.aborted >= 1, "upstream abortado"); ok("cancelar no browser aborta o pedido à API");
  r = await get("/api/saude"); assert.strictEqual(r.status, 200); ok("servidor continua saudável");

  console.log("10. Estáticos e segurança");
  r = await get("/"); assert.strictEqual(r.status, 200); const html = await r.r.text(); assert.ok(html.includes("Detector de Obfuscação")); assert.ok(r.r.headers.get("content-security-policy")); ok("página servida com CSP");
  assert.ok(!html.includes("window.claude")); ok("a página já não depende do runtime do artefacto");
  r = await get("/..%2f..%2fetc%2fpasswd"); assert.ok([403, 404].includes(r.status)); ok("path traversal recusado");
  r = await get("/lib/app.js"); assert.strictEqual(r.status, 404); ok("código do servidor não é servido");
  r = await get("/api/desconhecido"); assert.strictEqual(r.status, 404); ok("rota desconhecida");

  console.log("\n" + passed + " verificações passaram.");
  srv.close(); mockSrv.close(); process.exit(0);
})().catch((e) => { console.error("\nFALHOU:", e); process.exit(1); });
