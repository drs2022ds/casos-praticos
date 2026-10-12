"use strict";
const $ = (s, r = document) => r.querySelector(s);
const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
const store = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch {} } };

async function api(path, { method = "GET", body, key } = {}) {
  const r = await fetch(path, { method, headers: { ...(body ? { "content-type": "application/json" } : {}), ...(key ? { "x-trainer-key": key } : {}) }, body: body ? JSON.stringify(body) : undefined });
  const ct = r.headers.get("content-type") || "";
  const data = ct.includes("json") ? await r.json() : await r.text();
  if (!r.ok) { const e = new Error((data && data.erro) || "Erro"); e.status = r.status; e.data = data; throw e; }
  return data;
}
const hora = (d) => new Date(d).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });

let sortKey = "recentes";
// Painel de comparação. opts: {trainer, mineCov (ids que a minha nota cobre), onDelete(id)}
function renderDash(root, d, opts = {}) {
  root.textContent = "";
  const n = d.n;
  const st = el("div", "stats");
  [[String(n), n === 1 ? "nota entregue" : "notas entregues"], [n ? String(d.mediana) : "—", "mediana de caracteres"], [n ? String(d.mediaPontos).replace(".", ",") + "/" + d.totalPontos : "—", "pontos cobertos, em média"]]
    .forEach(([v, l]) => { const s = el("div", "stat"); s.append(el("div", "v", v), el("div", "l", l)); st.append(s); });
  root.append(st);
  if (!n) { root.append(el("p", "empty", "Ainda não há notas entregues.")); return; }

  const sec = el("div", "sec");
  sec.append(el("h3", null, "O que as notas cobrem"));
  sec.append(el("p", "note", opts.mineCov ? "✓ a sua nota refere o ponto · ✗ não refere. A barra mostra a percentagem de notas da sala que o referem." : "Percentagem de notas que referem cada ponto. Linhas a vermelho: ninguém o referiu."));
  const bars = el("div", "bars");
  d.rubrica.forEach((r) => {
    const b = el("div", "bar" + (r.count === 0 ? " zero" : ""));
    const lab = el("span", "lab");
    if (opts.mineCov) { const y = opts.mineCov.includes(r.id); const mk = el("span", "mk " + (y ? "y" : "n"), y ? "✓" : "✗"); mk.style.color = y ? "var(--ok)" : "var(--accent)"; lab.append(mk); }
    lab.append(el("span", null, r.label));
    const tr = el("div", "track"); const f = el("div", "fill"); f.style.width = r.pct + "%"; tr.append(f);
    b.append(lab, tr, el("span", "c", r.count === 0 ? "ninguém" : r.count + " de " + n));
    bars.append(b);
  });
  sec.append(bars);
  const al = (d.alertas || []).filter((a) => a.count > 0);
  al.forEach((a) => sec.append(el("p", "note", "⚠ " + a.count + (a.count === 1 ? " nota" : " notas") + ": " + a.label.toLowerCase() + ".")));
  root.append(sec);

  const ns = el("div", "sec");
  const tb = el("div", "toolbar"); tb.append(el("h3", null, "As notas da sala"));
  const sel = document.createElement("select"); sel.style.width = "auto";
  [["recentes", "Mais recentes"], ["pontos", "Mais pontos cobertos"], ["curtas", "Mais curtas"]].forEach(([v, t]) => { const o = el("option", null, t); o.value = v; sel.append(o); });
  sel.value = sortKey; tb.append(sel); ns.append(tb);
  const list = el("div", "notes"); ns.append(list);
  const total = d.rubrica.length;
  const ordem = { recentes: (a, b) => new Date(b.quando) - new Date(a.quando), pontos: (a, b) => b.cobre.length - a.cobre.length, curtas: (a, b) => a.chars - b.chars };
  const draw = () => {
    list.textContent = "";
    d.notas.slice().sort(ordem[sel.value]).forEach((x) => {
      const it = el("div", "nt" + (x.mine ? " mine" : ""));
      const h = el("div", "nt-h"); const l = el("div"); l.append(el("h3", null, x.grupo)); h.append(l);
      const meta = el("div", "actions"); meta.style.gap = "8px";
      if (x.mine) meta.append(el("span", "chip mine", "a sua nota"));
      (x.alertas || []).forEach((id) => { const a = (d.alertas || []).find((z) => z.id === id); meta.append(el("span", "chip alert", "⚠ " + (a ? a.label : id))); });
      const dots = el("span", "dots"); dots.title = x.cobre.length + " de " + total + " pontos";
      d.rubrica.forEach((r) => { const i = document.createElement("i"); if (x.cobre.includes(r.id)) i.className = "on"; i.title = r.label; dots.append(i); });
      meta.append(dots, el("span", "chip", x.cobre.length + "/" + total), el("span", "chip", x.chars + " car."), el("span", "chip", hora(x.quando)));
      h.append(meta); it.append(h);
      it.append(el("blockquote", null, x.nota));
      if (opts.onDelete) { const a = el("div", "actions"); const del = el("button", "ghost small", "Apagar"); del.type = "button";
        del.onclick = () => { if (del.dataset.arm !== "1") { del.dataset.arm = "1"; del.textContent = "Confirmar: apagar"; setTimeout(() => { del.dataset.arm = ""; del.textContent = "Apagar"; }, 4000); return; } opts.onDelete(x.id); };
        a.append(del); it.append(a); }
      list.append(it);
    });
  };
  sel.onchange = () => { sortKey = sel.value; draw(); }; draw();
  root.append(ns);
}
