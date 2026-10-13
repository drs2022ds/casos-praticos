"use strict";
// Toda a configuração vem de variáveis de ambiente (ver .env.example). Lida a cada pedido,
// para que os testes possam alterá-la. Nada aqui é secreto, excepto apiKey, que nunca sai do servidor.
const env = process.env;
const int = (k, d) => { const v = parseInt(env[k], 10); return Number.isFinite(v) ? v : d; };
const list = (v) => String(v || "").split(",").map((s) => s.trim()).filter(Boolean);

const PRIVACIDADE_DEFAULT =
  "O texto é enviado ao servidor da firma e daí ao Claude, através da API, para ser analisado. " +
  "Não é guardado. Só se registam metadados (hora, tamanho, utilizador e consumo), nunca o conteúdo.";

function config() {
  return {
    apiKey: env.ANTHROPIC_API_KEY || "",
    baseUrl: (env.ANTHROPIC_BASE_URL || "https://api.anthropic.com").replace(/\/+$/, ""),
    apiVersion: env.ANTHROPIC_VERSION || "2023-06-01",
    model: env.DETECTOR_MODEL || "claude-sonnet-5-5",
    modelDeep: env.DETECTOR_MODEL_DEEP || "claude-opus-5-5",
    deepEnabled: env.DEEP_ENABLED !== "0",
    // limites (a decidir pela firma)
    maxInputBytes: int("MAX_INPUT_BYTES", 50000),
    minChars: int("MIN_CHARS", 120),
    maxOutputTokens: int("MAX_OUTPUT_TOKENS", 8000),
    perUserDaily: int("PER_USER_DAILY", 20),
    globalDaily: int("GLOBAL_DAILY", 300),
    globalDailyTokens: int("GLOBAL_DAILY_TOKENS", 0), // 0 = sem limite
    maxConcurrent: int("MAX_CONCURRENT", 3),
    timeoutMs: int("REQUEST_TIMEOUT_MS", 170000),
    // acesso (a decidir pela firma): none | code | proxy
    authMode: env.AUTH_MODE || "none",
    accessCodes: list(env.ACCESS_CODES),
    trainerCodes: list(env.TRAINER_CODES),
    proxyUserHeader: (env.PROXY_USER_HEADER || "x-forwarded-email").toLowerCase(),
    allowedDomains: list(env.ALLOWED_EMAIL_DOMAINS).map((d) => d.toLowerCase().replace(/^@/, "")),
    trainerUsers: list(env.TRAINER_USERS).map((s) => s.toLowerCase()),
    privacy: env.PRIVACY_NOTICE || PRIVACIDADE_DEFAULT,
    logUsers: env.LOG_USERS !== "0",
  };
}
module.exports = { config };
