"use strict";
// API simulada para o teste de interface: devolve achados com trechos literais do texto Horizonte.
const http = require("http");
const PHR = [
  ["interesses económicos indirectos em entidades participantes", "abstraccao", "alta"],
  ["ainda que superior ao referencial constante da avaliação", "reserva_deslocada", "alta"],
  ["não suscetível de restituição", "abstraccao", "media"],
  ["gestão ordinária dos recursos", "pressuposto_implicito", "alta"],
  ["Não se afigura possível excluir", "dupla_negacao", "media"],
  ["não foi identificada vantagem pessoal directamente atribuída", "agente_oculto", "baixa"],
];
const SSE = (o) => "data: " + JSON.stringify(o) + "\n\n";
http.createServer((req, res) => {
  let b = ""; req.on("data", (c) => (b += c)); req.on("end", async () => {
    const prompt = JSON.parse(b).messages[0].content;
    const paras = [...prompt.matchAll(/^\[P(\d+)\] (.*)$/gm)].map((m) => [Number(m[1]), m[2]]);
    const achados = PHR.map(([t, tec, sev], i) => { const p = paras.find(([, x]) => x.toLowerCase().includes(t.toLowerCase())); const par = p ? p[0] : 1; const real = p ? p[1].slice(p[1].toLowerCase().indexOf(t.toLowerCase())).slice(0, t.length) : t; return { id: "A" + (i + 1), par, trecho: real, tecnica: tec, tipo: "pressuposto", gravidade: sev, porque: "Motivo " + (i + 1), em_linguagem_directa: "Direto " + (i + 1), evidencia_necessaria: "Evidência " + (i + 1), acao_sugerida: "Acção " + (i + 1) }; });
    const out = { resumo: { leitor_apressado: "A operação parece segura.", texto_permite: "Pouco está demonstrado." }, conclusoes: [{ id: "C1", par: achados[3].par, trecho: achados[3].trecho, afirmada: 5, sustentada: 2, premissas_em_falta: ["Demonstração da gestão corrente"] }], achados, diligencias: ["Pedir a avaliação actualizada", "Confirmar consentimento do banco"] };
    res.writeHead(200, { "content-type": "text/event-stream" });
    const t = JSON.stringify(out);
    res.write(SSE({ type: "message_start", message: { usage: { input_tokens: 2000 } } }));
    res.write(SSE({ type: "content_block_delta", delta: { type: "text_delta", text: t.slice(0, 300) } }));
    await new Promise((r) => setTimeout(r, 600));
    res.write(SSE({ type: "content_block_delta", delta: { type: "text_delta", text: t.slice(300) } }));
    res.write(SSE({ type: "message_delta", delta: { stop_reason: "end_turn" }, usage: { output_tokens: 900 } }));
    res.end();
  });
}).listen(process.env.MOCK_PORT || 4010, () => console.log("mock em " + (process.env.MOCK_PORT || 4010)));
