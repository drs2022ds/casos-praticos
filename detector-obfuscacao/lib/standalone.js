"use strict";
// Servidor autónomo (servidor da firma, Docker ou máquina local): serve public/ e a API.
const http = require("http"), fs = require("fs"), path = require("path");
const { handle } = require("./app");
const { config } = require("./config");
const PUB = path.join(__dirname, "..", "public");
const MIME = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon" };
const HDR = {
  "x-content-type-options": "nosniff", "referrer-policy": "no-referrer", "x-frame-options": "DENY",
  "content-security-policy": "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self' https://cdn.jsdelivr.net; worker-src blob: https://cdn.jsdelivr.net; frame-ancestors 'none'",
};
function serve(req, res) {
  const u = new URL(req.url, "http://x");
  if (u.pathname.startsWith("/api/")) return handle(req, res);
  let p = decodeURIComponent(u.pathname); if (p === "/") p = "/index.html";
  const f = path.normalize(path.join(PUB, p));
  if (!f.startsWith(PUB + path.sep) && f !== PUB) { res.writeHead(403); return res.end(); }
  fs.readFile(f, (e, data) => {
    if (e) { res.writeHead(404, { "content-type": "text/plain" }); return res.end("Não encontrado"); }
    res.writeHead(200, { "content-type": MIME[path.extname(f)] || "application/octet-stream", ...HDR });
    res.end(data);
  });
}
function start(port) {
  const s = http.createServer(serve);
  return new Promise((r) => s.listen(port, () => r(s)));
}
if (require.main === module) {
  const c = config();
  start(process.env.PORT || 3000).then(() => {
    console.log("Detector de Obfuscação a escutar em http://localhost:" + (process.env.PORT || 3000));
    if (!c.apiKey) console.warn("AVISO: ANTHROPIC_API_KEY não definida; a análise por IA fica indisponível.");
    if (c.authMode === "none") console.warn("AVISO: AUTH_MODE=none, sem controlo de acesso. Usar só em desenvolvimento ou demonstração.");
    if (c.authMode === "code" && !c.accessCodes.length && !c.trainerCodes.length) console.warn("AVISO: AUTH_MODE=code sem ACCESS_CODES: ninguém consegue entrar.");
  });
}
module.exports = { start };
