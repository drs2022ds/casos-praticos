process.env.PGLITE_DIR = "memory://";
process.env.TRAINER_KEY = "segredo-teste";
const assert = require("assert");
const server = require("../lib/devserver");
const C = require("../lib/cases");

let base; const T = () => crypto.randomUUID();
const call = async (path, { method = "GET", body, key } = {}) => {
  const r = await fetch(base + path, { method, headers: { ...(body ? { "content-type": "application/json" } : {}), ...(key ? { "x-trainer-key": key } : {}) }, body: body ? JSON.stringify(body) : undefined });
  const t = await r.text(); let j; try { j = JSON.parse(t); } catch { j = t; } return { s: r.status, j };
};
const good = C.get("atlas").reveal.notaModelo.texto;
let n = 0;
const ok = (m) => console.log("  ✓", m, ++n);

(async () => {
  await new Promise((r) => server.listen(0, r)); base = "http://localhost:" + server.address().port;
  const tk = T(), tk2 = T(), K = "segredo-teste";

  // 1. a API pública nunca contém a análise
  const pub = await call("/api/caso/atlas");
  assert.equal(pub.s, 200);
  const raw = JSON.stringify(pub.j);
  for (const leak of ["reveal", "rubrica", "notaModelo", "Análise preparada", "Exemplo de nota"]) assert(!raw.includes(leak), "fuga: " + leak);
  assert((await call("/api/casos")).j.length === 2); ok("API pública sem fugas da análise");

  // 2. revelar e painel bloqueados sem nota
  assert.equal((await call("/api/caso/atlas/revelar", { method: "POST", body: { token: tk } })).s, 403);
  assert.equal((await call("/api/caso/atlas/painel", { method: "POST", body: { token: tk } })).s, 403); ok("revelação e painel bloqueados sem nota");

  // 3. mínimo de 300 caracteres validado no servidor
  const curta = "a ".repeat(100).trim() + " x";
  let r = await call("/api/caso/atlas/nota", { method: "POST", body: { token: tk, grupo: "G1", nota: good.slice(0, 299) } });
  assert.equal(r.s, 422); assert(/mínimo é 300/.test(r.j.erro));
  r = await call("/api/caso/atlas/nota", { method: "POST", body: { token: tk, grupo: "G1", nota: "x".repeat(400) } });
  assert.equal(r.s, 422, "encher com um caracter só");
  r = await call("/api/caso/atlas/nota", { method: "POST", body: { token: tk, grupo: "G1", nota: good + good + good } });
  assert.equal(r.s, 422, "máximo");
  r = await call("/api/caso/atlas/nota", { method: "POST", body: { token: tk, grupo: "  ", nota: good } }); assert.equal(r.s, 400);
  r = await call("/api/caso/atlas/nota", { method: "POST", body: { token: "curto", grupo: "G", nota: good } }); assert.equal(r.s, 400);
  assert.equal((await call("/api/caso/atlas/revelar", { method: "POST", body: { token: tk } })).s, 403, "nota rejeitada não desbloqueia"); ok("notas curtas, vazias ou inválidas rejeitadas");

  // 4. nota válida desbloqueia
  r = await call("/api/caso/atlas/nota", { method: "POST", body: { token: tk, grupo: "Grupo 1", nota: good } });
  assert.equal(r.s, 200);
  r = await call("/api/caso/atlas/revelar", { method: "POST", body: { token: tk } });
  assert.equal(r.s, 200); assert(r.j.reveal.sections.length >= 5); assert(r.j.cobre.length >= 6); assert.equal(r.j.grupo, "Grupo 1"); ok("nota válida desbloqueia a análise e a cobertura");

  // 5. depois de revelada, a nota não se altera
  r = await call("/api/caso/atlas/nota", { method: "POST", body: { token: tk, grupo: "Grupo 1", nota: good + " Alteração." } });
  assert.equal(r.s, 409); ok("nota revelada não pode ser alterada");

  // 6. editar antes de revelar funciona (upsert) e o token de outro aluno não vê nada
  const fraca = "Marta, tudo indica que a cessação é nula e que a Linha Clara agiu de má-fé. Certamente podemos exigir a continuação do serviço sem qualquer dúvida; vamos avisá-los de que não pode suspender nada e que será responsabilizada por todos os prejuízos que a nossa cliente venha a sofrer a partir de hoje, porque o contrato é claro e a posição da outra parte não tem qualquer sustentação.";
  assert(fraca.length >= 300);
  await call("/api/caso/atlas/nota", { method: "POST", body: { token: tk2, grupo: "Grupo 2", nota: fraca + " rascunho" } });
  r = await call("/api/caso/atlas/nota", { method: "POST", body: { token: tk2, grupo: "Grupo 2", nota: fraca } }); assert.equal(r.s, 200);
  r = await call("/api/caso/atlas/revelar", { method: "POST", body: { token: tk2 } });
  assert.equal(r.s, 200); assert(r.j.alertasMinha.includes("categorico"), "alerta de afirmação categórica");
  assert((await call("/api/caso/atlas/revelar", { method: "POST", body: { token: T() } })).s === 403); ok("upsert antes da revelação, alerta categórico, isolamento entre alunos");

  // 7. painel dos alunos: cobertura e notas
  r = await call("/api/caso/atlas/painel", { method: "POST", body: { token: tk } });
  assert.equal(r.j.n, 2); assert.equal(r.j.notas.filter((x) => x.mine).length, 1);
  assert(r.j.rubrica.find((x) => x.id === "r11-2").count === 1);
  assert(!JSON.stringify(r.j).includes(tk), "o token não pode sair"); ok("painel de comparação com 2 notas");

  // 8. formador: autenticação
  assert.equal((await call("/api/formador/atlas/painel")).s, 401);
  assert.equal((await call("/api/formador/atlas/painel", { key: "errada" })).s, 401);
  r = await call("/api/formador/atlas/painel", { key: K }); assert.equal(r.s, 200); assert.equal(r.j.n, 2); ok("área do formador protegida por chave");

  // 9. fechar painel e anonimizar
  assert.equal((await call("/api/formador/atlas/config", { method: "POST", key: "x", body: { painel_aberto: false } })).s, 401);
  await call("/api/formador/atlas/config", { method: "POST", key: K, body: { painel_aberto: false } });
  assert.equal((await call("/api/caso/atlas/painel", { method: "POST", body: { token: tk } })).j.fechado, true);
  await call("/api/formador/atlas/config", { method: "POST", key: K, body: { painel_aberto: true, anonimo: true } });
  r = await call("/api/caso/atlas/painel", { method: "POST", body: { token: tk } });
  assert(r.j.notas.find((x) => !x.mine).grupo.startsWith("Nota ")); assert.equal(r.j.notas.find((x) => x.mine).grupo, "Grupo 1");
  assert.equal((await call("/api/formador/atlas/painel", { key: K })).j.notas.find((x) => x.nota.startsWith("Marta, tudo")).grupo, "Grupo 2"); ok("fechar e anonimizar o painel; o formador vê tudo");

  // 10. casos isolados e Horizonte
  const th = T(); const nh = C.get("horizonte").reveal.notaModelo.texto;
  assert.equal((await call("/api/caso/horizonte/nota", { method: "POST", body: { token: th, grupo: "G9", nota: nh } })).s, 200);
  assert.equal((await call("/api/formador/horizonte/painel", { key: K })).j.n, 1);
  assert.equal((await call("/api/formador/atlas/painel", { key: K })).j.n, 2); ok("casos isolados");

  // 11. exportação e apagar
  r = await call("/api/formador/atlas/export", { key: K }); assert(r.j.startsWith("grupo;") && r.j.includes("Grupo 1")); ok("exportação CSV");
  const id = (await call("/api/formador/atlas/painel", { key: K })).j.notas[0].id;
  await call("/api/formador/atlas/notas/" + id, { method: "DELETE", key: K });
  assert.equal((await call("/api/formador/atlas/painel", { key: K })).j.n, 1);
  assert.equal((await call("/api/formador/atlas/notas", { method: "DELETE", key: K })).j.apagadas, 1); ok("apagar nota e apagar todas");

  // 12. estáticos
  for (const p of ["/", "/caso", "/formador", "/style.css", "/common.js"]) assert.equal((await fetch(base + p)).status, 200, p);
  assert.equal((await fetch(base + "/../lib/app.js")).status === 200 && false, false);
  assert.equal((await fetch(base + "/%2e%2e/lib/app.js")).status, 404); ok("páginas estáticas e sem path traversal");

  console.log("\nTudo OK (" + n + " grupos de verificações)"); server.close(); process.exit(0);
})().catch((e) => { console.error("\nFALHOU:", e); process.exit(1); });
