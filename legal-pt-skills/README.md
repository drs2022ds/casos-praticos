# Legal PT Skills

Plugin com dez skills para trabalho jurídico em português de Portugal. Todas seguem as mesmas regras: usam só os documentos que o utilizador fornece, citam o documento e a passagem, não inventam, dizem o que falta e terminam com uma **folha de rasto** que deixa a validação humana em branco.

O plugin só lê e produz texto na conversa. Não envia, não grava, não apaga e não se liga a nenhum sistema. Não traz conectores.

## Skills

| Skill | Para quê | Precisa de |
|---|---|---|
| `revisao-contra-playbook` | Classificar cada ponto de um playbook num contrato ou documento, propor alterações | Documento e playbook |
| `extraccao-clausulas-riscos` | Tabela de campos e cláusulas, com riscos e lacunas, para um ou mais documentos | Um ou mais documentos |
| `minuta-a-partir-de-template` | Preencher um modelo da sociedade com factos, sem alterar o que o modelo fixa | Modelo e factos |
| `sintese-jurisprudencia` | Sintetizar decisões com citações exactas | Textos das decisões |
| `detector-obfuscacao` | Assinalar linguagem que reduz a clareza e argumentos mais fracos do que parecem | Texto jurídico |
| `briefing-audiencia` | Temas da prova, factos controvertidos, cronologia, inconsistências e perguntas | Articulados e documentos |
| `calculo-prazos-quadro` | Calcular prazos com a conta passo a passo | Quadro de prazos, notificação e calendário |
| `fluxo-revisao-contraproposta` | Extracção, revisão e carta de contraproposta, com três paragens | Contrato, playbook e modelo de carta |
| `agente-orquestrador-juridico` | Propor um plano, executá-lo por etapas com paragens e entregar uma folha de rasto consolidada | Os documentos da tarefa |
| `criar-skill-juridico` | Ajudar o utilizador a criar e testar uma skill sua | Uma tarefa repetitiva |

## Como se usa

Descrever a tarefa e anexar os documentos. Por exemplo:

- «Reveja o contrato anexo contra o playbook anexo e dê-me a folha de rasto.»
- «Preciso de preparar a audiência e de saber que prazos correm a partir da notificação. Use o agente orquestrador jurídico.»

Quando falta um documento de que a skill depende (o playbook, o modelo, o quadro de prazos, o calendário, os textos das decisões), a skill pede-o e não começa.

## Princípios comuns

- Só os documentos fornecidos. Nenhuma informação externa, nenhum acórdão ou norma de memória.
- Cada afirmação leva a referência ao documento e uma transcrição curta.
- «Não consta» quando o documento é omisso; `[POR PREENCHER]` quando falta um dado.
- Paragens obrigatórias antes de qualquer decisão que cabe ao advogado.
- Documentos anonimizados ou fictícios, salvo indicação da sociedade.
- A folha de rasto é produzida pelo próprio Claude: orienta a verificação e não a substitui.

## Limites

- É um rascunho de trabalho. Quem decide e responde é o advogado.
- Não inclui documentos de exemplo, playbooks, modelos nem dados de nenhuma sociedade.
- Não foi validado em contas de utilizadores finais; ver `CHANGELOG.md`.
- A skill `criar-skill-juridico` e o agente orquestrador não dependem das outras skills, mas funcionam melhor com elas instaladas.

## Estado

Versão 0.1.0. Responsável: Diogo Ribeiro Santos. Licença: MIT (ver `LICENSE`).
