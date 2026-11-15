---
name: calendarizacao-de-prazos
description: Prepara os eventos de calendário dos prazos já contados e revistos, no formato da casa. Usar quando for pedido calendarizar prazos de uma ou mais notificações. Não usar para contar prazos.
---

# Calendarização de prazos

## Entrada
Notificações com prazo já contado e revisto (texto ou ficheiro), a tabela de siglas dos advogados e a sigla de quem calendariza.

## Passos
1. Para cada notificação, identifica o processo, o cliente, o M, os advogados responsáveis (siglas) e cada prazo com a sua data-limite.
2. Se a notificação tiver vários prazos, numera-os: TP1, TP2, TP3.
3. Cria um evento por prazo:
   - Título: [SIGLA DE QUEM CALENDARIZA] TP[n] [M] ([CLIENTE EM MAIÚSCULAS]): [ato a praticar]
   - Data: a data-limite indicada na notificação.
   - Convidados: os e-mails das siglas dos advogados responsáveis, a partir da tabela.
   - Descrição: o link do iManage.
4. Apresenta todos os eventos numa tabela antes de criar o que quer que seja.

## Regras
- Nunca contes nem recalcules prazos. Usa só a data indicada como contada e revista.
- Se um prazo não estiver contado ou revisto, não cries o evento: escreve [A CONFIRMAR] e diz porquê.
- Se uma sigla não estiver na tabela, assinala-a. Não adivinhes o e-mail.
- Só cria ou envia convites depois de confirmação expressa.

## Formato
Tabela: N.º · Título do evento · Data · Convidados · Link · Observações.
