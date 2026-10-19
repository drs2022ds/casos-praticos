---
name: "revisao-contra-playbook"
description: "Rever um contrato ou documento jurídico contra um playbook, política ou checklist fornecidos, classificando cada ponto, propondo alterações e produzindo uma folha de rasto para auditoria."
---

# Revisão contra playbook

Usar quando o utilizador fornece (a) um documento a rever (contrato, minuta, política, regulamento) e (b) um padrão de referência (playbook, política interna, checklist, lei ou termsheet).

## Regras
- Usar apenas os documentos fornecidos. Não inventar posições de playbook nem factos. Se faltar o playbook ou o critério, pedi-lo antes de começar; não improvisar um.
- Citar sempre a cláusula (número e transcrição curta) e o ponto do playbook em que se baseia cada conclusão.
- Escrever em português de Portugal, tom formal e conciso.
- Trabalhar apenas com documentos anonimizados ou fictícios, salvo indicação em contrário da firma.
- Se uma parte do documento não for legível (texto em imagem, páginas em falta, anexos não fornecidos), dizê-lo; nunca classificar o que não foi lido.

## Método
1. Ler o playbook inteiro e listar os seus pontos (tema, posição preferida, fallback, linha vermelha).
2. Para CADA ponto do playbook, procurar a(s) cláusula(s) correspondente(s) no documento. Fazer assim, ponto a ponto, para detectar omissões: se o documento não trata o tema, classificar como Omissão.
3. Ler depois o documento para identificar cláusulas sem correspondente no playbook e assinalá-las à parte, sem as classificar.
4. Classificar cada ponto numa só categoria:
   - Linha vermelha: viola o limite que não se aceita sem aprovação superior.
   - Fora do fallback: pior que o fallback mas sem atingir a linha vermelha.
   - Dentro do fallback: aceitável, mas pior que a posição preferida.
   - Conforme: corresponde à posição preferida.
   - Omissão: o playbook exige tratamento e o documento é omisso.
   - Não aplicável.
   Uma cláusula pode ter vários problemas: indicar cada um. Não marcar como problema o que está dentro do fallback.
5. Verificar números e prazos contra os limiares do playbook, um a um.

## Resultado
1. Resumo: contagem por categoria e recomendação (assinar / negociar / não avançar).
2. Tabela: Cláusula | Tema | Classificação | Porquê (com citação) | Alteração proposta.
3. Para cada linha vermelha ou omissão: a posição exigida pelo playbook e uma redacção alternativa.
4. Pontos fora do playbook.
5. Informação em falta e perguntas ao advogado.
6. Folha de rasto (ver abaixo), sempre no fim e sob o título «Folha de rasto».
7. Nota final: a revisão é um apoio e tem de ser verificada pelo advogado responsável.

## Folha de rasto
A folha de rasto serve para o advogado auditar o trabalho: mostra o que foi lido, como se decidiu e o que falta decidir. Regras: só registar o que de facto foi feito; nunca declarar uma verificação que não foi feita; não preencher a validação humana; não copiar para a folha texto sensível além da referência à cláusula. A folha é produzida pelo próprio Claude, por isso orienta a verificação mas não a substitui: dizê-lo na última linha.

Estrutura fixa:
1. **Identificação:** nome da skill; documento revisto (nome e versão ou data, se constarem); playbook usado (nome e versão ou data, se constarem); data da sessão (se não for conhecida, escrever «[POR PREENCHER]»).
2. **Cobertura:** n.º de pontos do playbook lidos; n.º de pontos classificados; contagem por categoria e confirmação de que a soma é igual ao n.º de pontos do playbook; n.º de cláusulas do documento lidas; cláusulas sem correspondente no playbook.
3. **Rasto por ponto:** tabela Ponto do playbook | Cláusula(s) lida(s) | Classificação | Certeza («clara» ou «depende de interpretação», com a razão).
4. **Limitações:** o que não foi lido ou foi lido só em parte; anexos em falta; pressupostos assumidos.
5. **Decisões pendentes do advogado:** cada linha vermelha e omissão que exige aprovação superior; cada ponto que depende de interpretação; cada pergunta em aberto.
6. **Verificações feitas:** as perguntas da auto-verificação, com resposta sim/não e como se verificou.
7. **Validação humana (deixar em branco):** Revisto por: ____ · Data: ____ · Observações: ____

## Auto-verificação antes de responder
- O número de pontos classificados é igual ao número de pontos do playbook?
- Cada conclusão tem citação do documento e ponto do playbook?
- Nada foi afirmado sem apoio nos documentos fornecidos?
- A folha de rasto só regista o que foi mesmo feito, e a validação humana ficou em branco?
