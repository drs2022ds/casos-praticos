---
name: "calculo-prazos-quadro"
description: "Calcular prazos a partir de um quadro de prazos, de uma notificação e de um calendário de feriados fornecidos, mostrando a conta passo a passo e uma folha de rasto. Pára se faltar a regra, a data de notificação ou o calendário."
---

# Cálculo de prazos a partir de um quadro

Usar quando o utilizador fornece uma notificação (ou decisão) e quer saber até quando pode praticar um acto, com base no quadro de prazos da firma.

## Antes de começar
Pedir, e confirmar que foram fornecidos: (1) o quadro de prazos ou norma aplicável, com a regra de contagem; (2) o documento da notificação; (3) o calendário de feriados. Se faltar o quadro ou o calendário, não calcular: dizer o que falta. Nunca usar a memória para prazos, regras de contagem ou feriados.

## Regras
- Usar apenas as regras do quadro fornecido. Se o acto pedido não estiver coberto pelo quadro, escrever «Não consta do quadro» e não calcular.
- A data de partida é a da notificação presumida, obtida aplicando a regra de notificação do quadro à data de registo ou de disponibilização que consta do documento. Não usar a data do documento nem a data de leitura, salvo se o quadro o disser.
- Se a data de registo ou de disponibilização estiver ausente, ilegível ou ambígua, parar e perguntar. Nunca estimar nem escolher uma data.
- Seguir a regra de contagem do quadro: quando começa a contar, dias seguidos ou úteis, dias não contados ou suspensos, transferência quando o último dia não é útil.
- Só são feriados os dias do calendário fornecido. Se o calendário não cobrir o período do prazo, dizê-lo e parar.
- Verificar o dia da semana de cada data relevante por cálculo (com execução de código, se disponível; senão, contando dia a dia e dizendo que foi feito à mão).
- Nunca dizer que o prazo está certo para além do que o quadro e as datas permitem: o resultado é apoio ao advogado, que confirma a norma em vigor.
- Português de Portugal, tom formal e conciso.

## Método
1. Identificar cada notificação e o acto a praticar.
2. Aplicar a regra de notificação do quadro e escrever a data de notificação presumida, com o dia da semana.
3. Escolher a regra do prazo (artigo e número) conforme as circunstâncias do documento; se houver mais de uma regra possível e os documentos não permitirem escolher (por exemplo, se houve ou não reclamação), perguntar.
4. Contar: primeiro dia contado, número de dias, dias não contados ou suspensos (listá-los), data bruta, ajuste por dia não útil, data final com o dia da semana.
5. Recontar em sentido inverso, da data final para a data de partida, e confirmar que dá o mesmo número de dias.
6. Indicar alertas: dias suspensos, transferência por fim-de-semana ou feriado, remissões a artigos fora do quadro.

## Resultado
1. Tabela: Notificação | Acto | Regra (artigo) | Data de notificação presumida (fonte) | Dias | Dias não contados | Data bruta | Ajuste | Data limite (dia da semana).
2. Cálculo passo a passo de cada prazo.
3. Alertas e perguntas ao advogado (a data interna de segurança é decisão do advogado).
4. Folha de rasto (ver abaixo), no fim e sob esse título.
5. Nota final: apoio ao cálculo, a verificar pelo advogado responsável.

## Folha de rasto
Serve para o advogado auditar o trabalho. Só registar o que de facto foi feito; nunca declarar uma verificação que não foi feita; não preencher a validação humana. Estrutura fixa:
1. **Identificação:** nome da skill; quadro de prazos usado (nome e versão, se constarem); calendário usado e período que cobre; notificações lidas; data da sessão («[POR PREENCHER]» se não for conhecida).
2. **Cobertura:** n.º de notificações lidas; n.º de prazos calculados; n.º não calculados e porquê (soma igual ao total).
3. **Rasto por prazo:** regra aplicada (artigo), data de partida e de onde vem, dias não contados, data bruta, ajuste, data final.
4. **Limitações:** o que não foi lido ou falta (datas ilegíveis, calendário que não cobre o período, actos fora do quadro); pressupostos assumidos.
5. **Decisões pendentes do advogado:** confirmar a data de notificação, escolher a regra quando há mais de uma, definir a data interna de segurança, confirmar que o quadro está em vigor.
6. **Verificações feitas:** as perguntas da auto-verificação, com resposta sim/não e como se verificou.
7. **Validação humana (deixar em branco):** Revisto por: ____ · Data: ____ · Observações: ____
Terminar com: a folha é produzida pelo próprio Claude, orienta a verificação e não a substitui.

## Auto-verificação
- A data de partida vem do registo ou da disponibilização, e não da data do documento nem da leitura?
- A regra usada é a do quadro, com o artigo indicado?
- Os dias não contados foram listados e retirados?
- O dia da semana de cada data foi verificado e o último dia não útil foi transferido?
- A recontagem inversa deu o mesmo resultado?
- Os actos fora do quadro e as datas ilegíveis foram assinalados e não calculados?
- A folha de rasto só regista o que foi feito e a validação humana ficou em branco?
