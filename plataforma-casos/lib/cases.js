"use strict";
const CASES = { atlas: require("../data/cases/atlas"), horizonte: require("../data/cases/horizonte") };
const ORDER = ["atlas", "horizonte"];

const norm = (s) =>
  String(s || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

const list = () => ORDER.map((id) => CASES[id]);
const get = (id) => (Object.prototype.hasOwnProperty.call(CASES, id) ? CASES[id] : null);

// Só o que o aluno pode ver antes de entregar a nota.
function publico(c) {
  return {
    id: c.id, titulo: c.titulo, subtitulo: c.subtitulo, destinatario: c.destinatario, papel: c.papel,
    minChars: c.minChars, maxChars: c.maxChars, intro: c.intro, dossierHtml: c.dossierHtml,
    questao: c.questao, instrucaoNota: c.instrucaoNota, placeholder: c.placeholder,
  };
}
function resumo(c) {
  return { id: c.id, titulo: c.titulo, subtitulo: c.subtitulo, papel: c.papel, minChars: c.minChars };
}

// Cada ponto exige que TODAS as expressões do array casem (E lógico).
function cobertura(c, texto) {
  const t = norm(texto);
  const ok = (r) => r.re.every((re) => re.test(t));
  return {
    cobre: c.rubrica.filter(ok).map((r) => r.id),
    alertas: (c.alertas || []).filter(ok).map((r) => r.id),
  };
}
const rubricaPublica = (c) => c.rubrica.map(({ id, label }) => ({ id, label }));
const alertasPublicos = (c) => (c.alertas || []).map(({ id, label }) => ({ id, label }));

// Normaliza espaços para contar caracteres da mesma forma no cliente e no servidor.
const limpar = (s) => String(s || "").replace(/\r\n?/g, "\n").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
const palavras = (s) => (s.match(/\S+/g) || []).length;

module.exports = { list, get, publico, resumo, cobertura, rubricaPublica, alertasPublicos, limpar, palavras, norm };
