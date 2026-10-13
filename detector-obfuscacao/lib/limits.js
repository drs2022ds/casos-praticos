"use strict";
// Contadores em memória: servem para um servidor único. Em ambientes sem estado (funções serverless)
// são apenas indicativos; o limite que conta é o limite de gasto definido na consola da Anthropic.
const day = () => new Date().toISOString().slice(0, 10);
let st = { day: day(), users: new Map(), n: 0, tokens: 0, active: 0 };
function roll() { if (st.day !== day()) st = { day: day(), users: new Map(), n: 0, tokens: 0, active: st.active }; }

function reserve(user, c) {
  roll();
  if (st.active >= c.maxConcurrent) return "busy";
  const u = st.users.get(user) || { n: 0 };
  if (c.perUserDaily > 0 && u.n >= c.perUserDaily) return "quota_user";
  if (c.globalDaily > 0 && st.n >= c.globalDaily) return "quota_global";
  if (c.globalDailyTokens > 0 && st.tokens >= c.globalDailyTokens) return "quota_global";
  u.n++; st.users.set(user, u); st.n++; st.active++;
  return null;
}
function release(tokens) { st.active = Math.max(0, st.active - 1); st.tokens += tokens || 0; }
function remaining(user, c) {
  roll();
  const u = st.users.get(user) || { n: 0 };
  return c.perUserDaily > 0 ? Math.max(0, c.perUserDaily - u.n) : null;
}
function reset() { st = { day: day(), users: new Map(), n: 0, tokens: 0, active: 0 }; }
module.exports = { reserve, release, remaining, reset };
