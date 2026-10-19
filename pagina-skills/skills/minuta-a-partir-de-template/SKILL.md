---
name: "minuta-a-partir-de-template"
description: "Redigir uma minuta (contrato, carta, parecer, procuração) a partir de um modelo da firma e dos factos fornecidos, sem inventar dados nem alterar o que o modelo fixa, e produzir uma folha de rasto para auditoria."
---

# Minuta a partir de template

Usar quando o utilizador fornece um modelo ou precedente e os factos do caso (partes, valores, datas, condições) e pede a minuta.

## Regras
- Usar o modelo como base. Não alterar cláusulas que o modelo fixa, salvo pedido expresso; se uma cláusula do modelo não servir, assinalar e propor alternativa à parte.
- Se os factos ou um pedido do cliente chocarem com uma cláusula fixa do modelo (por exemplo, foro, limite de responsabilidade), manter a cláusula do modelo, não a alterar e comunicar o conflito ao advogado: dizer o que o cliente pediu, o que o modelo fixa e que a alteração depende de decisão do advogado responsável.
- Etiquetas do modelo como [FIXA] e [CLÁUSULA OPCIONAL] são instruções de uso: não as manter no texto da minuta e referi-las, quando relevante, na lista de desvios e opções.
- Não inventar dados. Qualquer variável sem facto correspondente fica como [POR PREENCHER: descrição] e entra na lista de informação em falta.
- Manter a numeração, a estrutura e o estilo do modelo.
- Os factos vêm só do que o utilizador forneceu. Não presumir moradas, NIF, valores ou datas.
- Quando os factos forem incoerentes entre si (por exemplo, percentagens que não somam 100%, datas incompatíveis), não escolher sozinho o valor correcto: deixar [POR PREENCHER] com a explicação e perguntar ao advogado.
- Português de Portugal, tom jurídico formal. Trabalhar só com dados anonimizados ou fictícios, salvo indicação da firma.

## Método
1. Identificar todas as variáveis do modelo (partes, objecto, valores, prazos, foro, anexos).
2. Mapear cada variável para o facto fornecido; listar as que ficam sem correspondência.
3. Redigir a minuta preenchendo as variáveis. Acrescentar cláusulas opcionais do modelo apenas se os factos as justificarem, indicando porquê.
4. Verificar a coerência interna: partes e definições usadas de forma uniforme, remissões entre cláusulas correctas, valores e prazos iguais em todo o texto, soma de percentagens ou prestações.

## Resultado
1. A minuta completa.
2. Lista de variáveis preenchidas e de onde veio cada facto.
3. Lista [POR PREENCHER] e perguntas ao advogado.
4. Desvios ao modelo e conflitos entre os factos e as cláusulas fixas (se houver), com justificação.
5. Folha de rasto (ver abaixo), sempre no fim e sob o título «Folha de rasto».
6. Nota final: minuta de trabalho, a rever e validar pelo advogado responsável.

## Folha de rasto
A folha de rasto serve para o advogado auditar o trabalho: mostra de onde veio cada dado, o que se manteve igual ao modelo e o que falta decidir. Regras: só registar o que de facto foi feito; nunca declarar uma verificação que não foi feita; não preencher a validação humana; não repetir dados pessoais além do necessário. A folha é produzida pelo próprio Claude, por isso orienta a verificação mas não a substitui: dizê-lo na última linha.

Estrutura fixa:
1. **Identificação:** nome da skill; modelo usado (nome e versão, se constarem); documento ou mensagem com os factos; data da sessão (se não for conhecida, escrever «[POR PREENCHER]»).
2. **Variáveis:** tabela Variável | Valor usado | Fonte (documento e frase) | Estado («facto fornecido», «[POR PREENCHER]» ou «pendente de decisão»); no fim, o total de variáveis do modelo e a confirmação de que a soma por estado é igual a esse total.
3. **Cláusulas do modelo:** n.º de cláusulas; cláusulas fixas comparadas com o modelo e se ficaram sem alteração (sim/não, uma a uma); cláusulas opcionais incluídas ou excluídas, com a razão.
4. **Conflitos e incoerências:** pedidos ou factos que chocam com cláusulas fixas; valores que não somam; datas incompatíveis. Indicar o que foi feito (por exemplo, «mantido o modelo») e que a decisão é do advogado.
5. **Limitações:** o que não foi possível ler ou confirmar; pressupostos assumidos.
6. **Verificações feitas:** as perguntas da auto-verificação, com resposta sim/não e como se verificou.
7. **Decisões pendentes do advogado:** lista numerada.
8. **Validação humana (deixar em branco):** Revisto por: ____ · Data: ____ · Observações: ____

## Auto-verificação
- Ficou alguma variável do modelo por tratar?
- Algum dado foi inventado?
- Há remissões, definições ou valores inconsistentes?
- Alguma cláusula fixa foi alterada? Algum pedido que choca com uma cláusula fixa ficou por comunicar?
- A folha de rasto só regista o que foi mesmo feito, a soma das variáveis por estado confere e a validação humana ficou em branco?
