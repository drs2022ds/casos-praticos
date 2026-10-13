"use strict";
const crypto = require("crypto");
const { config } = require("./config");

const sha = (s) => crypto.createHash("sha256").update(String(s)).digest("hex");
function safeEq(a, b) {
  const x = Buffer.from(sha(a)), y = Buffer.from(sha(b));
  return crypto.timingSafeEqual(x, y);
}
const anyEq = (v, arr) => arr.reduce((hit, c) => safeEq(v, c) || hit, false);

// Devolve { ok, user, formador } ou { ok:false }.
//  none  : sem controlo (só para desenvolvimento e demonstração); o utilizador é o IP.
//  code  : cabeçalho x-access-code com um dos ACCESS_CODES / TRAINER_CODES.
//          A quota é por código: dê um código a cada pessoa se quiser quotas individuais.
//  proxy : o servidor está atrás do SSO da firma, que envia o e-mail num cabeçalho (PROXY_USER_HEADER).
//          SÓ usar quando a aplicação for inacessível sem passar pelo proxy; caso contrário o cabeçalho pode ser forjado.
function identify(req) {
  const c = config();
  const h = req.headers || {};
  if (c.authMode === "code") {
    const code = String(h["x-access-code"] || "");
    if (!code) return { ok: false };
    if (c.trainerCodes.length && anyEq(code, c.trainerCodes)) return { ok: true, user: "code:" + sha(code).slice(0, 8), formador: true };
    if (c.accessCodes.length && anyEq(code, c.accessCodes)) return { ok: true, user: "code:" + sha(code).slice(0, 8), formador: false };
    return { ok: false };
  }
  if (c.authMode === "proxy") {
    const u = String(h[c.proxyUserHeader] || "").trim().toLowerCase();
    if (!u) return { ok: false };
    if (c.allowedDomains.length) {
      const dom = u.split("@")[1] || "";
      if (!c.allowedDomains.includes(dom)) return { ok: false };
    }
    return { ok: true, user: u, formador: c.trainerUsers.includes(u) };
  }
  // none
  const ip = String(h["x-forwarded-for"] || (req.socket && req.socket.remoteAddress) || "local").split(",")[0].trim();
  return { ok: true, user: "ip:" + ip, formador: c.trainerCodes.length > 0 ? anyEq(String(h["x-access-code"] || ""), c.trainerCodes) : false };
}
module.exports = { identify, sha };
