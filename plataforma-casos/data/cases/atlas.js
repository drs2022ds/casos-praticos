// Caso Atlas Norte. Tudo o que está em `reveal` e `rubrica` fica só no servidor
// e só é enviado depois de o aluno entregar a nota.
module.exports = {
  id: "atlas",
  titulo: "O e-mail urgente do cliente",
  subtitulo: "Atlas Norte, Lda. contra Linha Clara, S.A. · caso fictício",
  destinatario: "Direção Geral da Atlas Norte",
  papel: "Nota à cliente",
  minChars: 300,
  maxChars: 1500,
  intro:
    "Recebeu um pedido urgente de um cliente. Analise apenas os documentos deste dossier. Não assuma factos, normas ou comunicações que não constem das fontes.",
  dossierHtml: require("./atlas.dossier.js"),
  questao:
    "Que resposta deve a equipa jurídica dar ao cliente antes das 15:00, com base apenas nos documentos disponíveis?",
  instrucaoNota:
    "Escreva a nota que enviaria hoje à Marta Vale: conclusão preliminar, principal incerteza e diligência urgente. Pode usar a IA para analisar o dossier, mas a nota é sua.",
  placeholder: "Cara Marta, com base nos documentos…",

  reveal: {
    titulo: "Análise preparada pelo Claude",
    aviso:
      "Esta é uma análise preliminar feita só com os documentos do dossier. Compare-a com a sua nota e com as da sala. Não substitui a revisão de um advogado.",
    sections: [
      {
        titulo: "Em uma frase",
        paragrafos: [
          "Com o que está no dossier, a cessação imediata e a suspensão às 18:00 parecem difíceis de sustentar à luz do contrato, mas a Atlas Norte tem pontos frágeis que convém tratar hoje, antes de qualquer resposta firme.",
        ],
      },
      {
        titulo: "Factos, alegações e inferências",
        itens: [
          "Facto documentado: a LC 7841 (14 760 €) foi emitida em 1 de julho, com vencimento em 31 de julho. A transferência foi ordenada e executada em 15 de setembro (comprovativo bancário).",
          "Facto documentado: a LC 7996 (14 760 €) foi emitida em 31 de agosto e vence em 30 de setembro (cláusula 4.2, 30 dias). Em 18 de setembro ainda não estava vencida.",
          "Facto documentado: a comunicação de 18 de setembro, às 10:17, declara a cessação imediata e a suspensão às 18:00, invocando as cláusulas 7.4 e 11.3.",
          "Alegação: a Linha Clara diz que o atraso ultrapassa 45 dias e que há incumprimento material reiterado. Só é verdade para a LC 7841 (49 dias até 18 de setembro, 46 até ao pagamento).",
          "Alegação: a Atlas Norte diz que o serviço falhou várias vezes. O dossier só refere indisponibilidade em 28 e 29 de agosto, sem duração medida.",
          "Inferência a confirmar: que a Linha Clara recebeu o pagamento de 15 de setembro. O extrato de 16 de setembro ainda mostra as duas faturas pendentes.",
        ],
      },
      {
        titulo: "Porque a posição da Atlas Norte é forte",
        itens: [
          "Resolução (cl. 11.2): exige notificação escrita que identifique o incumprimento e declare a intenção de resolver, seguida de 10 dias úteis para sanar. A comunicação de 18 de setembro faz cessar o contrato de imediato.",
          "A cláusula 11.3 (efeitos imediatos) só prevê insolvência, violação intencional de confidencialidade e utilização ilícita da plataforma. Nenhuma é alegada.",
          "Suspensão (cl. 7.4): só quanto a montante não contestado, depois de cinco dias úteis desde o aviso escrito, limitada ao necessário e com indicação prévia de data e hora. O aviso de 10 de setembro não indicou dia nem hora.",
          "Quando chegou o aviso de 18 de setembro, a LC 7841 estava paga (se a Linha Clara a recebeu) e a LC 7996 não estava vencida e estava contestada.",
          "Dados (cl. 13.2): após cessação, o prestador mantém os dados disponíveis para exportação durante 15 dias. Condicionar a exportação à liquidação integral não tem apoio nesta cláusula.",
        ],
      },
      {
        titulo: "Porque a posição da Linha Clara não é desprezável",
        itens: [
          "A LC 7841 esteve vencida cerca de 46 dias e houve lembretes em 4 e 12 de agosto. É o seu melhor argumento: atraso real e insistência prévia.",
          "A contestação de 3 de setembro é frágil: diz que a fatura «fica suspensa», não quantifica a parte contestada nem indica fundamentos (cl. 7.2) e a 7.2 exige pagar a parte não contestada.",
          "O crédito de serviço (cl. 5.4) tinha de ser pedido até 15 dias após o fim de agosto, isto é, até 15 de setembro. Não consta do dossier nenhum pedido.",
          "A cláusula 5.4 trata o crédito como o mecanismo previsto para falhas de disponibilidade. Pode limitar a força do argumento «as falhas justificam reter a fatura».",
        ],
      },
      {
        titulo: "O que não sabemos",
        itens: [
          "Se e quando a Linha Clara recebeu a transferência de 15 de setembro.",
          "A duração das falhas de 28 e 29 de agosto. Em agosto, 99,5 % de disponibilidade deixa cerca de 3,7 horas de margem.",
          "Se a contestação de 3 de setembro chegou ao destinatário correto e se houve resposta.",
          "Se existe notificação anterior que cumpra a cláusula 11.2. No dossier não há.",
        ],
      },
      {
        titulo: "Diligências para hoje, antes das 15:00",
        itens: [
          "Enviar à Linha Clara, para os endereços da cláusula 12.1, uma carta que contesta a cessação e a suspensão, anexa o comprovativo de 15 de setembro e pede confirmação escrita de que não haverá suspensão.",
          "Pedir um extrato atualizado da conta corrente e a confirmação do crédito da LC 7841.",
          "Fundamentar e quantificar por escrito a contestação da LC 7996, e pagar já a parte que não é contestada, para retirar o argumento de incumprimento.",
          "Reunir os registos técnicos de disponibilidade de agosto e ponderar o pedido de crédito, mesmo fora de prazo, expondo a razão.",
          "Preparar um plano de contingência (cópia e exportação de dados) para o caso de a suspensão avançar às 18:00.",
        ],
      },
    ],
    notaModelo: {
      titulo: "Exemplo de nota à cliente",
      texto:
        "Marta, a nossa conclusão preliminar, só com base nos documentos, é que a cessação imediata e a suspensão das 18:00 não parecem cumprir o contrato: a resolução exige notificação e 10 dias úteis para sanar (cl. 11.2) e a suspensão só pode visar montantes não contestados, com data e hora indicadas previamente (cl. 7.4). A LC 7996 só vence a 30 de setembro e a LC 7841 foi paga a 15. A principal incerteza é saber se a Linha Clara recebeu esse pagamento: o extrato de dia 16 ainda o mostra pendente. A diligência urgente é enviar hoje, antes das 15:00, a prova da transferência e uma carta a contestar cessação e suspensão, a pedir confirmação escrita de que o serviço continua. Convém também quantificar e fundamentar a contestação da LC 7996 e pagar o que não é contestado.",
      porque: [
        "Começa pela conclusão e diz que é preliminar.",
        "Distingue resolução (11.2) de suspensão (7.4) e cita as cláusulas.",
        "Nomeia uma única incerteza principal, a receção do pagamento.",
        "Termina numa diligência com hora, e não num «aguardemos».",
      ],
    },
  },

  // Cada ponto é detetado por expressões regulares sobre o texto sem acentos e em minúsculas.
  rubrica: [
    { id: "susp-res", label: "Distingue suspensão de resolução", re: [/suspen/, /resolu|cessa|rescis/] },
    { id: "r11-2", label: "Refere o prazo de 10 dias úteis para sanar (cl. 11.2)", re: [/11\.?\s?2|10 dias uteis|dez dias uteis|sanar|sanacao|prazo de regulariza/] },
    { id: "r7-4", label: "Refere os requisitos da suspensão (cl. 7.4)", re: [/7\.?\s?4|data e hora|aviso previo|nao contestad|montante contestado/] },
    { id: "vence", label: "Nota que a LC 7996 ainda não estava vencida", re: [/(ainda )?nao (esta|estava|se encontra|se encontrava) venc|ainda nao venc|vence (a|em|no dia) 30|30 de setembro|30\/09|so vence/] },
    { id: "pagou", label: "Refere o pagamento da LC 7841 em 15 de setembro", re: [/7841|15 de setembro|transferencia|comprovativo/] },
    { id: "incerteza", label: "Assinala a incerteza (receção do pagamento, duração das falhas)", re: [/recep|recebeu|confirm|duracao|incert|por verificar|a verificar|nao sabemos|nao temos/] },
    { id: "falhas", label: "Trata as falhas de agosto como alegação a provar ou crédito (cl. 5.4)", re: [/falhas|indisponibil|disponibilidade|5\.?\s?4|credito de servico|registos tecnicos/] },
    { id: "diligencia", label: "Propõe diligência imediata (prova, carta, confirmação escrita)", re: [/enviar|contestar|contesta|notific|carta|solicit|pedir|exigir|reunir|extrato|comunicar/] },
    { id: "dados", label: "Prevê a exportação ou salvaguarda dos dados (cl. 13.2)", re: [/exporta|13\.?\s?2|salvaguard|copia de seguranca|backup|contingencia/] },
    { id: "prudencia", label: "Usa linguagem prudente e assinala que é preliminar", re: [/preliminar|prudente|parece|aparent|salvo|sem prejuizo|a confirmar|em principio|com base apenas/] },
  ],
  alertas: [
    { id: "categorico", label: "Afirma com certeza o que o dossier não permite", re: [/certamente|sem qualquer duvida|sem duvida|e (manifestamente )?(nula|invalida|ilicita|ilegal)|claramente (ilegal|ilicit|invalid)|garantidamente|nao pode (de modo algum )?suspender/] },
  ],
};
