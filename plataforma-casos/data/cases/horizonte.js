// Caso Projecto Horizonte. `reveal` e `rubrica` ficam só no servidor.
module.exports = {
  id: "horizonte",
  titulo: "Projecto Horizonte",
  subtitulo: "Alfa Serviços Integrados e o edifício Horizonte · caso fictício",
  destinatario: "Conselho de administração da Alfa",
  papel: "Nota ao conselho de administração",
  minChars: 300,
  maxChars: 1500,
  intro:
    "Analise a força factual e jurídica do relatório e do parecer. O dossier contém toda a informação necessária. Indício não é prova.",
  dossierHtml: require("./horizonte.dossier.js"),
  questao:
    "O que deve o conselho saber antes de decidir, a 18 de março, se aprova a assinatura dos contratos?",
  instrucaoNota:
    "Escreva a nota que entregaria ao conselho: o que está demonstrado, o que o relatório faz parecer seguro sem o demonstrar e o que recomenda. Pode usar a IA para analisar o dossier, mas a nota é sua.",
  placeholder: "A documentação confirma… mas não demonstra…",

  reveal: {
    titulo: "Análise preparada pelo Claude",
    aviso:
      "Análise preliminar feita só com os quatro documentos do dossier. O objectivo é separar o que está demonstrado do que a redacção faz parecer seguro. Não se conclui sobre intenção.",
    sections: [
      {
        titulo: "Em uma frase",
        paragrafos: [
          "O relatório não contém uma falsidade simples: a sua confiança vem da redacção e é maior do que a que os documentos de controlo permitem, e o parecer não valida os pressupostos, aceita-os do relatório.",
        ],
      },
      {
        titulo: "As cinco fragilidades centrais",
        itens: [
          "Conflito de interesses: Miguel Ferraz, presidente da Alfa, detém 35 % da Gamma, que detém 60 % da Beta, a vendedora. O relatório descreve «interesses económicos indirectos» sem os quantificar e sem referir declaração ou abstenção (art. 11.º).",
          "Preço: 6,35 M€ contra uma avaliação independente de 4,8 M€ (ocupação de 68 %). A diferença é justificada por sinergias que, em 12 de fevereiro, ainda não estavam quantificadas, e o plano de integração é preliminar, sem orçamento nem contratos.",
          "Risco bancário: o banco não foi consultado (27 de fevereiro) e as cláusulas 13.ª e 14.ª exigem consentimento escrito prévio. O relatório coloca a conclusão tranquilizadora antes da reserva sobre a interpretação do banco.",
          "Competência: o relatório afirma gestão corrente com base no uso do imóvel. O art. 8.º exige curso ordinário e condições de mercado demonstráveis, e o limite de 20 % dos activos líquidos (8 M€) só deixa o preço de fora por se partir de 40 M€.",
          "Parecer condicional: «não se afigura possível excluir…» e uma cadeia de «desde que» deixam a competência dependente de quatro pressupostos por confirmar.",
        ],
      },
      {
        titulo: "Como a redacção torna o texto opaco",
        itens: [
          "Abstracção e eufemismo: «interesses económicos indirectos» em vez de dizer quem detém quanto de quê.",
          "Dupla negação e condicionais em cadeia no parecer, que dão ar de conclusão favorável sem a afirmar.",
          "Reserva deslocada: a qualificação que altera a conclusão aparece depois da frase tranquilizadora.",
          "Agente oculto: «foi considerada adequada a concentração…». Quem considerou?",
          "Benefício futuro sem prova: o preço acima da avaliação assenta em sinergias não quantificadas.",
        ],
      },
      {
        titulo: "O que o dossier não permite concluir",
        itens: [
          "Que a operação seja ilegal, ou que haja fraude ou intenção de enganar. A mensagem de 7 de março (pedir que seja apresentada como reorganização corrente) é um indício que justifica diligências, não prova de intenção.",
          "Que o preço seja excessivo só por superar uma avaliação. O que falta é demonstrar o valor das sinergias.",
          "Que a competência do conselho esteja confirmada. Depende da qualificação factual da operação.",
        ],
      },
      {
        titulo: "Condições que o conselho deve exigir antes de decidir",
        itens: [
          "Validação económica independente do preço e quantificação das sinergias.",
          "Declaração formal do interesse de Miguel Ferraz e a sua abstenção na deliberação.",
          "Consentimento escrito do Banco Central Atlântico ao financiamento e à garantia.",
          "Demonstração de que a operação está no curso ordinário e em condições de mercado, ou então submissão à assembleia geral.",
          "Não assumir compromisso vinculativo (incluindo o pagamento inicial de 2,54 M€, não reembolsável) enquanto estes pontos estiverem em aberto.",
        ],
      },
    ],
    notaModelo: {
      titulo: "Exemplo de nota ao conselho",
      texto:
        "A documentação confirma o preço proposto (6,35 M€) e a relação económica indirecta do presidente com a vendedora, mas não demonstra que o preço reflita condições de mercado, que as sinergias estejam quantificadas ou que o banco aceite o financiamento e a garantia. O relatório apresenta estes temas como riscos acompanháveis, embora sejam pressupostos da conclusão jurídica. A nota jurídica não confirma a competência do conselho: admite que ela poderá ser sustentada se quatro condições forem verificadas. Recomenda-se não assumir compromissos vinculativos antes de obter validação económica independente, formalizar a declaração e a abstenção do administrador interessado e receber o consentimento escrito do banco.",
      porque: [
        "Começa pelo que está demonstrado e passa logo ao que não está.",
        "Não acusa ninguém: fala de pressupostos não demonstrados, não de engano.",
        "Termina em condições concretas e verificáveis, não em «mais análise».",
        "Mantém a reserva do parecer em vez de a eliminar.",
      ],
    },
  },

  rubrica: [
    { id: "conflito", label: "Conflito de interesses (35 % Gamma / 60 % Beta, art. 11.º)", re: [/conflito|35 ?(%|por cento)|60 ?(%|por cento)|gamma|11\.?\s?o|abstenc|declara[cç]ao de interesse|declarac/] },
    { id: "preco", label: "Preço 6,35 M€ acima da avaliação de 4,8 M€", re: [/avaliacao|4[,.]8|4 ?800|preco|6[,.]35|6 ?350/] },
    { id: "sinergias", label: "Sinergias não quantificadas / benefício futuro", re: [/sinergia/] },
    { id: "banco", label: "Banco não consultado; cláusulas 13.ª e 14.ª", re: [/banco|consentimento|clausula 1[34]|financiador/] },
    { id: "competencia", label: "Competência: gestão corrente / curso ordinário (art. 8.º)", re: [/gestao corrente|curso ordinario|8\.?\s?o|competencia|assembleia/] },
    { id: "parecer", label: "O parecer é condicional e não valida os pressupostos", re: [/condicion|pressuposto|nao confirma|nao valida|condicoes|desde que/] },
    { id: "indicio", label: "Não conclui sobre intenção: indício não é prova", re: [/indicio|nao demonstra|nao esta demonstrad|nao ha prova|nao permite concluir|sem prova|nao se prova/] },
    { id: "diligencia", label: "Recomenda diligências ou condições concretas", re: [/recomenda|sugere|condicionar|exigir|obter|solicitar|validacao (economica )?independente|antes de (assumir|assinar|aprovar)/] },
    { id: "compromisso", label: "Não assumir compromisso vinculativo já", re: [/compromiss|vinculativ|nao (assinar|aprovar)|adiar|suspender a decisao|pagamento inicial/] },
    { id: "obfus", label: "Nomeia a técnica de redacção (dupla negação, abstracção, agente oculto…)", re: [/dupla negacao|abstrac|eufemismo|agente oculto|sujeito omitido|reserva|opac|obfusc|condicionais/] },
  ],
  alertas: [
    { id: "acusacao", label: "Afirma fraude, corrupção ou má-fé sem prova", re: [/fraude|corrup|ma[- ]?fe|dolo|engan(ar|ou|o) (o )?conselho|ilegal|crime/] },
  ],
};
