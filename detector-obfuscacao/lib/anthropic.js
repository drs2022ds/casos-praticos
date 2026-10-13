"use strict";
// Chamada à API de mensagens da Anthropic, em streaming, sem dependências.
// Devolve { text, stop, usage } e chama onProgress(nCaracteres) durante a geração.
async function stream({ cfg, model, prompt, signal, onProgress }) {
  const res = await fetch(cfg.baseUrl + "/v1/messages", {
    method: "POST",
    signal,
    headers: { "content-type": "application/json", "x-api-key": cfg.apiKey, "anthropic-version": cfg.apiVersion },
    body: JSON.stringify({ model, max_tokens: cfg.maxOutputTokens, stream: true, messages: [{ role: "user", content: prompt }] }),
  });
  if (!res.ok) {
    let body = ""; try { body = (await res.text()).slice(0, 300); } catch (e) {}
    const err = new Error("upstream " + res.status + " " + body);
    err.status = res.status;
    throw err;
  }
  const dec = new TextDecoder();
  let buf = "", text = "", stop = null, usage = { in: 0, out: 0 };
  for await (const chunk of res.body) {
    buf += dec.decode(chunk, { stream: true });
    let k;
    while ((k = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, k).trim(); buf = buf.slice(k + 1);
      if (!line.startsWith("data:")) continue;
      let ev; try { ev = JSON.parse(line.slice(5)); } catch (e) { continue; }
      if (ev.type === "message_start" && ev.message && ev.message.usage) usage.in = ev.message.usage.input_tokens || 0;
      else if (ev.type === "content_block_delta" && ev.delta && ev.delta.type === "text_delta") { text += ev.delta.text; onProgress && onProgress(text.length); }
      else if (ev.type === "message_delta") { if (ev.delta && ev.delta.stop_reason) stop = ev.delta.stop_reason; if (ev.usage && ev.usage.output_tokens != null) usage.out = ev.usage.output_tokens; }
      else if (ev.type === "error") { const e = new Error("upstream stream error"); e.status = 502; throw e; }
    }
  }
  return { text, stop, usage };
}

function extractJson(text) {
  let t = String(text || "").trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
  const a = t.indexOf("{"), b = t.lastIndexOf("}");
  if (a < 0 || b <= a) return null;
  try { const o = JSON.parse(t.slice(a, b + 1)); return o && typeof o === "object" && !Array.isArray(o) ? o : null; } catch (e) { return null; }
}
module.exports = { stream, extractJson };
