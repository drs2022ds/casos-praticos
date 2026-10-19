---
name: "extraccao-clausulas-riscos"
description: "Extrair de contratos e documentos societários ou de due diligence os dados e cláusulas relevantes numa tabela estruturada, assinalando riscos e lacunas, com folha de rasto para auditoria."
---

# Extracção de cláusulas e riscos

Usar quando o utilizador fornece um ou mais documentos e quer informação estruturada (por exemplo: partes, datas, prazos, mudança de controlo, cessação, responsabilidade, garantias, covenants).

## Regras
- Usar apenas os documentos fornecidos. Nunca inventar nem completar de memória uma cláusula.
- Cada valor extraído leva a fonte: documento, cláusula ou página e uma transcrição curta.
- Se uma informação não consta do documento, escrever «Não consta» (não deixar em branco nem deduzir).
- Se uma remissão apontar para uma cláusula, anexo ou documento que não existe ou não foi fornecido, dizê-lo; nunca presumir o seu conteúdo.
- Distinguir sempre o que está no texto do que é interpretação tua; marcar a interpretação como tal.
- Se uma parte do documento não for legível (texto em imagem, páginas em falta), dizê-lo; nunca extrair o que não foi lido.
- Português de Portugal, tom formal e conciso. Trabalhar só com documentos anonimizados ou fictícios, salvo indicação da firma.

## Método
1. Perguntar (ou confirmar) os campos a extrair. Se o utilizador não os indicar, propor uma lista adequada ao tipo de documento e pedir confirmação.
2. Para cada documento, preencher todos os campos, um a um.
3. Quando há vários documentos, usar uma linha por documento e as mesmas colunas, para permitir comparação.
4. Assinalar riscos: prazos curtos, mudança de controlo, cessação unilateral, exclusividade, responsabilidade ilimitada, cláusulas inusuais, inconsistências entre documentos ou dentro do mesmo documento (por exemplo, a mesma parte com denominação, sede ou forma societária diferentes).
5. Listar o que falta (anexos, versões, assinaturas, datas).

## Resultado
1. Resumo curto: n.º de documentos, principais riscos.
2. Tabela: Documento | Campo | Valor | Fonte (cláusula e citação) | Risco (alto/médio/baixo/nenhum).
3. Lista de riscos por ordem de gravidade, com a razão.
4. Lacunas e perguntas ao advogado.
5. Folha de rasto (ver abaixo), no fim e sob esse título.
6. Nota final: apoio à análise, a verificar pelo advogado responsável.

## Folha de rasto
Serve para o advogado auditar o trabalho. Só registar o que de facto foi feito; nunca declarar uma verificação que não foi feita; não preencher a validação humana. Estrutura fixa:
1. **Identificação:** nome da skill; lista dos documentos lidos (nome, tipo, data ou versão, se constarem); campos pedidos; data da sessão («[POR PREENCHER]» se não for conhecida).
2. **Cobertura:** n.º de documentos lidos; n.º de campos; n.º de células da tabela (documentos × campos); quantas preenchidas com valor, quantas «Não consta», e confirmação de que a soma é igual ao total de células.
3. **Rasto por documento:** cláusulas e anexos efectivamente lidos; remissões que não foi possível seguir (cláusula inexistente, anexo não fornecido).
4. **Inconsistências detectadas:** dentro de cada documento e entre documentos, com a indicação das duas fontes.
5. **Limitações:** o que não foi lido ou ficou em falta (anexos, páginas, assinaturas); pressupostos assumidos; que interpretações foram marcadas como tal.
6. **Decisões pendentes do advogado:** riscos que exigem decisão, perguntas em aberto.
7. **Verificações feitas:** as perguntas da auto-verificação, com resposta sim/não e como se verificou.
8. **Validação humana (deixar em branco):** Revisto por: ____ · Data: ____ · Observações: ____
Terminar com: a folha é produzida pelo próprio Claude, orienta a verificação e não a substitui.

## Auto-verificação
- Todos os campos foram preenchidos para todos os documentos?
- Cada valor tem fonte e citação?
- O que não consta está marcado «Não consta»?
- Nada foi afirmado sem apoio no texto?
- A folha de rasto só regista o que foi mesmo feito, a soma das células confere e a validação humana ficou em branco?
